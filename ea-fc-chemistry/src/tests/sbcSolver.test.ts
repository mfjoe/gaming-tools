/**
 * SBC Solver Test Suite
 */

import { SBCRequirement, SolverOptions, ClubPlayer } from '../types/sbc';
import { Player } from '../types/player';
import { solveSBC, validateNoBenchWaste } from '../services/sbcSolver';
import { generateMockPlayers } from '../utils/mockDataGenerator';

// Test SBC Requirements
export const TEST_SBCS: Array<{
  name: string;
  requirement: SBCRequirement;
  expectedCost: number;
  expectedPlayers: number;
}> = [
  {
    name: 'Basic 83 Rated',
    requirement: {
      id: 'test-83',
      name: '83 Rated Squad',
      description: 'Basic 83 rated squad',
      minRating: 83,
      maxRating: null,
      minChemistry: 24,
      exactPlayers: 11,
      requiredPositions: [],
      minRarePlayers: null,
      minSpecialCards: null,
      maxSameClub: null,
      minDifferentClubs: null,
      minDifferentLeagues: null,
      minDifferentNations: null,
      requiredClubs: null,
      requiredLeagues: null,
      requiredNations: null,
      minPlayersFromClub: null,
      minPlayersFromLeague: null,
      minPlayersFromNation: null,
      minRatingPlayers: null,
      reward: {
        type: 'pack',
        value: 'Gold Pack',
        tradeable: true,
      },
      repeatable: false,
      expiresAt: null,
      estimatedCost: 15000,
    },
    expectedCost: 15000,
    expectedPlayers: 11,
  },
  {
    name: 'Premier League 85 Rated',
    requirement: {
      id: 'test-prem-85',
      name: 'Premier League 85+',
      description: 'All Premier League players, 85+ rated',
      minRating: 85,
      maxRating: null,
      minChemistry: 33,
      exactPlayers: 11,
      requiredPositions: [],
      minRarePlayers: null,
      minSpecialCards: null,
      maxSameClub: null,
      minDifferentClubs: null,
      minDifferentLeagues: null,
      minDifferentNations: null,
      requiredClubs: null,
      requiredLeagues: ['prem'],
      requiredNations: null,
      minPlayersFromClub: null,
      minPlayersFromLeague: [{ league: 'prem', count: 11 }],
      minPlayersFromNation: null,
      minRatingPlayers: null,
      reward: {
        type: 'pack',
        value: 'Premium Gold Players Pack',
        tradeable: true,
      },
      repeatable: false,
      expiresAt: null,
      estimatedCost: 65000,
    },
    expectedCost: 65000,
    expectedPlayers: 11,
  },
];

export interface TestResults {
  passed: number;
  failed: number;
  tests: Array<{
    name: string;
    passed: boolean;
    error?: string;
    actualCost?: number;
    actualPlayers?: number;
  }>;
}

/**
 * Run SBC Solver tests
 */
export async function testSolver(): Promise<TestResults> {
  const results: TestResults = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  // Generate test players (5000 players with various ratings, leagues, etc.)
  const testPlayers = generateMockPlayers(5000);

  for (const test of TEST_SBCS) {
    try {
      const options: SolverOptions = {
        userClub: [], // Empty club for testing
        preferUntradeable: false,
        maxBudget: null,
        platform: 'ps',
        allowPartialSolution: false,
      };

      const result = await solveSBC(test.requirement, {
        ...options,
        userClub: testPlayers,
      });

      // Validate
      const benchCheck = validateNoBenchWaste(result.squad);
      const playerCountMatch = result.squad.length === test.expectedPlayers;
      const costWithinRange = result.totalCost <= test.expectedCost * 1.5; // Allow 50% variance

      if (benchCheck.valid && playerCountMatch && costWithinRange && result.success) {
        results.passed++;
        results.tests.push({
          name: test.name,
          passed: true,
          actualCost: result.totalCost,
          actualPlayers: result.squad.length,
        });
      } else {
        results.failed++;
        results.tests.push({
          name: test.name,
          passed: false,
          error: `Bench: ${benchCheck.error || 'OK'}, Players: ${result.squad.length}/${test.expectedPlayers}, Cost: ${result.totalCost}/${test.expectedCost}`,
          actualCost: result.totalCost,
          actualPlayers: result.squad.length,
        });
      }
    } catch (error: any) {
      results.failed++;
      results.tests.push({
        name: test.name,
        passed: false,
        error: error.message || String(error),
      });
    }
  }

  return results;
}

/**
 * Test bench waste validation
 */
export function testBenchValidation(): boolean {
  const validSquad = generateMockPlayers(11);
  const invalidSquad = generateMockPlayers(18);

  const validCheck = validateNoBenchWaste(validSquad);
  const invalidCheck = validateNoBenchWaste(invalidSquad);

  return validCheck.valid && !invalidCheck.valid;
}

/**
 * Test with untradeable cards
 */
export async function testUntradeableUsage(): Promise<boolean> {
  const testPlayers = generateMockPlayers(1000);
  const clubPlayers: ClubPlayer[] = testPlayers.slice(0, 50).map((p) => ({
    ...p,
    isUntradeable: true,
    isDuplicate: false,
    sbcValue: p.overall_rating / ((p.price_ps || 1000) / 100),
    recommendedUse: 'sbc' as const,
    quantity: 1,
  }));

  const requirement: SBCRequirement = TEST_SBCS[0].requirement;
  const options: SolverOptions = {
    userClub: clubPlayers,
    preferUntradeable: true,
    maxBudget: null,
    platform: 'ps',
    allowPartialSolution: false,
  };

  const result = await solveSBC(requirement, options);

  return result.untradeableUsed > 0;
}


