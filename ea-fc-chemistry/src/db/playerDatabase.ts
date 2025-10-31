/**
 * IndexedDB Database Setup for EA FC 25 Player Data
 * 
 * Database: eafc25-squad-builder
 * Version: 1
 */

import { Player } from '../types/player';

const DB_NAME = 'eafc25-squad-builder';
const DB_VERSION = 1;

export interface CacheMetadata {
  lastUpdated: Date;
  playerCount: number;
  dataVersion: string;
  schemaVersion: string;
  source: 'futdb' | 'msmc' | 'sofifa' | 'bundled';
}

export interface PlayerDB {
  openDatabase(): Promise<IDBDatabase>;
  clearAllData(): Promise<void>;
  getMetadata(key: string): Promise<any>;
  setMetadata(key: string, value: any): Promise<void>;
}

class PlayerDatabase implements PlayerDB {
  private db: IDBDatabase | null = null;

  async openDatabase(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Players store
        if (!db.objectStoreNames.contains('players')) {
          const playerStore = db.createObjectStore('players', { keyPath: 'id' });
          playerStore.createIndex('by-rating', 'overall_rating', { unique: false });
          playerStore.createIndex('by-name', 'common_name', { unique: false });
          playerStore.createIndex('by-club', 'club.id', { unique: false });
          playerStore.createIndex('by-league', 'league.id', { unique: false });
          playerStore.createIndex('by-nationality', 'primary_nationality.id', { unique: false });
          playerStore.createIndex('by-position', 'primary_position', { unique: false });
          playerStore.createIndex('by-price-ps', 'price_ps', { unique: false });
          playerStore.createIndex('by-price-xbox', 'price_xbox', { unique: false });
          playerStore.createIndex('by-price-pc', 'price_pc', { unique: false });
        }

        // Clubs store
        if (!db.objectStoreNames.contains('clubs')) {
          db.createObjectStore('clubs', { keyPath: 'id' });
        }

        // Leagues store
        if (!db.objectStoreNames.contains('leagues')) {
          db.createObjectStore('leagues', { keyPath: 'id' });
        }

        // Nationalities store
        if (!db.objectStoreNames.contains('nationalities')) {
          db.createObjectStore('nationalities', { keyPath: 'id' });
        }

        // Metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  async clearAllData(): Promise<void> {
    const db = await this.openDatabase();
    const transaction = db.transaction(['players', 'clubs', 'leagues', 'nationalities', 'metadata'], 'readwrite');
    
    await Promise.all([
      clearStore(transaction.objectStore('players')),
      clearStore(transaction.objectStore('clubs')),
      clearStore(transaction.objectStore('leagues')),
      clearStore(transaction.objectStore('nationalities')),
      clearStore(transaction.objectStore('metadata')),
    ]);

    function clearStore(store: IDBObjectStore): Promise<void> {
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  async getMetadata(key: string): Promise<any> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['metadata'], 'readonly');
      const request = transaction.objectStore('metadata').get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }

  async setMetadata(key: string, value: any): Promise<void> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['metadata'], 'readwrite');
      const request = transaction.objectStore('metadata').put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async savePlayers(players: Player[]): Promise<void> {
    const db = await this.openDatabase();
    const transaction = db.transaction(['players'], 'readwrite');
    const store = transaction.objectStore('players');

    // Bulk insert with batch processing
    const batchSize = 100;
    for (let i = 0; i < players.length; i += batchSize) {
      const batch = players.slice(i, i + batchSize);
      await Promise.all(
        batch.map(
          (player) =>
            new Promise<void>((resolve, reject) => {
              const request = store.put(player);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            })
        )
      );
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['players'], 'readonly');
      const request = transaction.objectStore('players').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPlayersByRating(min: number, max: number): Promise<Player[]> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['players'], 'readonly');
      const index = transaction.objectStore('players').index('by-rating');
      const request = index.getAll(IDBKeyRange.bound(min, max));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getCacheInfo(): Promise<CacheMetadata | null> {
    const metadata = await this.getMetadata('cache_info');
    if (!metadata) return null;

    return {
      ...metadata,
      lastUpdated: new Date(metadata.lastUpdated),
    };
  }

  async updateCacheInfo(info: CacheMetadata): Promise<void> {
    await this.setMetadata('cache_info', {
      ...info,
      lastUpdated: info.lastUpdated.toISOString(),
    });
  }
}

// Singleton instance
export const playerDB = new PlayerDatabase();


