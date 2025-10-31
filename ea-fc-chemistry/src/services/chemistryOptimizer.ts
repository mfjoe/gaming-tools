/**
 * Chemistry Optimizer
 * Calculates and optimizes squad chemistry
 */

import { Player } from '../types/player';

// Import formations - adjust path as needed based on your project structure
// Option 1: If formations.ts is at project root
let getFormationFunc: ((id: string) => any) | null = null;

// Try to import formations from multiple possible locations
try {
  // TypeScript/ES Module
  const formations = require('../../../formations');
  getFormationFunc = formations.getFormation;
} catch {
  try {
    // Alternative path
    const formations = require('../../../../formations');
    getFormationFunc = formations.getFormation;
  } catch {
    // Fallback - will use default
  }
}

function getFormation(id: string): any {
  if (getFormationFunc) {
    return getFormationFunc(id);
  }
  
  // Fallback: Return default 4-4-2 formation structure
  const defaultFormations: Record<string, any> = {
    '4-4-2': {
      positions: [
        { slot: 0, position: 'GK', x: 50, y: 90 },
        { slot: 1, position: 'LB', x: 15, y: 72 },
        { slot: 2, position: 'CB', x: 35, y: 75 },
        { slot: 3, position: 'CB', x: 65, y: 75 },
        { slot: 4, position: 'RB', x: 85, y: 72 },
        { slot: 5, position: 'LM', x: 20, y: 48 },
        { slot: 6, position: 'CM', x: 40, y: 50 },
        { slot: 7, position: 'CM', x: 60, y: 50 },
        { slot: 8, position: 'RM', x: 80, y: 48 },
        { slot: 9, position: 'ST', x: 38, y: 15 },
        { slot: 10, position: 'ST', x: 62, y: 15 },
      ],
    },
  };
  
  return defaultFormations[id] || defaultFormations['4-4-2'];
}

export interface ChemistryCalculation {
  playerChemistry: number; // 0-3
  links: {
    club: boolean;
    league: boolean;
    nationality: boolean;
    position: boolean;
  };
  totalLinks: number;
}

export interface SquadChemistry {
  formation: string;
  playerPositions: {
    player: Player;
    position: string;
    chemistry: number;
  }[];
  totalChemistry: number;
}

/**
 * Calculate chemistry for a player based on links
 */
export function calculatePlayerChemistry(
  player: Player,
  position: string,
  adjacentPlayers: Player[],
  formationPositions: { slot: number; position: string }[]
): ChemistryCalculation {
  const isCorrectPosition = player.primary_position === position ||
    player.alternative_positions.includes(position);

  let links = 0;
  const linkTypes = {
    club: false,
    league: false,
    nationality: false,
    position: false,
  };

  for (const adjacent of adjacentPlayers) {
    // Club link
    if (player.club.id === adjacent.club.id) {
      links++;
      linkTypes.club = true;
    }
    // League link
    else if (player.league.id === adjacent.league.id) {
      links++;
      linkTypes.league = true;
    }
    // Nation link
    else if (player.primary_nationality.id === adjacent.primary_nationality.id) {
      links++;
      linkTypes.nationality = true;
    }
  }

  // Position chemistry
  if (isCorrectPosition) {
    linkTypes.position = true;
  }

  // Chemistry formula: base + links
  let chemistry = isCorrectPosition ? 1 : 0;
  chemistry += links;

  // Icons/Heroes always get at least 1 chemistry
  if ((player.card_type === 'icon' || player.card_type === 'hero') && chemistry === 0) {
    chemistry = 1;
  }

  // Cap at 3
  chemistry = Math.min(chemistry, 3);

  return {
    playerChemistry: chemistry,
    links: linkTypes,
    totalLinks: links,
  };
}

/**
 * Calculate total squad chemistry
 */
export function calculateSquadChemistry(
  players: Player[],
  formationId: string = '4-4-2'
): SquadChemistry {
  if (players.length !== 11) {
    throw new Error('Squad must have exactly 11 players');
  }

  const formation = getFormation(formationId);
  if (!formation) {
    throw new Error(`Unknown formation: ${formationId}`);
  }

  const playerPositions = players.map((player, index) => {
    const slot = formation.positions[index];
    if (!slot) {
      return {
        player,
        position: player.primary_position,
        chemistry: 0,
      };
    }

    // Find adjacent players in formation
    const adjacentIndices = findAdjacentPositions(index, formation.positions);
    const adjacentPlayers = adjacentIndices.map((idx) => players[idx]).filter(Boolean);

    const chem = calculatePlayerChemistry(player, slot.position, adjacentPlayers, formation.positions);

    return {
      player,
      position: slot.position,
      chemistry: chem.playerChemistry,
    };
  });

  const totalChemistry = playerPositions.reduce((sum, p) => sum + p.chemistry, 0);

  return {
    formation: formationId,
    playerPositions,
    totalChemistry,
  };
}

/**
 * Find adjacent positions in formation for chemistry links
 */
function findAdjacentPositions(
  index: number,
  positions: { slot: number; position: string; x: number; y: number }[]
): number[] {
  const current = positions[index];
  if (!current) return [];

  const adjacent: number[] = [];

  // Find players within reasonable distance (2 units)
  for (let i = 0; i < positions.length; i++) {
    if (i === index) continue;
    const other = positions[i];
    const distance = Math.sqrt(
      Math.pow(current.x - other.x, 2) + Math.pow(current.y - other.y, 2)
    );
    if (distance < 25) {
      // Adjacent in formation
      adjacent.push(i);
    }
  }

  return adjacent;
}

/**
 * Optimize player arrangement for maximum chemistry
 */
export function optimizeChemistry(
  players: Player[],
  minChemistry: number
): SquadChemistry | null {
  if (players.length !== 11) {
    return null;
  }

  // Try different formations
  const formations = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2'];

  let bestChemistry: SquadChemistry | null = null;
  let bestScore = -1;

  for (const formationId of formations) {
    try {
      const chemistry = calculateSquadChemistry(players, formationId);
      if (chemistry.totalChemistry >= minChemistry) {
        if (chemistry.totalChemistry > bestScore) {
          bestScore = chemistry.totalChemistry;
          bestChemistry = chemistry;
        }
      }
    } catch {
      // Formation not found, continue
    }
  }

  // If no formation met requirement, return best effort
  if (!bestChemistry && formations.length > 0) {
    try {
      return calculateSquadChemistry(players, formations[0]);
    } catch {
      return null;
    }
  }

  return bestChemistry;
}

/**
 * Check if squad meets minimum chemistry requirement
 */
export function meetsChemistryRequirement(
  players: Player[],
  minChemistry: number
): { valid: boolean; actualChemistry: number; message: string } {
  try {
    const chemistry = calculateSquadChemistry(players);
    
    if (chemistry.totalChemistry >= minChemistry) {
      return {
        valid: true,
        actualChemistry: chemistry.totalChemistry,
        message: `✅ Chemistry: ${chemistry.totalChemistry}/33 (Required: ${minChemistry})`,
      };
    }

    return {
      valid: false,
      actualChemistry: chemistry.totalChemistry,
      message: `❌ Chemistry: ${chemistry.totalChemistry}/33 (Required: ${minChemistry})`,
    };
  } catch (error: any) {
    return {
      valid: false,
      actualChemistry: 0,
      message: `Error calculating chemistry: ${error.message}`,
    };
  }
}

