/**
 * Evolution Data
 * Defines all available player evolutions
 */

import { SBCRequirement } from '../types/sbc';

export interface Evolution {
  id: string;
  name: string;
  description: string;
  season: string;
  type: 'permanent' | 'limited';
  expiresAt: Date | null;
  isActive: boolean;
  
  // Eligibility requirements
  requirements: {
    maxRating: number;
    minRating?: number;
    positions?: string[];
    leagues?: string[];
    nations?: string[];
    clubs?: string[];
    cardTypes?: string[];
    maxPrice?: number;
    workRates?: string[];
    weakFootMin?: number;
    skillMovesMin?: number;
  };
  
  // Upgrade stages
  stages: EvolutionStage[];
  
  // Total stats after all upgrades
  totalUpgrades: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
    skillMoves?: number;
    weakFoot?: number;
    positions?: string[];
    playstyles?: string[];
  };
  
  // Cost and time
  totalCost: {
    matches: number;
    goals?: number;
    assists?: number;
    wins?: number;
    squadsCompleted?: number;
  };
  
  estimatedTime: string;
  estimatedCoins: number;
  
  // Meta info
  popularity: number; // 1-100
  worthIt: boolean;
}

export interface EvolutionStage {
  stage: number;
  name: string;
  objectives: EvolutionObjective[];
  upgrades: StatUpgrade[];
  requiredMatches?: number;
}

export interface EvolutionObjective {
  description: string;
  type: 'matches' | 'goals' | 'assists' | 'wins' | 'squad';
  target: number;
  squad?: Partial<SBCRequirement>;
}

export interface StatUpgrade {
  stat: string;
  increase: number;
}

/**
 * Current Season Evolutions
 */
export const EVOLUTIONS: Evolution[] = [
  {
    id: 'level-up-s2',
    name: 'Level Up',
    description: 'Transform your midfielder into a box-to-box powerhouse',
    season: 'Season 2',
    type: 'permanent',
    expiresAt: null,
    isActive: true,
    requirements: {
      maxRating: 82,
      minRating: 75,
      positions: ['CM', 'CDM', 'CAM'],
      cardTypes: ['base', 'rare'],
    },
    stages: [
      {
        stage: 1,
        name: 'Foundation',
        objectives: [
          { description: 'Play 3 matches in Squad Battles on min. Professional', type: 'matches', target: 3 },
        ],
        upgrades: [
          { stat: 'short_passing', increase: 2 },
          { stat: 'long_passing', increase: 2 },
        ],
      },
      {
        stage: 2,
        name: 'Building Momentum',
        objectives: [
          { description: 'Score 2 goals in Rivals or Squad Battles', type: 'goals', target: 2 },
        ],
        upgrades: [
          { stat: 'positioning', increase: 3 },
          { stat: 'finishing', increase: 2 },
        ],
      },
      {
        stage: 3,
        name: 'Squad Builder',
        objectives: [
          { description: 'Submit 82-rated squad', type: 'squad', target: 1 },
        ],
        upgrades: [
          { stat: 'acceleration', increase: 2 },
          { stat: 'sprint_speed', increase: 2 },
        ],
      },
      {
        stage: 4,
        name: 'Playmaker',
        objectives: [
          { description: 'Provide 3 assists in any mode', type: 'assists', target: 3 },
        ],
        upgrades: [
          { stat: 'vision', increase: 3 },
          { stat: 'ball_control', increase: 2 },
        ],
      },
      {
        stage: 5,
        name: 'Complete Midfielder',
        objectives: [
          { description: 'Win 4 matches in Rivals', type: 'wins', target: 4 },
        ],
        upgrades: [
          { stat: 'stamina', increase: 3 },
          { stat: 'strength', increase: 2 },
          { stat: 'defensive_awareness', increase: 2 },
        ],
      },
    ],
    totalUpgrades: {
      pace: 4,
      shooting: 5,
      passing: 7,
      dribbling: 2,
      defending: 2,
      physical: 5,
    },
    totalCost: {
      matches: 10,
      goals: 2,
      assists: 3,
      wins: 4,
      squadsCompleted: 1,
    },
    estimatedTime: '8-12 hours',
    estimatedCoins: 15000,
    popularity: 95,
    worthIt: true,
  },
  {
    id: 'pace-demon-s2',
    name: 'Pace Demon',
    description: 'Boost your winger to lightning-fast speeds',
    season: 'Season 2',
    type: 'permanent',
    expiresAt: null,
    isActive: true,
    requirements: {
      maxRating: 80,
      positions: ['LW', 'RW', 'LM', 'RM'],
      minRating: 72,
    },
    stages: [
      {
        stage: 1,
        name: 'Speed Training',
        objectives: [
          { description: 'Play 2 matches in any mode', type: 'matches', target: 2 },
        ],
        upgrades: [
          { stat: 'acceleration', increase: 3 },
          { stat: 'sprint_speed', increase: 3 },
        ],
      },
      {
        stage: 2,
        name: 'Agility Boost',
        objectives: [
          { description: 'Score 1 goal in Rivals', type: 'goals', target: 1 },
        ],
        upgrades: [
          { stat: 'agility', increase: 4 },
          { stat: 'balance', increase: 3 },
        ],
      },
      {
        stage: 3,
        name: 'Ball Control',
        objectives: [
          { description: 'Win 2 matches in Squad Battles', type: 'wins', target: 2 },
        ],
        upgrades: [
          { stat: 'ball_control', increase: 3 },
          { stat: 'dribbling_stat', increase: 3 },
        ],
      },
      {
        stage: 4,
        name: 'Clinical Finisher',
        objectives: [
          { description: 'Submit 79-rated squad', type: 'squad', target: 1 },
        ],
        upgrades: [
          { stat: 'finishing', increase: 4 },
          { stat: 'shot_power', increase: 3 },
        ],
      },
    ],
    totalUpgrades: {
      pace: 6,
      shooting: 7,
      passing: 0,
      dribbling: 13,
      defending: 0,
      physical: 3,
      skillMoves: 1,
    },
    totalCost: {
      matches: 5,
      goals: 1,
      wins: 2,
      squadsCompleted: 1,
    },
    estimatedTime: '5-8 hours',
    estimatedCoins: 10000,
    popularity: 92,
    worthIt: true,
  },
  {
    id: 'defensive-wall-s2',
    name: 'Defensive Wall',
    description: 'Build an unstoppable defender',
    season: 'Season 2',
    type: 'permanent',
    expiresAt: null,
    isActive: true,
    requirements: {
      maxRating: 83,
      minRating: 76,
      positions: ['CB', 'LB', 'RB'],
    },
    stages: [
      {
        stage: 1,
        name: 'Defensive Foundation',
        objectives: [
          { description: 'Play 3 matches in Rivals', type: 'matches', target: 3 },
        ],
        upgrades: [
          { stat: 'defensive_awareness', increase: 3 },
          { stat: 'standing_tackle', increase: 3 },
        ],
      },
      {
        stage: 2,
        name: 'Physical Presence',
        objectives: [
          { description: 'Win 2 matches with clean sheets', type: 'wins', target: 2 },
        ],
        upgrades: [
          { stat: 'strength', increase: 4 },
          { stat: 'jumping', increase: 3 },
          { stat: 'heading_accuracy', increase: 3 },
        ],
      },
      {
        stage: 3,
        name: 'Speed & Agility',
        objectives: [
          { description: 'Submit 81-rated squad', type: 'squad', target: 1 },
        ],
        upgrades: [
          { stat: 'acceleration', increase: 4 },
          { stat: 'sprint_speed', increase: 3 },
        ],
      },
      {
        stage: 4,
        name: 'Complete Defender',
        objectives: [
          { description: 'Play 5 matches in any mode', type: 'matches', target: 5 },
        ],
        upgrades: [
          { stat: 'sliding_tackle', increase: 3 },
          { stat: 'interceptions', increase: 3 },
          { stat: 'stamina', increase: 3 },
        ],
      },
    ],
    totalUpgrades: {
      pace: 7,
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 15,
      physical: 13,
    },
    totalCost: {
      matches: 8,
      wins: 2,
      squadsCompleted: 1,
    },
    estimatedTime: '6-10 hours',
    estimatedCoins: 12000,
    popularity: 88,
    worthIt: true,
  },
  {
    id: 'false-nine-s3',
    name: 'False 9',
    description: 'Convert your striker into a creative playmaker',
    season: 'Season 3',
    type: 'limited',
    expiresAt: new Date('2025-12-31'),
    isActive: true,
    requirements: {
      maxRating: 84,
      minRating: 78,
      positions: ['ST', 'CF'],
    },
    stages: [
      {
        stage: 1,
        name: 'Passing Excellence',
        objectives: [
          { description: 'Provide 4 assists in Squad Battles', type: 'assists', target: 4 },
        ],
        upgrades: [
          { stat: 'vision', increase: 5 },
          { stat: 'short_passing', increase: 4 },
        ],
      },
      {
        stage: 2,
        name: 'Dribbling Mastery',
        objectives: [
          { description: 'Score 3 goals in Rivals', type: 'goals', target: 3 },
        ],
        upgrades: [
          { stat: 'ball_control', increase: 4 },
          { stat: 'dribbling_stat', increase: 4 },
          { stat: 'agility', increase: 3 },
        ],
      },
      {
        stage: 3,
        name: 'Creative Boost',
        objectives: [
          { description: 'Submit 83-rated squad', type: 'squad', target: 1 },
        ],
        upgrades: [
          { stat: 'positioning', increase: 3 },
          { stat: 'composure', increase: 4 },
        ],
      },
      {
        stage: 4,
        name: 'False 9 Complete',
        objectives: [
          { description: 'Win 5 matches with 2+ goals each', type: 'wins', target: 5 },
        ],
        upgrades: [
          { stat: 'finishing', increase: 3 },
          { stat: 'long_shots', increase: 3 },
          { stat: 'reactions', increase: 4 },
        ],
      },
    ],
    totalUpgrades: {
      pace: 0,
      shooting: 9,
      passing: 9,
      dribbling: 19,
      defending: 0,
      physical: 0,
      positions: ['CAM', 'CF'],
    },
    totalCost: {
      matches: 12,
      goals: 3,
      assists: 4,
      wins: 5,
      squadsCompleted: 1,
    },
    estimatedTime: '10-15 hours',
    estimatedCoins: 18000,
    popularity: 85,
    worthIt: true,
  },
  {
    id: 'budget-beast-s2',
    name: 'Budget Beast',
    description: 'Low-cost evolution for budget squads',
    season: 'Season 2',
    type: 'permanent',
    expiresAt: null,
    isActive: true,
    requirements: {
      maxRating: 76,
      minRating: 70,
      maxPrice: 2000,
    },
    stages: [
      {
        stage: 1,
        name: 'Quick Start',
        objectives: [
          { description: 'Play 2 matches in Squad Battles', type: 'matches', target: 2 },
        ],
        upgrades: [
          { stat: 'pace', increase: 3 },
          { stat: 'dribbling', increase: 3 },
        ],
      },
      {
        stage: 2,
        name: 'Goal Threat',
        objectives: [
          { description: 'Score 1 goal in any mode', type: 'goals', target: 1 },
        ],
        upgrades: [
          { stat: 'shooting', increase: 4 },
        ],
      },
      {
        stage: 3,
        name: 'Complete Player',
        objectives: [
          { description: 'Win 1 match in Rivals', type: 'wins', target: 1 },
        ],
        upgrades: [
          { stat: 'physical', increase: 3 },
          { stat: 'defending', increase: 2 },
        ],
      },
    ],
    totalUpgrades: {
      pace: 3,
      shooting: 4,
      passing: 0,
      dribbling: 3,
      defending: 2,
      physical: 3,
    },
    totalCost: {
      matches: 3,
      goals: 1,
      wins: 1,
      squadsCompleted: 0,
    },
    estimatedTime: '2-4 hours',
    estimatedCoins: 0,
    popularity: 78,
    worthIt: true,
  },
];

/**
 * Get evolution by ID
 */
export function getEvolution(id: string): Evolution | undefined {
  return EVOLUTIONS.find((evo) => evo.id === id);
}

/**
 * Get active evolutions
 */
export function getActiveEvolutions(): Evolution[] {
  return EVOLUTIONS.filter((evo) => evo.isActive);
}

/**
 * Get evolutions by season
 */
export function getEvolutionsBySeason(season: string): Evolution[] {
  return EVOLUTIONS.filter((evo) => evo.season === season);
}

/**
 * Get popular evolutions (sorted by popularity)
 */
export function getPopularEvolutions(limit?: number): Evolution[] {
  const sorted = [...EVOLUTIONS].sort((a, b) => b.popularity - a.popularity);
  return limit ? sorted.slice(0, limit) : sorted;
}

