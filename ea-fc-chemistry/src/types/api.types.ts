/**
 * API Response Types
 * Type definitions for various API providers
 */

export interface FutDBPlayerResponse {
  id: number;
  assetId: number;
  firstName: string;
  lastName: string;
  commonName: string | null;
  rating: number;
  cardType: string;
  version: string | null;
  club: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    id: number;
    name: string;
    logo: string;
  };
  nationality: {
    id: number;
    name: string;
    flag: string;
  };
  position: string;
  positions: string[];
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  price?: {
    ps?: number;
    xbox?: number;
    pc?: number;
  };
  workRate?: {
    attack: string;
    defense: string;
  };
  weakFoot?: number;
  skillMoves?: number;
  preferredFoot: string;
  bodyType?: string | null;
  accelerateType: string;
  faceImage?: string;
}

export interface MSMCPlayerResponse {
  // Similar structure to FutDB
  [key: string]: any;
}

export interface SoFIFAPlayerResponse {
  // Similar structure to FutDB
  [key: string]: any;
}

export interface ApiVersionResponse {
  version: string;
  lastUpdated: string;
}

export interface PriceUpdateResponse {
  prices: Array<{
    playerId: string;
    price: number;
  }>;
}


