/**
 * Rating Optimizer
 * Finds cheapest combination of players to reach target squad rating
 */

import { Player } from '../types/player';
import { SBCRequirement } from '../types/sbc';
import { RatingOptimizerResult } from '../types/sbc';

/**
 * Calculate squad rating using EA's formula
 * Rating = floor(sum of all ratings / 11)
 */
export function calculateSquadRating(players: Player[]): number {
  if (players.length !== 11) {
    throw new Error('Squad must have exactly 11 players');
  }
  const sum = players.reduce((acc, p) => acc + p.overall_rating, 0);
  return Math.floor(sum / 11);
}

/**
 * Get minimum total rating needed for target average
 */
export function getMinimumTotalRating(targetRating: number): number {
  return targetRating * 11;
}

/**
 * Optimize player selection for target rating at minimum cost
 */
export function optimizeForRating(
  targetRating: number,
  availablePlayers: Player[],
  squadSize: number,
  platform: 'ps' | 'xbox' | 'pc',
  otherRequirements: Partial<SBCRequirement> = {}
): RatingOptimizerResult {
  const minTotal = getMinimumTotalRating(targetRating);
  const priceField = `price_${platform}` as keyof Player;

  // Filter eligible players
  let eligible = availablePlayers.filter((p) => {
    const price = p[priceField] as number | null;
    return price !== null && price > 0;
  });

  // Sort by price per rating point (cost efficiency)
  eligible.sort((a, b) => {
    const priceA = (a[priceField] as number) ?? Infinity;
    const priceB = (b[priceField] as number) ?? Infinity;
    const efficiencyA = priceA / a.overall_rating;
    const efficiencyB = priceB / b.overall_rating;
    return efficiencyA - efficiencyB;
  });

  // Greedy algorithm: Fill with cheapest efficient players first
  const selected: Player[] = [];
  let totalRating = 0;
  let totalCost = 0;

  // Strategy 1: Try to use exactly target rating players
  const exactRatingPlayers = eligible.filter((p) => p.overall_rating === targetRating);
  
  if (exactRatingPlayers.length >= squadSize) {
    // Best case: Use all same rating
    const needed = exactRatingPlayers
      .slice(0, squadSize)
      .sort((a, b) => {
        const priceA = (a[priceField] as number) ?? Infinity;
        const priceB = (b[priceField] as number) ?? Infinity;
        return priceA - priceB;
      });
    
    totalRating = needed.reduce((sum, p) => sum + p.overall_rating, 0);
    totalCost = needed.reduce((sum, p) => sum + ((p[priceField] as number) ?? 0), 0);
    
    return {
      players: needed,
      totalRating,
      averageRating: calculateSquadRating(needed),
      totalCost,
      breakdown: `Used ${squadSize} × ${targetRating} rated players`,
    };
  }

  // Strategy 2: Fill with players that sum to minTotal
  // Greedy approach: start with cheapest players
  eligible.sort((a, b) => {
    const priceA = (a[priceField] as number) ?? Infinity;
    const priceB = (b[priceField] as number) ?? Infinity;
    return priceA - priceB;
  });

  let currentTotal = 0;
  const used = new Set<string>();

  // First pass: Use as many cheap players as possible
  for (const player of eligible) {
    if (selected.length >= squadSize) break;
    if (used.has(player.id)) continue;

    const playerRating = player.overall_rating;
    const remaining = squadSize - selected.length;
    const remainingNeeded = minTotal - currentTotal;

    // Check if adding this player helps without overspending
    if (currentTotal + playerRating * remaining >= minTotal) {
      // This player + remaining minimums can reach target
      selected.push(player);
      currentTotal += playerRating;
      totalCost += (player[priceField] as number) ?? 0;
      used.add(player.id);
    }
  }

  // If not enough, fill remaining slots with minimum needed rating
  while (selected.length < squadSize) {
    const remaining = squadSize - selected.length;
    const needed = minTotal - currentTotal;
    const minNeededRating = Math.ceil(needed / remaining);

    // Find cheapest player with at least minNeededRating
    const filler = eligible.find(
      (p) => !used.has(p.id) && p.overall_rating >= minNeededRating
    );

    if (!filler) {
      // Can't complete, return best effort
      break;
    }

    selected.push(filler);
    currentTotal += filler.overall_rating;
    totalCost += (filler[priceField] as number) ?? 0;
    used.add(filler.id);
  }

  // Ensure we have enough rating
  if (currentTotal < minTotal) {
    // Upgrade lowest rated player if needed
    selected.sort((a, b) => a.overall_rating - b.overall_rating);
    const deficit = minTotal - currentTotal;

    for (let i = 0; i < selected.length && deficit > 0; i++) {
      const current = selected[i];
      const currentPrice = (current[priceField] as number) ?? 0;
      const upgradeNeeded = Math.ceil(deficit);

      // Find cheapest upgrade
      const upgrade = eligible.find(
        (p) =>
          !used.has(p.id) &&
          p.overall_rating >= current.overall_rating + upgradeNeeded &&
          ((p[priceField] as number) ?? Infinity) <= currentPrice * 2 // Don't overspend
      );

      if (upgrade) {
        totalCost -= currentPrice;
        totalCost += (upgrade[priceField] as number) ?? 0;
        currentTotal -= current.overall_rating;
        currentTotal += upgrade.overall_rating;
        selected[i] = upgrade;
        used.delete(current.id);
        used.add(upgrade.id);
      }
    }
  }

  const avgRating = selected.length === 11 ? calculateSquadRating(selected) : Math.floor(currentTotal / selected.length);

  return {
    players: selected,
    totalRating: currentTotal,
    averageRating: avgRating,
    totalCost,
    breakdown: `Total rating: ${currentTotal} (avg: ${avgRating.toFixed(1)}) using ${selected.length} players`,
  };
}

/**
 * Find cheapest players for specific rating requirements
 */
export function findCheapestForRating(
  targetRating: number,
  count: number,
  availablePlayers: Player[],
  platform: 'ps' | 'xbox' | 'pc'
): Player[] {
  const priceField = `price_${platform}` as keyof Player;

  return availablePlayers
    .filter((p) => p.overall_rating === targetRating && (p[priceField] as number | null) !== null)
    .sort((a, b) => {
      const priceA = (a[priceField] as number) ?? Infinity;
      const priceB = (b[priceField] as number) ?? Infinity;
      return priceA - priceB;
    })
    .slice(0, count);
}


