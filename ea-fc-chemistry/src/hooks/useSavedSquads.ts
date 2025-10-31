/**
 * React Hook for Saved Squads Management
 */

import { useState, useEffect, useCallback } from 'react';
import { Squad } from '../types/player';
import {
  getSavedSquads,
  saveSquad,
  loadSquad,
  deleteSquad,
  updateSquad,
  toggleFavorite,
  duplicateSquad,
  renameSquad,
  sortSquads,
  searchSquads,
  exportSquads,
  importSquads,
  getStorageInfo,
  SavedSquad,
} from '../services/squadStorage';

interface UseSavedSquadsReturn {
  squads: SavedSquad[];
  isLoading: boolean;
  error: Error | null;
  storageInfo: ReturnType<typeof getStorageInfo>;
  
  // CRUD operations
  save: (squad: Squad, name: string, thumbnail?: string) => string;
  load: (id: string) => SavedSquad | null;
  remove: (id: string) => void;
  update: (id: string, squad: Squad) => void;
  
  // Additional operations
  favorite: (id: string) => void;
  duplicate: (id: string) => string;
  rename: (id: string, newName: string) => void;
  
  // Filtering and sorting
  sort: (sortBy: 'recent' | 'name' | 'rating' | 'chemistry' | 'favorites') => void;
  search: (query: string) => void;
  
  // Import/Export
  exportAll: () => string;
  importAll: (json: string, replace?: boolean) => number;
  
  // Refresh
  refresh: () => void;
}

export function useSavedSquads(): UseSavedSquadsReturn {
  const [squads, setSquads] = useState<SavedSquad[]>([]);
  const [filteredSquads, setFilteredSquads] = useState<SavedSquad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'rating' | 'chemistry' | 'favorites'>('recent');

  const refresh = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      const loaded = getSavedSquads();
      setSquads(loaded);
      
      // Apply search and sort
      let filtered = searchQuery ? searchSquads(searchQuery) : loaded;
      filtered = sortSquads(filtered, sortBy);
      
      setFilteredSquads(filtered);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load squads'));
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, sortBy]);

  // Load on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback((squad: Squad, name: string, thumbnail?: string): string => {
    try {
      setError(null);
      const id = saveSquad(squad, name, thumbnail);
      refresh();
      return id;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save squad');
      setError(error);
      throw error;
    }
  }, [refresh]);

  const load = useCallback((id: string): SavedSquad | null => {
    try {
      setError(null);
      return loadSquad(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load squad'));
      return null;
    }
  }, []);

  const remove = useCallback((id: string): void => {
    try {
      setError(null);
      deleteSquad(id);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete squad'));
      throw err;
    }
  }, [refresh]);

  const updateCallback = useCallback((id: string, squad: Squad): void => {
    try {
      setError(null);
      updateSquad(id, { squad });
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update squad'));
      throw err;
    }
  }, [refresh]);

  const favorite = useCallback((id: string): void => {
    try {
      setError(null);
      toggleFavorite(id);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to toggle favorite'));
      throw err;
    }
  }, [refresh]);

  const duplicate = useCallback((id: string): string => {
    try {
      setError(null);
      const newId = duplicateSquad(id);
      refresh();
      return newId;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to duplicate squad');
      setError(error);
      throw error;
    }
  }, [refresh]);

  const rename = useCallback((id: string, newName: string): void => {
    try {
      setError(null);
      renameSquad(id, newName);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to rename squad'));
      throw err;
    }
  }, [refresh]);

  const sort = useCallback((newSortBy: typeof sortBy): void => {
    setSortBy(newSortBy);
  }, []);

  const search = useCallback((query: string): void => {
    setSearchQuery(query);
  }, []);

  const exportAll = useCallback((): string => {
    try {
      setError(null);
      return exportSquads();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to export squads');
      setError(error);
      throw error;
    }
  }, []);

  const importAll = useCallback((json: string, replace: boolean = false): number => {
    try {
      setError(null);
      const count = importSquads(json, replace);
      refresh();
      return count;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to import squads');
      setError(error);
      throw error;
    }
  }, [refresh]);

  const storageInfo = getStorageInfo();

  return {
    squads: filteredSquads,
    isLoading,
    error,
    storageInfo,
    save,
    load,
    remove,
    update: updateCallback,
    favorite,
    duplicate,
    rename,
    sort,
    search,
    exportAll,
    importAll,
    refresh,
  };
}

