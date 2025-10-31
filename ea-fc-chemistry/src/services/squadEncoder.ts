/**
 * Squad Encoder/Decoder
 * Encodes squads to compact strings for URL sharing
 */

import { Squad, Player, Manager } from '../types/player';

interface EncodedSquad {
  v: number; // Version
  f: string; // Formation ID
  p: (string | null)[]; // Player IDs (11 players)
  s?: (string | null)[]; // Substitute IDs (7 slots)
  m?: {
    // Manager
    n: string; // Nationality ID
    l: string; // League ID
  };
  n?: string; // Squad name
  c?: number; // Created timestamp
}

/**
 * Encode squad to compact string
 */
export function encodeSquad(squad: Squad): string {
  try {
    const encoded: EncodedSquad = {
      v: 1, // Version for future compatibility
      f: squad.formation || '4-4-2',
      p: squad.players.map((p) => (p ? p.id : null)),
    };

    // Optional fields
    if (squad.substitutes && squad.substitutes.length > 0) {
      encoded.s = squad.substitutes.map((p) => (p ? p.id : null));
    }

    if (squad.manager) {
      encoded.m = {
        n: squad.manager.nationality.id,
        l: squad.manager.league.id,
      };
    }

    if (squad.name) {
      encoded.n = squad.name;
    }

    encoded.c = Date.now();

    // Convert to JSON and compress
    const json = JSON.stringify(encoded);
    
    // Use base64 encoding for URL safety
    const base64 = btoa(json);
    
    // For even more compression, we could use LZ-string
    // but for now base64 is sufficient and widely compatible
    return base64;
  } catch (error) {
    console.error('Error encoding squad:', error);
    throw new Error('Failed to encode squad');
  }
}

/**
 * Decode string back to encoded squad data
 */
export function decodeSquad(encoded: string): EncodedSquad | null {
  try {
    // Decode base64
    const json = atob(encoded);
    const decoded = JSON.parse(json) as EncodedSquad;

    // Validate version
    if (!decoded.v || decoded.v > 1) {
      console.error('Unsupported squad version:', decoded.v);
      return null;
    }

    // Validate required fields
    if (!decoded.f || !decoded.p || decoded.p.length !== 11) {
      console.error('Invalid squad structure');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Error decoding squad:', error);
    return null;
  }
}

/**
 * Generate shareable URL
 */
export function generateSquadURL(squad: Squad, useQueryParam: boolean = false): string {
  const encoded = encodeSquad(squad);
  const baseURL = typeof window !== 'undefined' ? window.location.origin : '';

  if (useQueryParam) {
    return `${baseURL}/squad-builder?s=${encoded}`;
  }

  return `${baseURL}/squad/${encoded}`;
}

/**
 * Parse URL and extract encoded squad
 */
export function getEncodedSquadFromURL(): string | null {
  if (typeof window === 'undefined') return null;

  // Check query parameter
  const params = new URLSearchParams(window.location.search);
  const queryEncoded = params.get('s');
  if (queryEncoded) {
    return queryEncoded;
  }

  // Check pathname for /squad/:encoded pattern
  const pathMatch = window.location.pathname.match(/\/squad\/(.+)/);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }

  return null;
}

/**
 * Validate encoded squad string
 */
export function validateEncodedSquad(encoded: string): {
  valid: boolean;
  error?: string;
} {
  try {
    const decoded = decodeSquad(encoded);
    if (!decoded) {
      return { valid: false, error: 'Invalid squad data' };
    }

    if (decoded.p.length !== 11) {
      return { valid: false, error: 'Squad must have 11 players' };
    }

    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Get squad summary from encoded string (without full player data)
 */
export function getSquadSummary(encoded: string): {
  formation: string;
  playerCount: number;
  hasManager: boolean;
  name?: string;
  createdAt?: Date;
} | null {
  const decoded = decodeSquad(encoded);
  if (!decoded) return null;

  return {
    formation: decoded.f,
    playerCount: decoded.p.filter((p) => p !== null).length,
    hasManager: !!decoded.m,
    name: decoded.n,
    createdAt: decoded.c ? new Date(decoded.c) : undefined,
  };
}

/**
 * Compress using LZ-string (advanced compression)
 * Requires: npm install lz-string
 */
export function encodeSquadCompressed(squad: Squad): string {
  try {
    // For future implementation with lz-string
    // import { compressToEncodedURIComponent } from 'lz-string';
    // const json = JSON.stringify(encoded);
    // return compressToEncodedURIComponent(json);
    
    // For now, use base64
    return encodeSquad(squad);
  } catch (error) {
    console.error('Error compressing squad:', error);
    throw new Error('Failed to compress squad');
  }
}

/**
 * Generate short code (requires backend)
 * Placeholder for future implementation
 */
export async function generateShortURL(squad: Squad): Promise<string> {
  // This would require a backend service to store squad data
  // and generate short codes
  
  // Example implementation:
  // const response = await fetch('/api/squads/shorten', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ squad })
  // });
  // const { shortCode } = await response.json();
  // return `${window.location.origin}/s/${shortCode}`;

  throw new Error('Short URL generation requires backend implementation');
}

/**
 * Parse player IDs from encoded squad
 */
export function getPlayerIdsFromEncoded(encoded: string): string[] {
  const decoded = decodeSquad(encoded);
  if (!decoded) return [];

  const playerIds = decoded.p.filter((id): id is string => id !== null);
  
  if (decoded.s) {
    const subIds = decoded.s.filter((id): id is string => id !== null);
    playerIds.push(...subIds);
  }

  return playerIds;
}

