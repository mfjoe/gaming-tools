/**
 * React Hook for Loading Squad from URL
 */

import { useState, useEffect } from 'react';
import { Squad, Player } from '../types/player';
import { getEncodedSquadFromURL, decodeSquad, getPlayerIdsFromEncoded } from '../services/squadEncoder';

interface UseSquadFromURLReturn {
  squad: Squad | null;
  isLoading: boolean;
  error: Error | null;
  hasSquadInURL: boolean;
}

/**
 * Hook to load squad from URL parameters
 * Requires player database to resolve player IDs
 */
export function useSquadFromURL(
  playerDatabase: Player[]
): UseSquadFromURLReturn {
  const [squad, setSquad] = useState<Squad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasSquadInURL, setHasSquadInURL] = useState(false);

  useEffect(() => {
    async function loadFromURL() {
      try {
        setIsLoading(true);
        setError(null);

        // Check if URL contains squad data
        const encoded = getEncodedSquadFromURL();
        
        if (!encoded) {
          setHasSquadInURL(false);
          setSquad(null);
          return;
        }

        setHasSquadInURL(true);

        // Decode squad data
        const decoded = decodeSquad(encoded);
        
        if (!decoded) {
          throw new Error('Invalid squad URL');
        }

        // Resolve player IDs to actual player objects
        const players: (Player | null)[] = decoded.p.map((playerId) => {
          if (!playerId) return null;
          const player = playerDatabase.find((p) => p.id === playerId);
          return player || null;
        });

        // Resolve substitutes
        const substitutes: (Player | null)[] = decoded.s
          ? decoded.s.map((playerId) => {
              if (!playerId) return null;
              const player = playerDatabase.find((p) => p.id === playerId);
              return player || null;
            })
          : [];

        // Resolve manager (if exists)
        let manager = null;
        if (decoded.m) {
          // Create manager object (you may need to fetch from database)
          manager = {
            nationality: { id: decoded.m.n, name: '', flag_url: '' },
            league: { id: decoded.m.l, name: '', logo_url: '' },
          };
        }

        // Build squad object
        const loadedSquad: Squad = {
          formation: decoded.f,
          players,
          substitutes,
          manager,
          name: decoded.n,
          totalChemistry: 0, // Will be calculated
          createdAt: decoded.c ? new Date(decoded.c) : new Date(),
        };

        setSquad(loadedSquad);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load squad from URL');
        setError(error);
        console.error('Error loading squad from URL:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFromURL();
  }, [playerDatabase]);

  return {
    squad,
    isLoading,
    error,
    hasSquadInURL,
  };
}

/**
 * Simple version without player database
 * Returns just the encoded data for manual resolution
 */
export function useEncodedSquadFromURL(): {
  encoded: string | null;
  decoded: ReturnType<typeof decodeSquad>;
  playerIds: string[];
  hasSquadInURL: boolean;
} {
  const [encoded, setEncoded] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<ReturnType<typeof decodeSquad>>(null);
  const [playerIds, setPlayerIds] = useState<string[]>([]);
  const [hasSquadInURL, setHasSquadInURL] = useState(false);

  useEffect(() => {
    const enc = getEncodedSquadFromURL();
    setEncoded(enc);
    setHasSquadInURL(!!enc);

    if (enc) {
      const dec = decodeSquad(enc);
      setDecoded(dec);
      
      if (dec) {
        const ids = getPlayerIdsFromEncoded(enc);
        setPlayerIds(ids);
      }
    }
  }, []);

  return {
    encoded,
    decoded,
    playerIds,
    hasSquadInURL,
  };
}

