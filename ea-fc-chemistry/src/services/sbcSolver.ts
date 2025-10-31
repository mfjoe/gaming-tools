/**
 * SBC Solver - Intelligent Squad Building Challenge Optimizer
 * Minimizes cost while meeting all requirements
 */

import { Player } from '../types/player';
import { SBCRequirement, SolverOptions, SolverResult, ClubPlayer } from '../types/sbc';
import { calculateSquadRating, optimizeForRating } from './ratingOptimizer';
import { calculateSquadChemistry, meetsChemistryRequirement, optimizeChemistry } from './chemistryOptimizer';

/**
 * Validate that solution uses exactly 11 players (no bench waste)
 */
export function validateNoBenchWaste(squad: Player[]): { valid: boolean; error?: string } {
  if (squad.length > 11) {
    return {
      valid: false,
      error: '⚠️ WARNING: This solution includes bench players. SBCs only require starting XI!',
    };
  }
  if (squad.length < 11) {
    return {
      valid: false,
      error: `⚠️ WARNING: Only ${squad.length} players selected. SBCs require exactly 11 players.`,
    };
  }
  return { valid: true };
}

/**
 * Main SBC Solver Function
 */
export async function solveSBC(
  requirement: SBCRequirement,
  options: SolverOptions
): Promise<SolverResult> {
  const warnings: string[] = [];
  const reasoning: string[] = [];
  const marketBuys: Player[] = [];

  // Step 1: Filter eligible players
  reasoning.push('Step 1: Filtering eligible players...');
  const eligible = filterEligiblePlayers(
    options.userClub,
    requirement,
    options.platform
  );

  if (eligible.length < requirement.exactPlayers) {
    // Need to buy players
    reasoning.push(`Need to buy ${requirement.exactPlayers - eligible.length} players from market`);
  }

  // Step 2: Prioritize untradeable fodder
  const sortedByValue = sortByFodderValue(eligible, options.platform);
  reasoning.push(`Prioritizing ${sortedByValue.filter((p) => (p as ClubPlayer).isUntradeable).length} untradeable cards`);

  // Step 3: Fill specific requirements first
  const requiredSlots = fillSpecificRequirements(requirement, sortedByValue);
  reasoning.push(`Locked ${requiredSlots.length} slots for specific requirements`);

  // Step 4: Optimize rating requirement
  if (requirement.minRating) {
    const remainingSlots = requirement.exactPlayers - requiredSlots.length;
    const remainingRating = calculateRemainingRating(
      requirement.minRating,
      requiredSlots
    );
    
    const ratingSolution = optimizeForRating(
      requirement.minRating || 0,
      getAvailablePlayers(sortedByValue, requiredSlots),
      remainingSlots,
      options.platform,
      requirement
    );

    requiredSlots.push(...ratingSolution.players);
    reasoning.push(`Filled remaining slots with ${remainingSlots} players averaging ${ratingSolution.averageRating.toFixed(1)} rating`);
  }

  // Ensure exactly 11 players
  let squad = requiredSlots.slice(0, 11);

  // Step 5: Validate chemistry
  if (requirement.minChemistry) {
    const chemCheck = meetsChemistryRequirement(squad, requirement.minChemistry);
    if (!chemCheck.valid) {
      reasoning.push(`Chemistry issue: ${chemCheck.message}`);
      // Try to optimize chemistry by rearranging
      const optimized = optimizeChemistryForRequirement(squad, requirement.minChemistry);
      if (optimized) {
        squad = optimized;
        reasoning.push('Rearranged players to meet chemistry requirement');
      } else {
        warnings.push(chemCheck.message);
      }
    }
  }

  // Step 6: Calculate costs
  const costBreakdown = calculateCostBreakdown(
    squad,
    options.userClub,
    options.platform
  );

  // Step 7: Final validation
  const validation = validateRequirements(squad, requirement);
  if (!validation.valid) {
    warnings.push(...validation.errors);
  }

  const benchCheck = validateNoBenchWaste(squad);
  if (!benchCheck.valid) {
    warnings.push(benchCheck.error || 'Bench validation failed');
  }

  const totalRating = calculateSquadRating(squad);
  const chemistry = calculateSquadChemistry(squad);

  // Step 8: Generate alternative solutions
  const alternatives = await generateAlternatives(requirement, options, squad, costBreakdown.actualCost);

  return {
    success: validation.valid && benchCheck.valid,
    squad,
    totalCost: costBreakdown.actualCost,
    untradeableUsed: squad.filter((p) => 
      options.userClub.some((up) => up.id === p.id && (up as ClubPlayer).isUntradeable)
    ).length,
    marketBuys: costBreakdown.marketBuys.map((b) => b.player),
    reasoning,
    alternativeSolutions: alternatives.length > 0 ? alternatives : undefined,
    warnings,
    totalRating,
    averageRating: totalRating,
    totalChemistry: chemistry.totalChemistry,
  };
}

/**
 * Filter players that meet basic requirements
 */
function filterEligiblePlayers(
  available: Player[],
  requirement: SBCRequirement,
  platform: 'ps' | 'xbox' | 'pc'
): Player[] {
  let eligible = [...available];
  const priceField = `price_${platform}` as keyof Player;

  // Filter by rating range
  if (requirement.minRating) {
    eligible = eligible.filter((p) => p.overall_rating >= requirement.minRating!);
  }
  if (requirement.maxRating) {
    eligible = eligible.filter((p) => p.overall_rating <= requirement.maxRating!);
  }

  // Filter by specific clubs
  if (requirement.requiredClubs) {
    eligible = eligible.filter((p) =>
      requirement.requiredClubs!.includes(p.club.id)
    );
  }

  // Filter by specific leagues
  if (requirement.requiredLeagues) {
    eligible = eligible.filter((p) =>
      requirement.requiredLeagues!.includes(p.league.id)
    );
  }

  // Filter by specific nations
  if (requirement.requiredNations) {
    eligible = eligible.filter((p) =>
      requirement.requiredNations!.includes(p.primary_nationality.id)
    );
  }

  // Filter by card type
  if (requirement.minSpecialCards && requirement.minSpecialCards > 0) {
    // Allow special cards, but also allow base cards
    // Will handle in selection logic
  }

  // Must have a price (can be bought)
  eligible = eligible.filter((p) => {
    const price = p[priceField] as number | null;
    return price !== null && price > 0;
  });

  return eligible;
}

/**
 * Sort players by "fodder value" (rating to price ratio)
 * Untradeables and duplicates first
 */
function sortByFodderValue(
  players: Player[],
  platform: 'ps' | 'xbox' | 'pc'
): Player[] {
  const priceField = `price_${platform}` as keyof Player;

  return players.sort((a, b) => {
    const aClub = a as ClubPlayer;
    const bClub = b as ClubPlayer;

    // Untradeables first
    if (aClub.isUntradeable && !bClub.isUntradeable) return -1;
    if (!aClub.isUntradeable && bClub.isUntradeable) return 1;

    // Duplicates next
    if (aClub.isDuplicate && !bClub.isDuplicate) return -1;
    if (!aClub.isDuplicate && bClub.isDuplicate) return 1;

    // Then by fodder value (rating / price)
    const priceA = (a[priceField] as number) ?? Infinity;
    const priceB = (b[priceField] as number) ?? Infinity;
    const valueA = a.overall_rating / Math.max(priceA, 100); // Avoid division by zero
    const valueB = b.overall_rating / Math.max(priceB, 100);

    return valueB - valueA; // Higher value first
  });
}

/**
 * Fill slots with specific requirements (e.g., Premier League, Icons)
 */
function fillSpecificRequirements(
  requirement: SBCRequirement,
  available: Player[]
): Player[] {
  const selected: Player[] = [];
  const used = new Set<string>();

  // Required leagues
  if (requirement.minPlayersFromLeague) {
    for (const req of requirement.minPlayersFromLeague) {
      const needed = req.count;
      const players = available
        .filter(
          (p) =>
            !used.has(p.id) &&
            p.league.id === req.league &&
            selected.filter((sp) => sp.league.id === req.league).length < needed
        )
        .slice(0, needed);
      selected.push(...players);
      players.forEach((p) => used.add(p.id));
    }
  }

  // Required clubs
  if (requirement.minPlayersFromClub) {
    for (const req of requirement.minPlayersFromClub) {
      const needed = req.count;
      const players = available
        .filter(
          (p) =>
            !used.has(p.id) &&
            p.club.id === req.club &&
            selected.filter((sp) => sp.club.id === req.club).length < needed
        )
        .slice(0, needed);
      selected.push(...players);
      players.forEach((p) => used.add(p.id));
    }
  }

  // Required nations
  if (requirement.minPlayersFromNation) {
    for (const req of requirement.minPlayersFromNation) {
      const needed = req.count;
      const players = available
        .filter(
          (p) =>
            !used.has(p.id) &&
            p.primary_nationality.id === req.nation &&
            selected.filter((sp) => sp.primary_nationality.id === req.nation).length < needed
        )
        .slice(0, needed);
      selected.push(...players);
      players.forEach((p) => used.add(p.id));
    }
  }

  // Special cards requirement
  if (requirement.minSpecialCards && requirement.minSpecialCards > 0) {
    const needed = requirement.minSpecialCards;
    const special = available
      .filter(
        (p) =>
          !used.has(p.id) &&
          (p.card_type === 'icon' ||
            p.card_type === 'hero' ||
            p.card_type === 'totw' ||
            p.card_type === 'toty' ||
            p.card_type === 'promo') &&
          selected.filter(
            (sp) =>
              sp.card_type !== 'base' && sp.card_type !== 'rare'
          ).length < needed
      )
      .slice(0, needed);
    selected.push(...special);
    special.forEach((p) => used.add(p.id));
  }

  return selected;
}

/**
 * Calculate remaining rating needed after filling required slots
 */
function calculateRemainingRating(
  minRating: number,
  selected: Player[]
): number {
  const currentTotal = selected.reduce((sum, p) => sum + p.overall_rating, 0);
  const minTotal = minRating * 11;
  return Math.max(0, minTotal - currentTotal);
}

/**
 * Get available players excluding already selected
 */
function getAvailablePlayers(
  available: Player[],
  selected: Player[]
): Player[] {
  const selectedIds = new Set(selected.map((p) => p.id));
  return available.filter((p) => !selectedIds.has(p.id));
}

/**
 * Optimize chemistry by rearranging players
 */
function optimizeChemistryForRequirement(
  squad: Player[],
  minChemistry: number
): Player[] | null {
  // Try to optimize chemistry
  // For now, just validate current squad meets requirement
  const chemCheck = meetsChemistryRequirement(squad, minChemistry);
  return chemCheck.valid ? squad : null;
  
  // Future: Implement player swapping logic for better chemistry
  // const result = optimizeChemistry(squad, minChemistry);
  // return result ? squad : null;
}

/**
 * Calculate cost breakdown
 */
function calculateCostBreakdown(
  squad: Player[],
  userClub: Player[],
  platform: 'ps' | 'xbox' | 'pc'
) {
  const priceField = `price_${platform}` as keyof Player;
  const clubPlayerIds = new Set(userClub.map((p) => p.id));

  const clubPlayers = squad.filter((p) => clubPlayerIds.has(p.id));
  const marketBuys = squad.filter((p) => !clubPlayerIds.has(p.id));

  const breakdown = {
    clubPlayers: clubPlayers.map((p) => ({
      player: p,
      marketValue: (p[priceField] as number) ?? 0,
      actualCost: 0, // Already owned
    })),
    marketBuys: marketBuys.map((p) => ({
      player: p,
      price: (p[priceField] as number) ?? 0,
    })),
    totalMarketValue: squad.reduce((sum, p) => sum + ((p[priceField] as number) ?? 0), 0),
    actualCost: marketBuys.reduce((sum, p) => sum + ((p[priceField] as number) ?? 0), 0),
    savings: 0,
  };

  breakdown.savings = breakdown.totalMarketValue - breakdown.actualCost;

  return breakdown;
}

/**
 * Validate all requirements are met
 */
function validateRequirements(
  squad: Player[],
  requirement: SBCRequirement
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check exact player count
  if (squad.length !== requirement.exactPlayers) {
    errors.push(`Expected ${requirement.exactPlayers} players, got ${squad.length}`);
  }

  // Check rating
  if (requirement.minRating) {
    const rating = calculateSquadRating(squad);
    if (rating < requirement.minRating) {
      errors.push(`Rating ${rating} below required ${requirement.minRating}`);
    }
  }

  // Check chemistry
  if (requirement.minChemistry) {
    const chemCheck = meetsChemistryRequirement(squad, requirement.minChemistry);
    if (!chemCheck.valid) {
      errors.push(chemCheck.message);
    }
  }

  // Check required positions
  if (requirement.requiredPositions) {
    for (const req of requirement.requiredPositions) {
      const count = squad.filter(
        (p) =>
          p.primary_position === req.position ||
          p.alternative_positions.includes(req.position)
      ).length;
      if (count < req.count) {
        errors.push(`Need ${req.count} ${req.position}, found ${count}`);
      }
    }
  }

  // Check different clubs/leagues/nations
  if (requirement.minDifferentClubs) {
    const uniqueClubs = new Set(squad.map((p) => p.club.id));
    if (uniqueClubs.size < requirement.minDifferentClubs) {
      errors.push(`Need ${requirement.minDifferentClubs} different clubs, found ${uniqueClubs.size}`);
    }
  }

  if (requirement.minDifferentLeagues) {
    const uniqueLeagues = new Set(squad.map((p) => p.league.id));
    if (uniqueLeagues.size < requirement.minDifferentLeagues) {
      errors.push(`Need ${requirement.minDifferentLeagues} different leagues, found ${uniqueLeagues.size}`);
    }
  }

  if (requirement.minDifferentNations) {
    const uniqueNations = new Set(squad.map((p) => p.primary_nationality.id));
    if (uniqueNations.size < requirement.minDifferentNations) {
      errors.push(`Need ${requirement.minDifferentNations} different nations, found ${uniqueNations.size}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate alternative solutions
 */
async function generateAlternatives(
  requirement: SBCRequirement,
  options: SolverOptions,
  currentSquad: Player[],
  currentCost: number
): Promise<SolverResult[]> {
  const alternatives: SolverResult[] = [];

  // Try cheaper solution
  const cheaperOptions = { ...options, maxBudget: currentCost * 0.9 };
  try {
    const cheaper = await solveSBC(requirement, cheaperOptions);
    if (cheaper.success && cheaper.totalCost < currentCost) {
      alternatives.push({ ...cheaper, reasoning: ['Cheaper alternative solution'] });
    }
  } catch {
    // Ignore errors
  }

  return alternatives;
}

