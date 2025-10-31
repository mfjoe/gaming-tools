import { useState, useMemo, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';
import { Player, FilterState, SortOption } from '../types/player';

interface UsePlayerSearchOptions {
  players: Player[];
  initialPosition?: string | null;
  debounceMs?: number;
}

interface UsePlayerSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  results: Player[];
  isLoading: boolean;
  resultCount: number;
  debouncedSearchQuery: string;
}

const defaultFilters: FilterState = {
  positions: [],
  minRating: 0,
  maxRating: 99,
  minPrice: null,
  maxPrice: null,
  platform: 'ps',
  nationalities: [],
  leagues: [],
  clubs: [],
  cardTypes: [],
  workRateAttack: null,
  workRateDefense: null,
  weakFoot: null,
  skillMoves: null,
  preferredFoot: null,
  bodyType: null,
  accelerateType: null,
};

export function usePlayerSearch({
  players,
  initialPosition = null,
  debounceMs = 300,
}: UsePlayerSearchOptions): UsePlayerSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    positions: initialPosition ? [initialPosition] : [],
  }));
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Create Fuse instance (memoized)
  const fuse = useMemo(
    () =>
      new Fuse(players, {
        keys: [
          { name: 'common_name', weight: 2 },
          { name: 'last_name', weight: 1.5 },
          { name: 'first_name', weight: 1 },
          { name: 'club.name', weight: 0.5 },
          { name: 'league.name', weight: 0.5 },
          { name: 'primary_nationality.name', weight: 0.5 },
        ],
        threshold: 0.3,
        limit: 500, // Higher limit for filtering
        includeScore: true,
      }),
    [players]
  );

  // Perform search
  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return players;
    }

    setIsLoading(true);
    const results = fuse.search(debouncedSearchQuery);
    setIsLoading(false);
    return results.map((result) => result.item);
  }, [debouncedSearchQuery, fuse, players]);

  // Apply filters
  const filteredResults = useMemo(() => {
    let filtered = [...searchResults];

    // Position filter
    if (filters.positions.length > 0) {
      filtered = filtered.filter((player) => {
        const allPositions = [player.primary_position, ...player.alternative_positions];
        return filters.positions.some((pos) => allPositions.includes(pos));
      });
    }

    // Rating filter
    filtered = filtered.filter(
      (player) =>
        player.overall_rating >= filters.minRating &&
        player.overall_rating <= filters.maxRating
    );

    // Price filter
    const priceField = `price_${filters.platform}` as keyof Player;
    if (filters.minPrice !== null || filters.maxPrice !== null) {
      filtered = filtered.filter((player) => {
        const price = player[priceField] as number | null;
        if (price === null) return false;
        if (filters.minPrice !== null && price < filters.minPrice) return false;
        if (filters.maxPrice !== null && price > filters.maxPrice) return false;
        return true;
      });
    }

    // Nationality filter
    if (filters.nationalities.length > 0) {
      filtered = filtered.filter((player) =>
        filters.nationalities.includes(player.primary_nationality.id)
      );
    }

    // League filter
    if (filters.leagues.length > 0) {
      filtered = filtered.filter((player) =>
        filters.leagues.includes(player.league.id)
      );
    }

    // Club filter
    if (filters.clubs.length > 0) {
      filtered = filtered.filter((player) =>
        filters.clubs.includes(player.club.id)
      );
    }

    // Card type filter
    if (filters.cardTypes.length > 0) {
      filtered = filtered.filter((player) =>
        filters.cardTypes.includes(player.card_type)
      );
    }

    // Work rate filters
    if (filters.workRateAttack) {
      filtered = filtered.filter(
        (player) => player.work_rate_attack === filters.workRateAttack
      );
    }
    if (filters.workRateDefense) {
      filtered = filtered.filter(
        (player) => player.work_rate_defense === filters.workRateDefense
      );
    }

    // Weak foot filter
    if (filters.weakFoot !== null) {
      filtered = filtered.filter((player) => player.weak_foot === filters.weakFoot);
    }

    // Skill moves filter
    if (filters.skillMoves !== null) {
      filtered = filtered.filter(
        (player) => player.skill_moves === filters.skillMoves
      );
    }

    // Preferred foot filter
    if (filters.preferredFoot) {
      filtered = filtered.filter(
        (player) => player.preferred_foot === filters.preferredFoot
      );
    }

    // Body type filter
    if (filters.bodyType) {
      filtered = filtered.filter((player) => player.body_type === filters.bodyType);
    }

    // AcceleRATE type filter
    if (filters.accelerateType) {
      filtered = filtered.filter(
        (player) => player.accelerate_type === filters.accelerateType
      );
    }

    return filtered;
  }, [searchResults, filters]);

  // Sort results
  const sortedResults = useMemo(() => {
    const sorted = [...filteredResults];

    switch (sortBy) {
      case 'rating-desc':
        return sorted.sort((a, b) => b.overall_rating - a.overall_rating);
      case 'rating-asc':
        return sorted.sort((a, b) => a.overall_rating - b.overall_rating);
      case 'price-asc': {
        const priceField = `price_${filters.platform}` as keyof Player;
        return sorted.sort((a, b) => {
          const priceA = (a[priceField] as number) ?? Infinity;
          const priceB = (b[priceField] as number) ?? Infinity;
          return priceA - priceB;
        });
      }
      case 'price-desc': {
        const priceField = `price_${filters.platform}` as keyof Player;
        return sorted.sort((a, b) => {
          const priceA = (a[priceField] as number) ?? -Infinity;
          const priceB = (b[priceField] as number) ?? -Infinity;
          return priceB - priceA;
        });
      }
      case 'name-asc':
        return sorted.sort((a, b) => {
          const nameA = a.common_name || `${a.first_name} ${a.last_name}`;
          const nameB = b.common_name || `${b.first_name} ${b.last_name}`;
          return nameA.localeCompare(nameB);
        });
      case 'pace-desc':
        return sorted.sort((a, b) => (b.pace ?? 0) - (a.pace ?? 0));
      case 'shooting-desc':
        return sorted.sort((a, b) => (b.shooting ?? 0) - (a.shooting ?? 0));
      case 'passing-desc':
        return sorted.sort((a, b) => (b.passing ?? 0) - (a.passing ?? 0));
      default:
        return sorted;
    }
  }, [filteredResults, sortBy, filters.platform]);

  const setFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      ...defaultFilters,
      positions: initialPosition ? [initialPosition] : [],
    });
  }, [initialPosition]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    clearFilters,
    sortBy,
    setSortBy,
    results: sortedResults,
    isLoading,
    resultCount: sortedResults.length,
    debouncedSearchQuery,
  };
}


