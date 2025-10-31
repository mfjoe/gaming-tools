/**
 * Squad Encoder Tests
 */

import { encodeSquad, decodeSquad, validateEncodedSquad, getPlayerIdsFromEncoded } from '../services/squadEncoder';
import { Squad, Player } from '../types/player';

// Mock players
const mockPlayer1: Player = {
  id: 'player-1',
  asset_id: 123456,
  first_name: 'Test',
  last_name: 'Player',
  common_name: 'Test Player',
  overall_rating: 85,
  card_type: 'rare',
  club: { id: 'club-1', name: 'Test Club', logo_url: '' },
  league: { id: 'league-1', name: 'Test League', logo_url: '' },
  primary_nationality: { id: 'nation-1', name: 'Test Nation', flag_url: '' },
  primary_position: 'ST',
  alternative_positions: ['CF'],
  pace: 90,
  shooting: 85,
  passing: 75,
  dribbling: 80,
  defending: 40,
  physical: 70,
} as Player;

const mockPlayer2: Player = {
  ...mockPlayer1,
  id: 'player-2',
  common_name: 'Player 2',
  overall_rating: 82,
};

describe('Squad Encoder', () => {
  describe('encodeSquad', () => {
    it('should encode a basic squad', () => {
      const squad: Squad = {
        formation: '4-4-2',
        players: [mockPlayer1, mockPlayer2, null, null, null, null, null, null, null, null, null],
        substitutes: [],
        manager: null,
        totalChemistry: 20,
      };

      const encoded = encodeSquad(squad);
      
      expect(typeof encoded).toBe('string');
      expect(encoded.length).toBeGreaterThan(0);
    });

    it('should encode squad with all players', () => {
      const squad: Squad = {
        formation: '4-3-3',
        players: Array(11).fill(mockPlayer1),
        substitutes: [],
        manager: null,
        totalChemistry: 33,
      };

      const encoded = encodeSquad(squad);
      const decoded = decodeSquad(encoded);
      
      expect(decoded).not.toBeNull();
      expect(decoded!.f).toBe('4-3-3');
      expect(decoded!.p.length).toBe(11);
    });

    it('should encode squad with manager', () => {
      const squad: Squad = {
        formation: '4-4-2',
        players: Array(11).fill(mockPlayer1),
        substitutes: [],
        manager: {
          nationality: { id: 'nation-1', name: 'Test', flag_url: '' },
          league: { id: 'league-1', name: 'Test', logo_url: '' },
        },
        totalChemistry: 25,
      };

      const encoded = encodeSquad(squad);
      const decoded = decodeSquad(encoded);
      
      expect(decoded).not.toBeNull();
      expect(decoded!.m).toBeDefined();
      expect(decoded!.m!.n).toBe('nation-1');
      expect(decoded!.m!.l).toBe('league-1');
    });

    it('should encode squad with substitutes', () => {
      const squad: Squad = {
        formation: '4-4-2',
        players: Array(11).fill(mockPlayer1),
        substitutes: [mockPlayer2, null, null, null, null, null, null],
        manager: null,
        totalChemistry: 25,
      };

      const encoded = encodeSquad(squad);
      const decoded = decodeSquad(encoded);
      
      expect(decoded).not.toBeNull();
      expect(decoded!.s).toBeDefined();
      expect(decoded!.s!.length).toBe(7);
      expect(decoded!.s![0]).toBe('player-2');
    });
  });

  describe('decodeSquad', () => {
    it('should decode valid encoded squad', () => {
      const squad: Squad = {
        formation: '4-3-3',
        players: [mockPlayer1, mockPlayer2, null, null, null, null, null, null, null, null, null],
        substitutes: [],
        manager: null,
        totalChemistry: 20,
        name: 'Test Squad',
      };

      const encoded = encodeSquad(squad);
      const decoded = decodeSquad(encoded);
      
      expect(decoded).not.toBeNull();
      expect(decoded!.v).toBe(1);
      expect(decoded!.f).toBe('4-3-3');
      expect(decoded!.p.length).toBe(11);
      expect(decoded!.p[0]).toBe('player-1');
      expect(decoded!.p[1]).toBe('player-2');
      expect(decoded!.n).toBe('Test Squad');
    });

    it('should return null for invalid encoded string', () => {
      const decoded = decodeSquad('invalid-string');
      expect(decoded).toBeNull();
    });

    it('should return null for corrupted data', () => {
      const decoded = decodeSquad('e30='); // Empty object in base64
      expect(decoded).toBeNull();
    });
  });

  describe('validateEncodedSquad', () => {
    it('should validate correct encoded squad', () => {
      const squad: Squad = {
        formation: '4-4-2',
        players: Array(11).fill(mockPlayer1),
        substitutes: [],
        manager: null,
        totalChemistry: 25,
      };

      const encoded = encodeSquad(squad);
      const validation = validateEncodedSquad(encoded);
      
      expect(validation.valid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it('should invalidate incorrect encoded squad', () => {
      const validation = validateEncodedSquad('invalid');
      
      expect(validation.valid).toBe(false);
      expect(validation.error).toBeDefined();
    });
  });

  describe('getPlayerIdsFromEncoded', () => {
    it('should extract player IDs', () => {
      const squad: Squad = {
        formation: '4-4-2',
        players: [mockPlayer1, mockPlayer2, ...Array(9).fill(mockPlayer1)],
        substitutes: [mockPlayer2],
        manager: null,
        totalChemistry: 25,
      };

      const encoded = encodeSquad(squad);
      const ids = getPlayerIdsFromEncoded(encoded);
      
      expect(ids.length).toBeGreaterThan(0);
      expect(ids).toContain('player-1');
      expect(ids).toContain('player-2');
    });

    it('should return empty array for invalid encoded', () => {
      const ids = getPlayerIdsFromEncoded('invalid');
      expect(ids).toEqual([]);
    });
  });

  describe('URL length', () => {
    it('should keep encoded squad under 2000 characters', () => {
      const squad: Squad = {
        formation: '4-3-3',
        players: Array(11).fill(mockPlayer1),
        substitutes: Array(7).fill(mockPlayer2),
        manager: {
          nationality: { id: 'nation-1', name: 'Test', flag_url: '' },
          league: { id: 'league-1', name: 'Test', logo_url: '' },
        },
        totalChemistry: 33,
        name: 'My Amazing EA FC 25 Squad with Long Name',
      };

      const encoded = encodeSquad(squad);
      
      expect(encoded.length).toBeLessThan(2000);
    });
  });
});

// Run tests helper
export async function runEncoderTests(): Promise<{
  passed: number;
  failed: number;
  total: number;
}> {
  const results = { passed: 0, failed: 0, total: 0 };

  // Test 1: Basic encoding/decoding
  try {
    const squad: Squad = {
      formation: '4-4-2',
      players: [mockPlayer1, ...Array(10).fill(null)],
      substitutes: [],
      manager: null,
      totalChemistry: 0,
    };

    const encoded = encodeSquad(squad);
    const decoded = decodeSquad(encoded);

    if (decoded && decoded.f === '4-4-2' && decoded.p.length === 11) {
      results.passed++;
    } else {
      results.failed++;
    }
    results.total++;
  } catch {
    results.failed++;
    results.total++;
  }

  // Test 2: Validation
  try {
    const validation = validateEncodedSquad('invalid');
    if (!validation.valid) {
      results.passed++;
    } else {
      results.failed++;
    }
    results.total++;
  } catch {
    results.failed++;
    results.total++;
  }

  return results;
}

