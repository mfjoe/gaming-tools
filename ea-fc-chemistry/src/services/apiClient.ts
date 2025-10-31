/**
 * API Client for EA FC 25 Player Data
 * Supports multiple API providers
 */

import { Player } from '../types/player';

export type ApiProvider = 'futdb' | 'msmc' | 'sofifa' | 'bundled';

export interface ApiConfig {
  provider: ApiProvider;
  apiKey?: string;
  endpoint: string;
  rateLimit?: number;
}

export interface FutDBConfig extends ApiConfig {
  provider: 'futdb';
  apiKey: string;
  endpoint: 'https://futdb.app/api/players';
  rateLimit: 60;
}

export interface MSMCConfig extends ApiConfig {
  provider: 'msmc';
  endpoint: 'https://api.msmc.cc/fc25/players';
  rateLimit: null;
}

export interface SoFIFAConfig extends ApiConfig {
  provider: 'sofifa';
  partnerId: string;
  endpoint: 'https://sofifa.com/api/players';
  rateLimit: 60;
}

class ApiClient {
  private config: ApiConfig;
  private requestQueue: Array<() => Promise<any>> = [];
  private requestCount = 0;
  private resetTime = Date.now() + 60000; // Reset after 1 minute

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async rateLimitedRequest<T>(fn: () => Promise<T>): Promise<T> {
    if (this.config.rateLimit) {
      const now = Date.now();
      if (now > this.resetTime) {
        this.requestCount = 0;
        this.resetTime = now + 60000;
      }

      if (this.requestCount >= this.config.rateLimit) {
        const waitTime = this.resetTime - now;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        this.requestCount = 0;
        this.resetTime = Date.now() + 60000;
      }

      this.requestCount++;
    }

    return fn();
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    retries = 3
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeout);

      if (retries > 0 && (error.name === 'AbortError' || error.message.includes('fetch'))) {
        // Exponential backoff
        const delay = Math.pow(2, 3 - retries) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchWithRetry<T>(url, options, retries - 1);
      }

      throw error;
    }
  }

  async fetchAllPlayers(): Promise<Player[]> {
    return this.rateLimitedRequest(async () => {
      switch (this.config.provider) {
        case 'futdb':
          return this.fetchFutDBPlayers();
        case 'msmc':
          return this.fetchMSMCPlayers();
        case 'sofifa':
          return this.fetchSoFIFAPlayers();
        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`);
      }
    });
  }

  private async fetchFutDBPlayers(): Promise<Player[]> {
    const players: Player[] = [];
    let page = 1;
    const limit = 100;

    while (true) {
      const url = `${this.config.endpoint}?page=${page}&limit=${limit}`;
      const headers: HeadersInit = {
        'X-AUTH-TOKEN': (this.config as FutDBConfig).apiKey,
      };

      const response = await this.fetchWithRetry<{ items: any[]; page: { totalPages: number } }>(
        url,
        { headers }
      );

      players.push(...response.items.map(this.transformFutDBPlayer));

      if (page >= response.page.totalPages) break;
      page++;
    }

    return players;
  }

  private async fetchMSMCPlayers(): Promise<Player[]> {
    const response = await this.fetchWithRetry<{ players: any[] }>(this.config.endpoint);
    return response.players.map(this.transformMSMCPlayer);
  }

  private async fetchSoFIFAPlayers(): Promise<Player[]> {
    // SoFIFA API implementation
    const response = await this.fetchWithRetry<{ data: any[] }>(this.config.endpoint);
    return response.data.map(this.transformSoFIFAPlayer);
  }

  async fetchPlayersByPage(page: number, limit: number): Promise<Player[]> {
    return this.rateLimitedRequest(async () => {
      const url = `${this.config.endpoint}?page=${page}&limit=${limit}`;
      const headers: HeadersInit = {};
      
      if (this.config.provider === 'futdb') {
        headers['X-AUTH-TOKEN'] = (this.config as FutDBConfig).apiKey;
      }

      const response = await this.fetchWithRetry<any>(url, { headers });
      
      switch (this.config.provider) {
        case 'futdb':
          return response.items.map(this.transformFutDBPlayer);
        case 'msmc':
          return response.players.map(this.transformMSMCPlayer);
        case 'sofifa':
          return response.data.map(this.transformSoFIFAPlayer);
        default:
          return [];
      }
    });
  }

  async fetchPlayerById(id: string): Promise<Player | null> {
    const url = `${this.config.endpoint}/${id}`;
    const headers: HeadersInit = {};
    
    if (this.config.provider === 'futdb') {
      headers['X-AUTH-TOKEN'] = (this.config as FutDBConfig).apiKey;
    }

    try {
      const response = await this.fetchWithRetry<any>(url, { headers });
      switch (this.config.provider) {
        case 'futdb':
          return this.transformFutDBPlayer(response);
        case 'msmc':
          return this.transformMSMCPlayer(response);
        case 'sofifa':
          return this.transformSoFIFAPlayer(response);
        default:
          return null;
      }
    } catch {
      return null;
    }
  }

  // Transform functions (simplified - adjust based on actual API responses)
  private transformFutDBPlayer(data: any): Player {
    return {
      id: data.id,
      asset_id: data.assetId,
      first_name: data.firstName,
      last_name: data.lastName,
      common_name: data.commonName,
      overall_rating: data.rating,
      card_type: data.cardType,
      version: data.version,
      club: { id: data.club.id, name: data.club.name, logo_url: data.club.logo },
      league: { id: data.league.id, name: data.league.name, logo_url: data.league.logo },
      primary_nationality: {
        id: data.nationality.id,
        name: data.nationality.name,
        flag_url: data.nationality.flag,
      },
      primary_position: data.position,
      alternative_positions: data.positions || [],
      pace: data.pace,
      shooting: data.shooting,
      passing: data.passing,
      dribbling: data.dribbling,
      defending: data.defending,
      physical: data.physical,
      price_ps: data.price?.ps || null,
      price_xbox: data.price?.xbox || null,
      price_pc: data.price?.pc || null,
      work_rate_attack: data.workRate?.attack || 'Medium',
      work_rate_defense: data.workRate?.defense || 'Medium',
      weak_foot: data.weakFoot || null,
      skill_moves: data.skillMoves || null,
      preferred_foot: data.preferredFoot || 'Right',
      body_type: data.bodyType || null,
      accelerate_type: data.accelerateType || 'Controlled',
      face_image_url: data.faceImage,
    };
  }

  private transformMSMCPlayer(data: any): Player {
    // MSMC API transformation
    return this.transformFutDBPlayer(data); // Similar structure
  }

  private transformSoFIFAPlayer(data: any): Player {
    // SoFIFA API transformation
    return this.transformFutDBPlayer(data); // Similar structure
  }

  async checkForUpdates(localVersion: string): Promise<boolean> {
    try {
      const url = `${this.config.endpoint}/version`;
      const headers: HeadersInit = {};
      
      if (this.config.provider === 'futdb') {
        headers['X-AUTH-TOKEN'] = (this.config as FutDBConfig).apiKey;
      }

      const response = await this.fetchWithRetry<{ version: string }>(url, { headers });
      return response.version !== localVersion;
    } catch {
      return false;
    }
  }
}

// Factory function
export function createApiClient(config: ApiConfig): ApiClient {
  return new ApiClient(config);
}

// Default configuration from environment
export function getDefaultApiConfig(): ApiConfig {
  const provider = (import.meta.env.VITE_API_PROVIDER || 'msmc') as ApiProvider;
  const apiKey = import.meta.env.VITE_FUTDB_API_KEY;

  switch (provider) {
    case 'futdb':
      return {
        provider: 'futdb',
        apiKey: apiKey || '',
        endpoint: 'https://futdb.app/api/players',
        rateLimit: 60,
      };
    case 'msmc':
      return {
        provider: 'msmc',
        endpoint: 'https://api.msmc.cc/fc25/players',
        rateLimit: null,
      };
    case 'sofifa':
      return {
        provider: 'sofifa',
        endpoint: 'https://sofifa.com/api/players',
        rateLimit: 60,
      };
    default:
      return {
        provider: 'msmc',
        endpoint: 'https://api.msmc.cc/fc25/players',
        rateLimit: null,
      };
  }
}

export const apiClient = createApiClient(getDefaultApiConfig());


