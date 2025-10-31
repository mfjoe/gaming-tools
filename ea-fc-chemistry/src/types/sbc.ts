/**
 * SBC (Squad Building Challenge) Types
 */

import { Player } from './player';

export interface SBCRequirement {
  id: string;
  name: string;
  description: string;

  // Squad requirements
  minRating: number | null;
  maxRating: number | null;
  minChemistry: number | null;
  exactPlayers: number; // Usually 11 (starting XI only)

  // Position requirements
  requiredPositions: {
    position: string;
    count: number;
  }[];

  // Player attribute requirements
  minRarePlayers: number | null;
  minSpecialCards: number | null;
  maxSameClub: number | null;
  minDifferentClubs: number | null;
  minDifferentLeagues: number | null;
  minDifferentNations: number | null;

  // Specific requirements
  requiredClubs: string[] | null;
  requiredLeagues: string[] | null;
  requiredNations: string[] | null;
  minPlayersFromClub: { club: string; count: number }[] | null;
  minPlayersFromLeague: { league: string; count: number }[] | null;
  minPlayersFromNation: { nation: string; count: number }[] | null;

  // Rating conditions
  minRatingPlayers: {
    rating: number;
    count: number;
  }[] | null;

  // Rewards
  reward: {
    type: 'pack' | 'player' | 'coins';
    value: string;
    tradeable: boolean;
  };

  // Meta
  repeatable: boolean;
  expiresAt: Date | null;
  estimatedCost: number | null;
}

export interface SolverOptions {
  userClub: Player[];
  preferUntradeable: boolean;
  maxBudget: number | null;
  platform: 'ps' | 'xbox' | 'pc';
  allowPartialSolution: boolean;
}

export interface SolverResult {
  success: boolean;
  squad: Player[]; // EXACTLY 11 players (no bench!)
  totalCost: number;
  untradeableUsed: number;
  marketBuys: Player[];
  reasoning: string[];
  alternativeSolutions?: SolverResult[];
  warnings: string[];
  totalRating: number;
  averageRating: number;
  totalChemistry: number;
}

export interface ClubPlayer extends Player {
  isUntradeable: boolean;
  isDuplicate: boolean;
  sbcValue: number; // Rating / Market Price ratio
  recommendedUse: 'keep' | 'sbc' | 'sell';
  quantity: number; // How many copies owned
}

export interface CostBreakdown {
  clubPlayers: {
    player: Player;
    marketValue: number;
    actualCost: number;
  }[];
  marketBuys: {
    player: Player;
    price: number;
  }[];
  totalMarketValue: number;
  actualCost: number;
  savings: number;
}

export interface RatingOptimizerResult {
  players: Player[];
  totalRating: number;
  averageRating: number;
  totalCost: number;
  breakdown: string;
}


