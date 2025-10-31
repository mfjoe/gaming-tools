/**
 * Popular SBC Templates
 * Pre-defined Squad Building Challenge requirements
 */

import { SBCRequirement } from '../types/sbc';

export const POPULAR_SBCS: SBCRequirement[] = [
  {
    id: 'foundation-1',
    name: 'Foundation I',
    description: 'Basic SBC for beginners',
    category: 'foundation',
    difficulty: 1,
    requirements: {
      minRating: 75,
      maxRating: 80,
      minChemistry: 0,
      exactPlayers: 11,
      formation: '4-3-3',
    },
    rewards: {
      packs: ['Gold Pack'],
      coins: 1000,
    },
    estimatedCost: 3000,
    isRepeatable: false,
    expiresAt: null,
  },
  {
    id: 'foundation-2',
    name: 'Foundation II',
    description: 'Intermediate foundation SBC',
    category: 'foundation',
    difficulty: 2,
    requirements: {
      minRating: 78,
      maxRating: 82,
      minChemistry: 15,
      exactPlayers: 11,
      formation: '4-4-2',
    },
    rewards: {
      packs: ['Premium Gold Pack'],
      coins: 2000,
    },
    estimatedCost: 5000,
    isRepeatable: false,
    expiresAt: null,
  },
  {
    id: 'league-specific-epl',
    name: 'Premier League Challenge',
    description: 'Premier League players only',
    category: 'league',
    difficulty: 3,
    requirements: {
      minRating: 82,
      minChemistry: 20,
      exactPlayers: 11,
      formation: '4-3-3',
      leagues: ['Premier League'],
      minLeaguePlayers: 11,
    },
    rewards: {
      packs: ['Rare Gold Pack'],
      coins: 3000,
    },
    estimatedCost: 15000,
    isRepeatable: false,
    expiresAt: null,
  },
  {
    id: 'high-rating-83',
    name: '83-Rated Squad',
    description: 'Build an 83-rated team',
    category: 'rating',
    difficulty: 3,
    requirements: {
      minRating: 83,
      minChemistry: 25,
      exactPlayers: 11,
      formation: '4-3-3',
    },
    rewards: {
      packs: ['Premium Gold Players Pack'],
      coins: 5000,
    },
    estimatedCost: 20000,
    isRepeatable: true,
    expiresAt: null,
  },
  {
    id: 'high-rating-84',
    name: '84-Rated Squad',
    description: 'Build an 84-rated team',
    category: 'rating',
    difficulty: 4,
    requirements: {
      minRating: 84,
      minChemistry: 28,
      exactPlayers: 11,
      formation: '4-4-2',
    },
    rewards: {
      packs: ['Jumbo Premium Gold Pack'],
      coins: 7500,
    },
    estimatedCost: 30000,
    isRepeatable: true,
    expiresAt: null,
  },
  {
    id: 'high-rating-85',
    name: '85-Rated Squad',
    description: 'Build an 85-rated team',
    category: 'rating',
    difficulty: 5,
    requirements: {
      minRating: 85,
      minChemistry: 30,
      exactPlayers: 11,
      formation: '4-3-3',
    },
    rewards: {
      packs: ['Rare Players Pack'],
      coins: 10000,
    },
    estimatedCost: 45000,
    isRepeatable: true,
    expiresAt: null,
  },
  {
    id: 'nation-hybrid',
    name: 'Nation Hybrid',
    description: 'Mix of multiple nations',
    category: 'hybrid',
    difficulty: 3,
    requirements: {
      minRating: 80,
      minChemistry: 22,
      exactPlayers: 11,
      formation: '4-3-2-1',
      minNations: 3,
      maxNations: 5,
    },
    rewards: {
      packs: ['Prime Gold Players Pack'],
      coins: 4000,
    },
    estimatedCost: 12000,
    isRepeatable: false,
    expiresAt: null,
  },
  {
    id: 'league-hybrid',
    name: 'League Hybrid',
    description: 'Mix of multiple leagues',
    category: 'hybrid',
    difficulty: 3,
    requirements: {
      minRating: 81,
      minChemistry: 24,
      exactPlayers: 11,
      formation: '4-1-2-1-2',
      minLeagues: 3,
      maxLeagues: 4,
    },
    rewards: {
      packs: ['Prime Mixed Players Pack'],
      coins: 4500,
    },
    estimatedCost: 14000,
    isRepeatable: false,
    expiresAt: null,
  },
  {
    id: 'icon-challenge',
    name: 'Icon Challenge',
    description: 'High-rated squad for icon SBC',
    category: 'icon',
    difficulty: 6,
    requirements: {
      minRating: 86,
      minChemistry: 33,
      exactPlayers: 11,
      formation: '4-4-2',
      minIFPlayers: 1,
    },
    rewards: {
      packs: ['Ultimate Pack'],
      coins: 15000,
    },
    estimatedCost: 75000,
    isRepeatable: false,
    expiresAt: null,
  },
  {
    id: 'first-owner',
    name: 'First Owner Challenge',
    description: 'First owner players only',
    category: 'special',
    difficulty: 4,
    requirements: {
      minRating: 82,
      minChemistry: 25,
      exactPlayers: 11,
      formation: '4-3-3',
      firstOwnerOnly: true,
    },
    rewards: {
      packs: ['Rare Electrum Players Pack'],
      coins: 6000,
    },
    estimatedCost: 0, // Uses club players only
    isRepeatable: false,
    expiresAt: null,
  },
];

/**
 * Get SBC by ID
 */
export function getSBCById(id: string): SBCRequirement | undefined {
  return POPULAR_SBCS.find((sbc) => sbc.id === id);
}

/**
 * Get SBCs by category
 */
export function getSBCsByCategory(category: string): SBCRequirement[] {
  return POPULAR_SBCS.filter((sbc) => sbc.category === category);
}

/**
 * Get SBCs by difficulty
 */
export function getSBCsByDifficulty(minDifficulty: number, maxDifficulty: number): SBCRequirement[] {
  return POPULAR_SBCS.filter(
    (sbc) => sbc.difficulty >= minDifficulty && sbc.difficulty <= maxDifficulty
  );
}

/**
 * Get affordable SBCs (under budget)
 */
export function getAffordableSBCs(maxBudget: number): SBCRequirement[] {
  return POPULAR_SBCS.filter((sbc) => sbc.estimatedCost <= maxBudget).sort(
    (a, b) => a.estimatedCost - b.estimatedCost
  );
}
