/**
 * Price Update Service
 * Handles incremental price updates without full database refresh
 */

import { Player } from '../types/player';
import { playerDB } from '../db/playerDatabase';

type Platform = 'ps' | 'xbox' | 'pc';

interface PriceUpdateConfig {
  enabled: boolean;
  highRatedInterval: number; // 85+ rated players (30-60 minutes)
  midRatedInterval: number; // 75-84 rated (2-4 hours)
  lowRatedInterval: number; // <75 rated (24 hours)
}

class PriceUpdater {
  private updateInterval: number | null = null;
  private config: PriceUpdateConfig;
  private isUpdating = false;

  constructor() {
    this.config = {
      enabled: import.meta.env.VITE_ENABLE_PRICE_UPDATES === 'true',
      highRatedInterval: 45 * 60 * 1000, // 45 minutes
      midRatedInterval: 3 * 60 * 60 * 1000, // 3 hours
      lowRatedInterval: 24 * 60 * 60 * 1000, // 24 hours
    };
  }

  async updatePrices(platform: Platform): Promise<void> {
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    const db = await playerDB.openDatabase();

    try {
      // Fetch latest prices from API
      const prices = await this.fetchLatestPrices(platform);

      // Update prices in batches
      const transaction = db.transaction(['players'], 'readwrite');
      const store = transaction.objectStore('players');
      const batchSize = 100;

      for (let i = 0; i < prices.length; i += batchSize) {
        const batch = prices.slice(i, i + batchSize);
        await Promise.all(
          batch.map(
            (priceData) =>
              new Promise<void>((resolve, reject) => {
                const getRequest = store.get(priceData.playerId);
                getRequest.onsuccess = () => {
                  const player = getRequest.result;
                  if (player) {
                    player[`price_${platform}`] = priceData.price;
                    player.price_updated_at = new Date();
                    const putRequest = store.put(player);
                    putRequest.onsuccess = () => resolve();
                    putRequest.onerror = () => reject(putRequest.error);
                  } else {
                    resolve();
                  }
                };
                getRequest.onerror = () => reject(getRequest.error);
              })
          )
        );
      }

      // Update last price update timestamp
      await playerDB.setMetadata(`last_price_update_${platform}`, new Date().toISOString());
    } catch (error) {
      console.error('Price update failed:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  private async fetchLatestPrices(platform: Platform): Promise<Array<{ playerId: string; price: number }>> {
    // API endpoint for prices (platform-specific)
    const endpoint = `https://api.msmc.cc/fc25/prices/${platform}`;
    
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Price API failed');
      
      const data = await response.json();
      return data.prices || [];
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      return [];
    }
  }

  async updatePricesByPriority(platform: Platform): Promise<void> {
    if (!this.config.enabled) return;

    // Get all players grouped by rating
    const highRated = await playerDB.getPlayersByRating(85, 99);
    const midRated = await playerDB.getPlayersByRating(75, 84);
    const lowRated = await playerDB.getPlayersByRating(0, 74);

    // Check last update times
    const lastHighUpdate = await this.getLastPriceUpdate(platform, 'high');
    const lastMidUpdate = await this.getLastPriceUpdate(platform, 'mid');
    const lastLowUpdate = await this.getLastPriceUpdate(platform, 'low');

    const now = Date.now();

    // Update high-rated players if needed
    if (now - lastHighUpdate.getTime() >= this.config.highRatedInterval) {
      await this.updatePlayerPrices(highRated, platform);
      await playerDB.setMetadata(`last_price_update_${platform}_high`, new Date().toISOString());
    }

    // Update mid-rated players if needed
    if (now - lastMidUpdate.getTime() >= this.config.midRatedInterval) {
      await this.updatePlayerPrices(midRated, platform);
      await playerDB.setMetadata(`last_price_update_${platform}_mid`, new Date().toISOString());
    }

    // Update low-rated players if needed
    if (now - lastLowUpdate.getTime() >= this.config.lowRatedInterval) {
      await this.updatePlayerPrices(lowRated, platform);
      await playerDB.setMetadata(`last_price_update_${platform}_low`, new Date().toISOString());
    }
  }

  private async updatePlayerPrices(players: Player[], platform: Platform): Promise<void> {
    const prices = await this.fetchLatestPrices(platform);
    const priceMap = new Map(prices.map((p) => [p.playerId, p.price]));

    const db = await playerDB.openDatabase();
    const transaction = db.transaction(['players'], 'readwrite');
    const store = transaction.objectStore('players');

    await Promise.all(
      players
        .filter((p) => priceMap.has(p.id))
        .map(
          (player) =>
            new Promise<void>((resolve, reject) => {
              player[`price_${platform}` as keyof Player] = priceMap.get(player.id) as any;
              player.price_updated_at = new Date();
              const request = store.put(player);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            })
        )
    );
  }

  async getLastPriceUpdate(platform: Platform, tier?: 'high' | 'mid' | 'low'): Promise<Date> {
    const key = tier
      ? `last_price_update_${platform}_${tier}`
      : `last_price_update_${platform}`;
    const timestamp = await playerDB.getMetadata(key);
    return timestamp ? new Date(timestamp) : new Date(0);
  }

  async schedulePriceUpdates(platform: Platform): Promise<void> {
    if (!this.config.enabled || this.updateInterval) return;

    // Update immediately
    await this.updatePricesByPriority(platform);

    // Schedule periodic updates
    this.updateInterval = window.setInterval(() => {
      this.updatePricesByPriority(platform).catch(console.error);
    }, this.config.highRatedInterval);
  }

  stopScheduling(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export const priceUpdater = new PriceUpdater();


