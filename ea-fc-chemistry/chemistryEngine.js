/**
 * EA FC 25 Chemistry Calculation Engine
 * 
 * Implements the modern FIFA 23+ chemistry system where chemistry is calculated
 * based on squad-wide thresholds rather than individual links.
 * 
 * @module chemistryEngine
 * @version 1.0.0
 */

// ============================================================================
// CHEMISTRY THRESHOLDS
// ============================================================================

/**
 * Club chemistry thresholds
 * Players from the same club contribute to chemistry
 */
const CLUB_THRESHOLDS = [
  { count: 7, chemistry: 3 },
  { count: 4, chemistry: 2 },
  { count: 2, chemistry: 1 },
];

/**
 * Nationality chemistry thresholds
 * Players from the same nation contribute to chemistry
 */
const NATIONALITY_THRESHOLDS = [
  { count: 8, chemistry: 3 },
  { count: 5, chemistry: 2 },
  { count: 2, chemistry: 1 },
];

/**
 * League chemistry thresholds
 * Players from the same league contribute to chemistry
 */
const LEAGUE_THRESHOLDS = [
  { count: 8, chemistry: 3 },
  { count: 5, chemistry: 2 },
  { count: 3, chemistry: 1 },
];

/**
 * Manager bonus chemistry
 * +1 if player shares nationality OR league with manager (max +1 total)
 */
const MANAGER_BONUS = 1;

/**
 * Maximum chemistry per player
 */
const MAX_CHEMISTRY = 3;

/**
 * Special card types
 */
const CARD_TYPES = {
  BASE: 'base',
  ICON: 'icon',
  HERO: 'hero',
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates a player object has all required fields
 * @param {Object} player - Player object to validate
 * @throws {Error} If player is missing required fields
 */
function validatePlayer(player) {
  if (!player) {
    throw new Error('Player object is required');
  }

  const requiredFields = ['id', 'name', 'positions', 'currentPosition', 'club', 'league', 'nationalities'];
  
  for (const field of requiredFields) {
    if (player[field] === undefined || player[field] === null) {
      throw new Error(`Player missing required field: ${field}`);
    }
  }

  // Validate positions is an array
  if (!Array.isArray(player.positions) || player.positions.length === 0) {
    throw new Error(`Player ${player.name} must have at least one valid position`);
  }

  // Validate nationalities is an array
  if (!Array.isArray(player.nationalities) || player.nationalities.length === 0) {
    throw new Error(`Player ${player.name} must have at least one nationality`);
  }

  // Validate currentPosition is in positions array
  if (!player.positions.includes(player.currentPosition)) {
    throw new Error(
      `Player ${player.name} current position "${player.currentPosition}" not in valid positions: ${player.positions.join(', ')}`
    );
  }

  // Validate card type if present
  if (player.cardType && !Object.values(CARD_TYPES).includes(player.cardType)) {
    throw new Error(`Invalid card type: ${player.cardType}. Must be one of: ${Object.values(CARD_TYPES).join(', ')}`);
  }

  // Validate hero has heroLeague
  if (player.cardType === CARD_TYPES.HERO && !player.heroLeague) {
    throw new Error(`Hero card ${player.name} must have heroLeague specified`);
  }
}

/**
 * Validates a squad array
 * @param {Array} squad - Array of player objects
 * @throws {Error} If squad is invalid
 */
function validateSquad(squad) {
  if (!Array.isArray(squad)) {
    throw new Error('Squad must be an array');
  }

  if (squad.length === 0) {
    throw new Error('Squad cannot be empty');
  }

  if (squad.length > 11) {
    throw new Error('Squad cannot have more than 11 players');
  }

  // Validate each player
  squad.forEach((player, index) => {
    try {
      validatePlayer(player);
    } catch (error) {
      throw new Error(`Invalid player at position ${index}: ${error.message}`);
    }
  });
}

/**
 * Validates a manager object
 * @param {Object} manager - Manager object to validate
 * @throws {Error} If manager is invalid
 */
function validateManager(manager) {
  if (!manager) {
    return; // Manager is optional
  }

  if (!manager.nationality && !manager.league) {
    throw new Error('Manager must have either nationality or league specified');
  }
}

// ============================================================================
// CHEMISTRY CALCULATION HELPERS
// ============================================================================

/**
 * Checks if a player is in their preferred position
 * @param {Object} player - Player object
 * @returns {boolean} True if player is in preferred position
 */
function isInPreferredPosition(player) {
  return player.positions.includes(player.currentPosition);
}

/**
 * Checks if a player is an Icon
 * @param {Object} player - Player object
 * @returns {boolean} True if player is an Icon
 */
function isIcon(player) {
  return player.cardType === CARD_TYPES.ICON;
}

/**
 * Checks if a player is a Hero
 * @param {Object} player - Player object
 * @returns {boolean} True if player is a Hero
 */
function isHero(player) {
  return player.cardType === CARD_TYPES.HERO;
}

/**
 * Counts players in squad with matching club
 * Icons and Heroes are excluded from club counts
 * 
 * @param {string} club - Club to match
 * @param {Array} squad - Array of player objects
 * @returns {number} Count of players with matching club
 */
function countClubMatches(club, squad) {
  return squad.filter(p => {
    // Icons and Heroes don't count for club chemistry
    if (isIcon(p) || isHero(p)) return false;
    return p.club === club;
  }).length;
}

/**
 * Counts players in squad with matching nationality
 * Icons count as +2 for nationality
 * 
 * @param {string} nationality - Nationality to match
 * @param {Array} squad - Array of player objects
 * @returns {number} Count of players with matching nationality
 */
function countNationalityMatches(nationality, squad) {
  let count = 0;
  
  for (const player of squad) {
    if (isIcon(player)) {
      // Icons count as +2 for nationality
      count += 2;
    } else if (player.nationalities.includes(nationality)) {
      count += 1;
    }
  }
  
  return count;
}

/**
 * Counts players in squad with matching league
 * Icons count as +1 for ALL leagues
 * Heroes count as +2 for their specific league only
 * 
 * @param {string} league - League to match
 * @param {Array} squad - Array of player objects
 * @returns {number} Count of players with matching league
 */
function countLeagueMatches(league, squad) {
  let count = 0;
  
  for (const player of squad) {
    if (isIcon(player)) {
      // Icons count as +1 for ALL leagues
      count += 1;
    } else if (isHero(player) && player.heroLeague === league) {
      // Heroes count as +2 for their specific league only
      count += 2;
    } else if (player.league === league) {
      count += 1;
    }
  }
  
  return count;
}

/**
 * Calculates chemistry from thresholds
 * Finds the highest threshold met by the count
 * 
 * @param {number} count - Count of matching players
 * @param {Array} thresholds - Array of threshold objects {count, chemistry}
 * @returns {number} Chemistry points from threshold (0-3)
 */
function getChemistryFromThreshold(count, thresholds) {
  // Thresholds are sorted from highest to lowest
  for (const threshold of thresholds) {
    if (count >= threshold.count) {
      return threshold.chemistry;
    }
  }
  return 0;
}

/**
 * Calculates manager bonus for a player
 * +1 if player shares nationality OR league with manager (max +1)
 * 
 * @param {Object} player - Player object
 * @param {Object} manager - Manager object (optional)
 * @returns {number} Manager bonus chemistry (0 or 1)
 */
function calculateManagerBonus(player, manager) {
  if (!manager) return 0;

  // Icons and Heroes always get max chemistry, so manager bonus isn't needed
  // But we calculate it for consistency
  
  // Check nationality match
  if (manager.nationality && player.nationalities.includes(manager.nationality)) {
    return MANAGER_BONUS;
  }

  // Check league match
  if (manager.league && player.league === manager.league) {
    return MANAGER_BONUS;
  }

  return 0;
}

/**
 * Gets the best nationality match for a player with dual/multiple nationalities
 * Returns the nationality that gives the most chemistry from the squad
 * 
 * @param {Object} player - Player object
 * @param {Array} squad - Array of player objects
 * @returns {string} Best nationality to use
 */
function getBestNationality(player, squad) {
  if (player.nationalities.length === 1) {
    return player.nationalities[0];
  }

  let bestNationality = player.nationalities[0];
  let bestCount = 0;

  for (const nationality of player.nationalities) {
    const count = countNationalityMatches(nationality, squad);
    if (count > bestCount) {
      bestCount = count;
      bestNationality = nationality;
    }
  }

  return bestNationality;
}

// ============================================================================
// MAIN CHEMISTRY CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates chemistry for a single player based on squad composition
 * 
 * Chemistry Calculation Rules:
 * 1. Player MUST be in preferred position or gets 0 chemistry
 * 2. Icons always get 3 chemistry (and contribute to squad counts)
 * 3. Heroes always get 3 chemistry (and contribute to squad counts)
 * 4. Regular players get chemistry from:
 *    - Club matches: 2=+1, 4=+2, 7=+3
 *    - Nationality matches: 2=+1, 5=+2, 8=+3
 *    - League matches: 3=+1, 5=+2, 8=+3
 *    - Manager bonus: +1 if nationality OR league match
 * 5. Maximum chemistry is capped at 3
 * 
 * @param {Object} player - Player object to calculate chemistry for
 * @param {Array} squad - Full squad array (11 players)
 * @param {Object} manager - Manager object (optional)
 * @returns {number} Chemistry points (0-3)
 * 
 * @example
 * const player = {
 *   id: '1',
 *   name: 'Mbappé',
 *   positions: ['ST', 'LW'],
 *   currentPosition: 'ST',
 *   club: 'PSG',
 *   league: 'Ligue 1',
 *   nationalities: ['France'],
 *   cardType: 'base'
 * };
 * const chemistry = calculatePlayerChemistry(player, squad, manager);
 */
function calculatePlayerChemistry(player, squad, manager = null) {
  // Validate inputs
  validatePlayer(player);
  validateSquad(squad);
  validateManager(manager);

  // Rule 1: Player must be in preferred position
  if (!isInPreferredPosition(player)) {
    return 0;
  }

  // Rule 2 & 3: Icons and Heroes always get max chemistry
  if (isIcon(player) || isHero(player)) {
    return MAX_CHEMISTRY;
  }

  // Calculate chemistry from each category
  let totalChemistry = 0;

  // Club chemistry
  const clubCount = countClubMatches(player.club, squad);
  const clubChemistry = getChemistryFromThreshold(clubCount, CLUB_THRESHOLDS);
  totalChemistry += clubChemistry;

  // Nationality chemistry (use best nationality if player has multiple)
  const bestNationality = getBestNationality(player, squad);
  const nationalityCount = countNationalityMatches(bestNationality, squad);
  const nationalityChemistry = getChemistryFromThreshold(nationalityCount, NATIONALITY_THRESHOLDS);
  totalChemistry += nationalityChemistry;

  // League chemistry
  const leagueCount = countLeagueMatches(player.league, squad);
  const leagueChemistry = getChemistryFromThreshold(leagueCount, LEAGUE_THRESHOLDS);
  totalChemistry += leagueChemistry;

  // Manager bonus
  const managerBonus = calculateManagerBonus(player, manager);
  totalChemistry += managerBonus;

  // Rule 5: Cap at maximum chemistry
  return Math.min(totalChemistry, MAX_CHEMISTRY);
}

/**
 * Calculates chemistry for all players in the squad
 * Returns an array of chemistry values matching the squad order
 * 
 * @param {Array} squad - Array of player objects (max 11)
 * @param {Object} manager - Manager object (optional)
 * @returns {Array<Object>} Array of objects with player info and chemistry
 * 
 * @example
 * const results = calculateSquadChemistry(squad, manager);
 * // Returns: [
 * //   { playerId: '1', playerName: 'Mbappé', chemistry: 3, breakdown: {...} },
 * //   { playerId: '2', playerName: 'Neymar', chemistry: 2, breakdown: {...} },
 * //   ...
 * // ]
 */
function calculateSquadChemistry(squad, manager = null) {
  // Validate inputs
  validateSquad(squad);
  validateManager(manager);

  // Calculate chemistry for each player
  return squad.map(player => {
    const chemistry = calculatePlayerChemistry(player, squad, manager);
    
    // Build breakdown for debugging/display
    const breakdown = buildChemistryBreakdown(player, squad, manager);

    return {
      playerId: player.id,
      playerName: player.name,
      chemistry: chemistry,
      breakdown: breakdown,
    };
  });
}

/**
 * Builds a detailed breakdown of chemistry calculation for a player
 * Useful for debugging and displaying to users
 * 
 * @param {Object} player - Player object
 * @param {Array} squad - Full squad array
 * @param {Object} manager - Manager object (optional)
 * @returns {Object} Breakdown object with details
 */
function buildChemistryBreakdown(player, squad, manager = null) {
  const breakdown = {
    inPreferredPosition: isInPreferredPosition(player),
    isSpecialCard: isIcon(player) || isHero(player),
    club: {
      count: 0,
      chemistry: 0,
    },
    nationality: {
      count: 0,
      chemistry: 0,
      bestNationality: null,
    },
    league: {
      count: 0,
      chemistry: 0,
    },
    manager: {
      bonus: 0,
      reason: null,
    },
    total: 0,
    capped: false,
  };

  // If not in position, return early
  if (!breakdown.inPreferredPosition) {
    return breakdown;
  }

  // If special card, set max chemistry
  if (breakdown.isSpecialCard) {
    breakdown.total = MAX_CHEMISTRY;
    breakdown.club.chemistry = 0; // Special cards don't use these
    breakdown.nationality.chemistry = 0;
    breakdown.league.chemistry = 0;
    return breakdown;
  }

  // Calculate breakdowns
  breakdown.club.count = countClubMatches(player.club, squad);
  breakdown.club.chemistry = getChemistryFromThreshold(breakdown.club.count, CLUB_THRESHOLDS);

  const bestNationality = getBestNationality(player, squad);
  breakdown.nationality.bestNationality = bestNationality;
  breakdown.nationality.count = countNationalityMatches(bestNationality, squad);
  breakdown.nationality.chemistry = getChemistryFromThreshold(breakdown.nationality.count, NATIONALITY_THRESHOLDS);

  breakdown.league.count = countLeagueMatches(player.league, squad);
  breakdown.league.chemistry = getChemistryFromThreshold(breakdown.league.count, LEAGUE_THRESHOLDS);

  // Manager bonus
  if (manager) {
    if (manager.nationality && player.nationalities.includes(manager.nationality)) {
      breakdown.manager.bonus = MANAGER_BONUS;
      breakdown.manager.reason = `Nationality match: ${manager.nationality}`;
    } else if (manager.league && player.league === manager.league) {
      breakdown.manager.bonus = MANAGER_BONUS;
      breakdown.manager.reason = `League match: ${manager.league}`;
    }
  }

  // Calculate total
  const uncapped = 
    breakdown.club.chemistry +
    breakdown.nationality.chemistry +
    breakdown.league.chemistry +
    breakdown.manager.bonus;

  breakdown.total = Math.min(uncapped, MAX_CHEMISTRY);
  breakdown.capped = uncapped > MAX_CHEMISTRY;

  return breakdown;
}

/**
 * Calculates total squad chemistry (sum of all player chemistry)
 * Maximum possible is 33 (11 players × 3 chemistry each)
 * 
 * @param {Array} squad - Array of player objects
 * @param {Object} manager - Manager object (optional)
 * @returns {number} Total squad chemistry (0-33)
 */
function calculateTotalSquadChemistry(squad, manager = null) {
  const results = calculateSquadChemistry(squad, manager);
  return results.reduce((total, result) => total + result.chemistry, 0);
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export for ES6 modules
export {
  calculatePlayerChemistry,
  calculateSquadChemistry,
  calculateTotalSquadChemistry,
  buildChemistryBreakdown,
  CLUB_THRESHOLDS,
  NATIONALITY_THRESHOLDS,
  LEAGUE_THRESHOLDS,
  MAX_CHEMISTRY,
  CARD_TYPES,
};

// Export for CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculatePlayerChemistry,
    calculateSquadChemistry,
    calculateTotalSquadChemistry,
    buildChemistryBreakdown,
    CLUB_THRESHOLDS,
    NATIONALITY_THRESHOLDS,
    LEAGUE_THRESHOLDS,
    MAX_CHEMISTRY,
    CARD_TYPES,
  };
}



