/**
 * React Hook for Player Data Loading
 */

import { useState, useEffect, useCallback } from 'react';
import { Player } from '../types/player';
import { dataLoader, LoadingProgress } from '../services/dataLoader';
import { priceUpdater } from '../services/priceUpdater';
import { CacheMetadata, playerDB } from '../db/playerDatabase';

interface UsePlayerDataReturn {
  players: Player[];
  clubs: any[];
  leagues: any[];
  nationalities: any[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  progress: number;
  loadingMessage: string;
  isUsingCache: boolean;
  cacheAge: number; // days since last update
  refetch: () => Promise<void>;
  cacheInfo: CacheMetadata | null;
}

export function usePlayerData(options: { incremental?: boolean } = {}): UsePlayerDataReturn {
  const [players, setPlayers] = useState<Player[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [leagues, setLeagues] = useState<any[]>([]);
  const [nationalities, setNationalities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const [isUsingCache, setIsUsingCache] = useState(false);
  const [cacheAge, setCacheAge] = useState(0);
  const [cacheInfo, setCacheInfo] = useState<CacheMetadata | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setProgress(0);
    setLoadingMessage('Loading...');

    // Set up progress callback
    dataLoader.setProgressCallback((progress: LoadingProgress) => {
      setProgress(progress.progress);
      setLoadingMessage(progress.message);
    });

    try {
      // Check cache info
      const info = await dataLoader.getCacheInfo();
      setCacheInfo(info);

      if (info) {
        const age = (Date.now() - new Date(info.lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
        setCacheAge(age);
        setIsUsingCache(age < 7);

        // Load from cache first if available
        if (age < 7) {
          const cachedPlayers = await playerDB.getAllPlayers();
          setPlayers(cachedPlayers);
          setIsLoading(false);
          
          // Start price updates in background
          priceUpdater.schedulePriceUpdates('ps').catch(console.error);
        }
      }

      // Fetch fresh data
      const loadedPlayers = options.incremental
        ? await dataLoader.loadPlayersIncremental()
        : await dataLoader.loadPlayers();

      setPlayers(loadedPlayers);
      setIsLoading(false);

      // Extract related data
      const uniqueClubs = new Map();
      const uniqueLeagues = new Map();
      const uniqueNationalities = new Map();

      loadedPlayers.forEach((player) => {
        if (!uniqueClubs.has(player.club.id)) {
          uniqueClubs.set(player.club.id, player.club);
        }
        if (!uniqueLeagues.has(player.league.id)) {
          uniqueLeagues.set(player.league.id, player.league);
        }
        if (!uniqueNationalities.has(player.primary_nationality.id)) {
          uniqueNationalities.set(player.primary_nationality.id, player.primary_nationality);
        }
      });

      setClubs(Array.from(uniqueClubs.values()));
      setLeagues(Array.from(uniqueLeagues.values()));
      setNationalities(Array.from(uniqueNationalities.values()));

      // Update cache info
      const newInfo = await dataLoader.getCacheInfo();
      setCacheInfo(newInfo);

      // Schedule price updates
      priceUpdater.schedulePriceUpdates('ps').catch(console.error);
    } catch (err: any) {
      setIsError(true);
      setError(err);
      setIsLoading(false);
      setLoadingMessage('Failed to load data');
    }
  }, [options.incremental]);

  useEffect(() => {
    loadData();

    // Cleanup
    return () => {
      priceUpdater.stopScheduling();
    };
  }, [loadData]);

  const refetch = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return {
    players,
    clubs,
    leagues,
    nationalities,
    isLoading,
    isError,
    error,
    progress,
    loadingMessage,
    isUsingCache,
    cacheAge,
    refetch,
    cacheInfo,
  };
}

