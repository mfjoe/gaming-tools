/**
 * Data Loading Service
 * Handles loading player data from multiple sources with caching
 */

import { Player } from '../types/player';
import { playerDB, CacheMetadata } from '../db/playerDatabase';
import { apiClient, getDefaultApiConfig } from './apiClient';

const CACHE_DURATION_DAYS = Number(import.meta.env.VITE_CACHE_DURATION_DAYS) || 7;
const SCHEMA_VERSION = '1.0.0';

export interface LoadingProgress {
  stage: 'checking' | 'caching' | 'fetching' | 'saving' | 'ready';
  message: string;
  progress: number; // 0-100
  current?: number;
  total?: number;
}

type ProgressCallback = (progress: LoadingProgress) => void;

class DataLoader {
  private onProgress: ProgressCallback | null = null;

  setProgressCallback(callback: ProgressCallback) {
    this.onProgress = callback;
  }

  private reportProgress(stage: LoadingProgress['stage'], message: string, progress: number, current?: number, total?: number) {
    if (this.onProgress) {
      this.onProgress({ stage, message, progress, current, total });
    }
  }

  async loadPlayers(): Promise<Player[]> {
    try {
      // Stage 1: Check local cache
      this.reportProgress('checking', 'Checking local database...', 10);
      const cacheInfo = await playerDB.getCacheInfo();

      if (cacheInfo && this.isCacheFresh(cacheInfo.lastUpdated)) {
        this.reportProgress('caching', 'Loading players from cache...', 30);
        const cachedPlayers = await playerDB.getAllPlayers();
        this.reportProgress('ready', 'Ready!', 100);
        return cachedPlayers;
      }

      // Stage 2: Try to fetch from API
      if (navigator.onLine) {
        try {
          return await this.fetchFromAPI();
        } catch (apiError) {
          console.warn('API fetch failed:', apiError);
          // Continue to Stage 3: Fallback
        }
      }

      // Stage 3: Fallback to bundled JSON
      if (cacheInfo && cacheInfo.playerCount > 0) {
        this.reportProgress('caching', 'Using cached data (may be outdated)', 50);
        const cachedPlayers = await playerDB.getAllPlayers();
        return cachedPlayers;
      }

      return await this.loadFromBundledJSON();
    } catch (error) {
      console.error('Data loading error:', error);
      throw error;
    }
  }

  async loadPlayersIncremental(): Promise<Player[]> {
    // Stage 1: Load essential players immediately
    this.reportProgress('fetching', 'Loading essential players...', 20);
    const essential = await this.loadEssentialPlayers();

    // Stage 2-3: Load remaining in background
    setTimeout(async () => {
      await this.loadRemainingPlayers(essential.length);
    }, 0);

    return essential;
  }

  private async loadEssentialPlayers(): Promise<Player[]> {
    // Top 1000 players (85+ rated) + Icons + Heroes + Special cards
    const cacheInfo = await playerDB.getCacheInfo();
    
    if (cacheInfo && this.isCacheFresh(cacheInfo.lastUpdated)) {
      const allPlayers = await playerDB.getAllPlayers();
      return allPlayers.filter(
        (p) =>
          p.overall_rating >= 85 ||
          p.card_type === 'icon' ||
          p.card_type === 'hero' ||
          p.card_type === 'totw' ||
          p.card_type === 'toty' ||
          p.card_type === 'promo'
      );
    }

    // Fetch from API
    try {
      const response = await fetch('/api/players/essential.json');
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback to full cache
    }

    const allPlayers = await playerDB.getAllPlayers();
    return allPlayers.slice(0, 1000);
  }

  private async loadRemainingPlayers(currentCount: number) {
    this.reportProgress('fetching', 'Loading full database in background...', 50);
    const allPlayers = await this.fetchFromAPI();
    this.reportProgress('ready', 'Full database loaded!', 100);
    return allPlayers;
  }

  private async fetchFromAPI(): Promise<Player[]> {
    this.reportProgress('fetching', 'Fetching latest player data...', 40);
    
    const config = getDefaultApiConfig();
    const players: Player[] = [];
    let page = 1;
    const limit = 100;
    let totalPages = 1;

    // Fetch first page to get total count
    const firstPage = await apiClient.fetchPlayersByPage(page, limit);
    players.push(...firstPage);
    
    // Estimate total pages (if API provides it)
    // For now, continue fetching until empty response
    page++;

    while (true) {
      try {
        this.reportProgress(
          'fetching',
          `Downloading: ${players.length} players...`,
          Math.min(40 + (players.length / 20000) * 40, 80),
          players.length,
          20000
        );

        const pageData = await apiClient.fetchPlayersByPage(page, limit);
        
        if (pageData.length === 0) break;
        
        players.push(...pageData);
        page++;

        // Safety limit
        if (players.length > 25000) break;
      } catch (error) {
        console.error('Error fetching page:', error);
        break;
      }
    }

    // Save to cache
    this.reportProgress('saving', 'Saving to local database...', 85);
    await playerDB.savePlayers(players);
    await playerDB.updateCacheInfo({
      lastUpdated: new Date(),
      playerCount: players.length,
      dataVersion: new Date().toISOString().split('T')[0],
      schemaVersion: SCHEMA_VERSION,
      source: config.provider,
    });

    this.reportProgress('ready', 'Ready!', 100);
    return players;
  }

  private async loadFromBundledJSON(): Promise<Player[]> {
    this.reportProgress('fetching', 'Loading from bundled data...', 60);
    
    try {
      const response = await fetch('/data/players.json');
      if (!response.ok) {
        throw new Error('Bundled data not found');
      }

      const players: Player[] = await response.json();
      
      // Save bundled data to cache
      await playerDB.savePlayers(players);
      await playerDB.updateCacheInfo({
        lastUpdated: new Date(),
        playerCount: players.length,
        dataVersion: new Date().toISOString().split('T')[0],
        schemaVersion: SCHEMA_VERSION,
        source: 'bundled',
      });

      this.reportProgress('ready', 'Ready! (Using cached data, prices may be outdated)', 100);
      return players;
    } catch (error) {
      console.error('Failed to load bundled data:', error);
      throw new Error('No data available. Please check your connection and try again.');
    }
  }

  private isCacheFresh(lastUpdated: Date): boolean {
    const daysSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate < CACHE_DURATION_DAYS;
  }

  async checkForUpdates(): Promise<boolean> {
    const cacheInfo = await playerDB.getCacheInfo();
    if (!cacheInfo) return true;

    try {
      return await apiClient.checkForUpdates(cacheInfo.dataVersion);
    } catch {
      return false;
    }
  }

  async getCacheInfo(): Promise<CacheMetadata | null> {
    return await playerDB.getCacheInfo();
  }

  async clearCache(): Promise<void> {
    await playerDB.clearAllData();
  }
}

export const dataLoader = new DataLoader();

