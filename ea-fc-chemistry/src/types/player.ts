/**
 * Player and Search Type Definitions
 */

export type CardType = 'base' | 'rare' | 'icon' | 'hero' | 'totw' | 'toty' | 'promo';
export type WorkRate = 'High' | 'Medium' | 'Low';
export type PreferredFoot = 'Left' | 'Right';
export type AccelerateType = 'Controlled' | 'Explosive' | 'Lengthy';
export type Platform = 'ps' | 'xbox' | 'pc';

export interface Player {
  id: string;
  asset_id: number;
  first_name: string;
  last_name: string;
  common_name: string | null;
  overall_rating: number;
  card_type: CardType;
  version: string | null;
  club: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  league: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  primary_nationality: {
    id: string;
    name: string;
    flag_url: string | null;
  };
  primary_position: string;
  alternative_positions: string[];
  pace: number | null;
  shooting: number | null;
  passing: number | null;
  dribbling: number | null;
  defending: number | null;
  physical: number | null;
  price_ps: number | null;
  price_xbox: number | null;
  price_pc: number | null;
  work_rate_attack: WorkRate;
  work_rate_defense: WorkRate;
  weak_foot: number | null;
  skill_moves: number | null;
  preferred_foot: PreferredFoot;
  body_type: string | null;
  accelerate_type: AccelerateType;
  face_image_url?: string;
}

export type SortOption =
  | 'rating-desc'
  | 'rating-asc'
  | 'price-desc'
  | 'price-asc'
  | 'name-asc'
  | 'pace-desc'
  | 'shooting-desc'
  | 'passing-desc';

export interface FilterState {
  positions: string[];
  minRating: number;
  maxRating: number;
  minPrice: number | null;
  maxPrice: number | null;
  platform: Platform;
  nationalities: string[];
  leagues: string[];
  clubs: string[];
  cardTypes: CardType[];
  workRateAttack: WorkRate | null;
  workRateDefense: WorkRate | null;
  weakFoot: number | null;
  skillMoves: number | null;
  preferredFoot: PreferredFoot | null;
  bodyType: string | null;
  accelerateType: AccelerateType | null;
}


