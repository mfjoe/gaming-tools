/**
 * EA FC 25 Formations Configuration
 * 
 * Defines all available formations with position coordinates and metadata.
 * Coordinates use a 100x100 grid where:
 * - X: 0 (left) to 100 (right)
 * - Y: 0 (top/opponent goal) to 100 (bottom/your goal)
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type FormationCategory = 'attacking' | 'balanced' | 'defensive';

export type PositionRole = 'goalkeeper' | 'defender' | 'midfielder' | 'attacker';

export type Position =
  | 'GK' | 'LB' | 'LWB' | 'CB' | 'RB' | 'RWB'
  | 'LM' | 'CM' | 'CDM' | 'CAM' | 'RM' | 'LW' | 'RW'
  | 'LF' | 'CF' | 'ST' | 'RF';

export interface FormationPosition {
  slot: number; // 0-10 for starting XI
  position: Position;
  x: number; // 0-100 percentage from left
  y: number; // 0-100 percentage from top
  role: PositionRole;
}

export interface Formation {
  id: string;
  name: string;
  displayName: string;
  category: FormationCategory;
  positions: FormationPosition[];
  substitutes: number;
  reserves: number;
}

// ============================================
// POSITION VALIDATION
// ============================================

const VALID_POSITIONS: Position[] = [
  'GK', 'LB', 'LWB', 'CB', 'RB', 'RWB',
  'LM', 'CM', 'CDM', 'CAM', 'RM', 'LW', 'RW',
  'LF', 'CF', 'ST', 'RF'
];

const POSITION_CATEGORIES: Record<Position, PositionRole> = {
  'GK': 'goalkeeper',
  'LB': 'defender',
  'LWB': 'defender',
  'CB': 'defender',
  'RB': 'defender',
  'RWB': 'defender',
  'LM': 'midfielder',
  'CM': 'midfielder',
  'CDM': 'midfielder',
  'CAM': 'midfielder',
  'RM': 'midfielder',
  'LW': 'midfielder',
  'RW': 'midfielder',
  'LF': 'attacker',
  'CF': 'attacker',
  'ST': 'attacker',
  'RF': 'attacker'
};

// Position compatibility matrix for position changes
const POSITION_COMPATIBILITY: Record<Position, Position[]> = {
  'GK': ['GK'],
  'LB': ['LB', 'LWB', 'LM', 'CB'],
  'LWB': ['LWB', 'LB', 'LM'],
  'CB': ['CB', 'CDM', 'LB', 'RB'],
  'RB': ['RB', 'RWB', 'RM', 'CB'],
  'RWB': ['RWB', 'RB', 'RM'],
  'LM': ['LM', 'LW', 'LB', 'CM'],
  'CM': ['CM', 'CAM', 'CDM', 'LM', 'RM'],
  'CDM': ['CDM', 'CM', 'CB'],
  'CAM': ['CAM', 'CF', 'CM', 'ST'],
  'RM': ['RM', 'RW', 'RB', 'CM'],
  'LW': ['LW', 'LF', 'LM', 'ST'],
  'RW': ['RW', 'RF', 'RM', 'ST'],
  'LF': ['LF', 'LW', 'ST', 'CF'],
  'CF': ['CF', 'CAM', 'ST', 'LF', 'RF'],
  'ST': ['ST', 'CF', 'CAM', 'LF', 'RF'],
  'RF': ['RF', 'RW', 'ST', 'CF']
};

// ============================================
// FORMATIONS DATA
// ============================================

export const FORMATIONS: Formation[] = [
  /**
   * 4-3-3 Formation (Standard)
   * Attacking formation with width and forward pressure
   */
  {
    id: '4-3-3',
    name: '4-3-3',
    displayName: '4-3-3 (Attacking)',
    category: 'attacking',
    positions: [
      { slot: 0, position: 'GK', x: 50, y: 90, role: 'goalkeeper' },
      { slot: 1, position: 'LB', x: 15, y: 72, role: 'defender' },
      { slot: 2, position: 'CB', x: 35, y: 75, role: 'defender' },
      { slot: 3, position: 'CB', x: 65, y: 75, role: 'defender' },
      { slot: 4, position: 'RB', x: 85, y: 72, role: 'defender' },
      { slot: 5, position: 'CM', x: 30, y: 52, role: 'midfielder' },
      { slot: 6, position: 'CM', x: 50, y: 50, role: 'midfielder' },
      { slot: 7, position: 'CM', x: 70, y: 52, role: 'midfielder' },
      { slot: 8, position: 'LW', x: 20, y: 18, role: 'attacker' },
      { slot: 9, position: 'ST', x: 50, y: 12, role: 'attacker' },
      { slot: 10, position: 'RW', x: 80, y: 18, role: 'attacker' }
    ],
    substitutes: 7,
    reserves: 5
  },

  /**
   * 4-3-3(4) Formation (with CAM)
   * More creative attacking with a central playmaker
   */
  {
    id: '4-3-3-4',
    name: '4-3-3(4)',
    displayName: '4-3-3 (4) - False 9',
    category: 'attacking',
    positions: [
      { slot: 0, position: 'GK', x: 50, y: 90, role: 'goalkeeper' },
      { slot: 1, position: 'LB', x: 15, y: 72, role: 'defender' },
      { slot: 2, position: 'CB', x: 35, y: 75, role: 'defender' },
      { slot: 3, position: 'CB', x: 65, y: 75, role: 'defender' },
      { slot: 4, position: 'RB', x: 85, y: 72, role: 'defender' },
      { slot: 5, position: 'CM', x: 30, y: 55, role: 'midfielder' },
      { slot: 6, position: 'CAM', x: 50, y: 45, role: 'midfielder' },
      { slot: 7, position: 'CM', x: 70, y: 55, role: 'midfielder' },
      { slot: 8, position: 'LW', x: 20, y: 18, role: 'attacker' },
      { slot: 9, position: 'ST', x: 50, y: 12, role: 'attacker' },
      { slot: 10, position: 'RW', x: 80, y: 18, role: 'attacker' }
    ],
    substitutes: 7,
    reserves: 5
  },

  /**
   * 4-4-2 Formation
   * Classic balanced formation with two strikers
   */
  {
    id: '4-4-2',
    name: '4-4-2',
    displayName: '4-4-2 (Flat)',
    category: 'balanced',
    positions: [
      { slot: 0, position: 'GK', x: 50, y: 90, role: 'goalkeeper' },
      { slot: 1, position: 'LB', x: 15, y: 72, role: 'defender' },
      { slot: 2, position: 'CB', x: 35, y: 75, role: 'defender' },
      { slot: 3, position: 'CB', x: 65, y: 75, role: 'defender' },
      { slot: 4, position: 'RB', x: 85, y: 72, role: 'defender' },
      { slot: 5, position: 'LM', x: 20, y: 48, role: 'midfielder' },
      { slot: 6, position: 'CM', x: 40, y: 50, role: 'midfielder' },
      { slot: 7, position: 'CM', x: 60, y: 50, role: 'midfielder' },
      { slot: 8, position: 'RM', x: 80, y: 48, role: 'midfielder' },
      { slot: 9, position: 'ST', x: 38, y: 15, role: 'attacker' },
      { slot: 10, position: 'ST', x: 62, y: 15, role: 'attacker' }
    ],
    substitutes: 7,
    reserves: 5
  },

  /**
   * 4-2-3-1 Formation
   * Defensive midfield with attacking playmaker
   */
  {
    id: '4-2-3-1',
    name: '4-2-3-1',
    displayName: '4-2-3-1 (Wide)',
    category: 'balanced',
    positions: [
      { slot: 0, position: 'GK', x: 50, y: 90, role: 'goalkeeper' },
      { slot: 1, position: 'LB', x: 15, y: 72, role: 'defender' },
      { slot: 2, position: 'CB', x: 35, y: 75, role: 'defender' },
      { slot: 3, position: 'CB', x: 65, y: 75, role: 'defender' },
      { slot: 4, position: 'RB', x: 85, y: 72, role: 'defender' },
      { slot: 5, position: 'CDM', x: 40, y: 58, role: 'midfielder' },
      { slot: 6, position: 'CDM', x: 60, y: 58, role: 'midfielder' },
      { slot: 7, position: 'CAM', x: 50, y: 38, role: 'midfielder' },
      { slot: 8, position: 'LW', x: 22, y: 25, role: 'attacker' },
      { slot: 9, position: 'ST', x: 50, y: 12, role: 'attacker' },
      { slot: 10, position: 'RW', x: 78, y: 25, role: 'attacker' }
    ],
    substitutes: 7,
    reserves: 5
  },

  /**
   * 4-1-2-1-2 Formation (Narrow)
   * Diamond midfield with two strikers
   */
  {
    id: '4-1-2-1-2',
    name: '4-1-2-1-2',
    displayName: '4-1-2-1-2 (Narrow)',
    category: 'balanced',
    positions: [
      { slot: 0, position: 'GK', x: 50, y: 90, role: 'goalkeeper' },
      { slot: 1, position: 'LB', x: 15, y: 72, role: 'defender' },
      { slot: 2, position: 'CB', x: 35, y: 75, role: 'defender' },
      { slot: 3, position: 'CB', x: 65, y: 75, role: 'defender' },
      { slot: 4, position: 'RB', x: 85, y: 72, role: 'defender' },
      { slot: 5, position: 'CDM', x: 50, y: 60, role: 'midfielder' },
      { slot: 6, position: 'CM', x: 35, y: 45, role: 'midfielder' },
      { slot: 7, position: 'CM', x: 65, y: 45, role: 'midfielder' },
      { slot: 8, position: 'CAM', x: 50, y: 32, role: 'midfielder' },
      { slot: 9, position: 'ST', x: 38, y: 12, role: 'attacker' },
      { slot: 10, position: 'ST', x: 62, y: 12, role: 'attacker' }
    ],
    substitutes: 7,
    reserves: 5
  },

  /**
   * 4-3-2-1 Formation (Christmas Tree)
   * Three CAMs supporting a lone striker
   */
  {
    id: '4-3-2-1',
    name: '4-3-2-1',
    displayName: '4-3-2-1 (Narrow)',
    category: 'attacking',
    positions: [
      { slot: 0, position: 'GK', x: 50, y: 90, role: 'goalkeeper' },
      { slot: 1, position: 'LB', x: 15, y: 72, role: 'defender' },
      { slot: 2, position: 'CB', x: 35, y: 75, role: 'defender' },
      { slot: 3, position: 'CB', x: 65, y: 75, role: 'defender' },
      { slot: 4, position: 'RB', x: 85, y: 72, role: 'defender' },
      { slot: 5, position: 'CM', x: 30, y: 55, role: 'midfielder' },
      { slot: 6, position: 'CM', x: 50, y: 57, role: 'midfielder' },
      { slot: 7, position: 'CM', x: 70, y: 55, role: 'midfielder' },
      { slot: 8, position: 'CAM', x: 38, y: 28, role: 'midfielder' },
      { slot: 9, position: 'ST', x: 50, y: 12, role: 'attacker' },
      { slot: 10, position: 'CAM', x: 62, y: 28, role: 'midfielder' }
    ],
    substitutes: 7,
    reserves: 5
  },

  /**
   * 3-5-2 Formation
   * Wing-backs with three center backs
   */
  {
    id: '3-5-2',
    name: '3-5-2',
    displayName: '3-5-2 (Wing Backs)',
    category: 'balanced',
    positions: [
      { slot: 0, position: 'GK', x: 50, y: 90, role: 'goalkeeper' },
      { slot: 1, position: 'CB', x: 25, y: 75, role: 'defender' },
      { slot: 2, position: 'CB', x: 50, y: 75, role: 'defender' },
      { slot: 3, position: 'CB', x: 75, y: 75, role: 'defender' },
      { slot: 4, position: 'LWB', x: 12, y: 55, role: 'defender' },
      { slot: 5, position: 'CM', x: 35, y: 52, role: 'midfielder' },
      { slot: 6, position: 'CM', x: 50, y: 50, role: 'midfielder' },
      { slot: 7, position: 'CM', x: 65, y: 52, role: 'midfielder' },
      { slot: 8, position: 'RWB', x: 88, y: 55, role: 'defender' },
      { slot: 9, position: 'ST', x: 38, y: 15, role: 'attacker' },
      { slot: 10, position: 'ST', x: 62, y: 15, role: 'attacker' }
    ],
    substitutes: 7,
    reserves: 5
  },

  /**
   * 5-3-2 Formation
   * Defensive with five at the back
   */
  {
    id: '5-3-2',
    name: '5-3-2',
    displayName: '5-3-2 (Defensive)',
    category: 'defensive',
    positions: [
      { slot: 0, position: 'GK', x: 50, y: 90, role: 'goalkeeper' },
      { slot: 1, position: 'LWB', x: 12, y: 72, role: 'defender' },
      { slot: 2, position: 'CB', x: 30, y: 75, role: 'defender' },
      { slot: 3, position: 'CB', x: 50, y: 75, role: 'defender' },
      { slot: 4, position: 'CB', x: 70, y: 75, role: 'defender' },
      { slot: 5, position: 'RWB', x: 88, y: 72, role: 'defender' },
      { slot: 6, position: 'CM', x: 35, y: 52, role: 'midfielder' },
      { slot: 7, position: 'CM', x: 50, y: 50, role: 'midfielder' },
      { slot: 8, position: 'CM', x: 65, y: 52, role: 'midfielder' },
      { slot: 9, position: 'ST', x: 38, y: 15, role: 'attacker' },
      { slot: 10, position: 'ST', x: 62, y: 15, role: 'attacker' }
    ],
    substitutes: 7,
    reserves: 5
  },

  /**
   * 4-2-2-2 Formation
   * Two CDMs with two CAMs and two strikers
   */
  {
    id: '4-2-2-2',
    name: '4-2-2-2',
    displayName: '4-2-2-2 (Narrow)',
    category: 'attacking',
    positions: [
      { slot: 0, position: 'GK', x: 50, y: 90, role: 'goalkeeper' },
      { slot: 1, position: 'LB', x: 15, y: 72, role: 'defender' },
      { slot: 2, position: 'CB', x: 35, y: 75, role: 'defender' },
      { slot: 3, position: 'CB', x: 65, y: 75, role: 'defender' },
      { slot: 4, position: 'RB', x: 85, y: 72, role: 'defender' },
      { slot: 5, position: 'CDM', x: 40, y: 58, role: 'midfielder' },
      { slot: 6, position: 'CDM', x: 60, y: 58, role: 'midfielder' },
      { slot: 7, position: 'CAM', x: 38, y: 32, role: 'midfielder' },
      { slot: 8, position: 'CAM', x: 62, y: 32, role: 'midfielder' },
      { slot: 9, position: 'ST', x: 38, y: 12, role: 'attacker' },
      { slot: 10, position: 'ST', x: 62, y: 12, role: 'attacker' }
    ],
    substitutes: 7,
    reserves: 5
  },

  /**
   * 3-4-3 Formation
   * Three at the back with wide midfielders
   */
  {
    id: '3-4-3',
    name: '3-4-3',
    displayName: '3-4-3 (Attacking)',
    category: 'attacking',
    positions: [
      { slot: 0, position: 'GK', x: 50, y: 90, role: 'goalkeeper' },
      { slot: 1, position: 'CB', x: 25, y: 75, role: 'defender' },
      { slot: 2, position: 'CB', x: 50, y: 75, role: 'defender' },
      { slot: 3, position: 'CB', x: 75, y: 75, role: 'defender' },
      { slot: 4, position: 'LM', x: 15, y: 50, role: 'midfielder' },
      { slot: 5, position: 'CM', x: 38, y: 52, role: 'midfielder' },
      { slot: 6, position: 'CM', x: 62, y: 52, role: 'midfielder' },
      { slot: 7, position: 'RM', x: 85, y: 50, role: 'midfielder' },
      { slot: 8, position: 'LW', x: 20, y: 18, role: 'attacker' },
      { slot: 9, position: 'ST', x: 50, y: 12, role: 'attacker' },
      { slot: 10, position: 'RW', x: 80, y: 18, role: 'attacker' }
    ],
    substitutes: 7,
    reserves: 5
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a formation by its ID
 * @param formationId - The formation identifier (e.g., '4-3-3')
 * @returns The formation object or undefined if not found
 */
export function getFormation(formationId: string): Formation | undefined {
  return FORMATIONS.find(f => f.id === formationId || f.name === formationId);
}

/**
 * Get all available formations
 * @returns Array of all formations
 */
export function getAllFormations(): Formation[] {
  return [...FORMATIONS];
}

/**
 * Get formations filtered by category
 * @param category - The formation category (attacking, balanced, defensive)
 * @returns Array of formations matching the category
 */
export function getFormationsByCategory(category: FormationCategory): Formation[] {
  return FORMATIONS.filter(f => f.category === category);
}

/**
 * Check if a position abbreviation is valid
 * @param position - Position string to validate
 * @returns True if the position is valid
 */
export function isValidPosition(position: string): position is Position {
  return VALID_POSITIONS.includes(position as Position);
}

/**
 * Get the category/role for a position
 * @param position - Position abbreviation
 * @returns The position role (goalkeeper, defender, midfielder, attacker)
 */
export function getPositionCategory(position: Position): PositionRole {
  return POSITION_CATEGORIES[position] || 'midfielder';
}

/**
 * Check if two positions are compatible for position changes
 * @param pos1 - First position
 * @param pos2 - Second position
 * @returns True if positions are compatible
 */
export function arePositionsCompatible(pos1: Position, pos2: Position): boolean {
  const compatible = POSITION_COMPATIBILITY[pos1];
  return compatible ? compatible.includes(pos2) : false;
}

/**
 * Get all compatible positions for a given position
 * @param position - Starting position
 * @returns Array of compatible positions
 */
export function getCompatiblePositions(position: Position): Position[] {
  return POSITION_COMPATIBILITY[position] || [];
}

/**
 * Validate that a formation has exactly 11 positions
 * @param formation - Formation to validate
 * @returns True if formation is valid
 */
export function isValidFormation(formation: Formation): boolean {
  return formation.positions.length === 11 &&
         formation.positions.every(p => isValidPosition(p.position));
}

export default {
  FORMATIONS,
  getFormation,
  getAllFormations,
  getFormationsByCategory,
  isValidPosition,
  getPositionCategory,
  arePositionsCompatible,
  getCompatiblePositions,
  isValidFormation
};


