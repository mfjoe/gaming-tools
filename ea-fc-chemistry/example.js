/**
 * EA FC 25 Chemistry Engine - Quick Example
 * 
 * Run this file to see the chemistry engine in action
 * node example.js
 */

import {
  calculatePlayerChemistry,
  calculateSquadChemistry,
  calculateTotalSquadChemistry,
  CARD_TYPES,
} from './chemistryEngine.js';

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║              EA FC 25 Chemistry Engine - Live Example                     ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// BUILD A SAMPLE SQUAD
// ============================================================================

console.log('Building a Premier League squad with Icons and Heroes...\n');

const squad = [
  // 1. Icon - Pelé
  {
    id: '1',
    name: 'Pelé (Icon)',
    positions: ['ST'],
    currentPosition: 'ST',
    club: 'Icons',
    league: 'Icons',
    nationalities: ['Brazil'],
    cardType: CARD_TYPES.ICON,
  },

  // 2. Hero - Robbie Keane (Premier League)
  {
    id: '2',
    name: 'Robbie Keane (Hero)',
    positions: ['ST'],
    currentPosition: 'ST',
    club: 'Heroes',
    league: 'Heroes',
    nationalities: ['Ireland'],
    cardType: CARD_TYPES.HERO,
    heroLeague: 'Premier League',
  },

  // 3-8. Manchester City players (6 players)
  {
    id: '3',
    name: 'Haaland',
    positions: ['ST'],
    currentPosition: 'ST',
    club: 'Manchester City',
    league: 'Premier League',
    nationalities: ['Norway'],
  },
  {
    id: '4',
    name: 'De Bruyne',
    positions: ['CAM', 'CM'],
    currentPosition: 'CAM',
    club: 'Manchester City',
    league: 'Premier League',
    nationalities: ['Belgium'],
  },
  {
    id: '5',
    name: 'Rodri',
    positions: ['CDM'],
    currentPosition: 'CDM',
    club: 'Manchester City',
    league: 'Premier League',
    nationalities: ['Spain'],
  },
  {
    id: '6',
    name: 'Foden',
    positions: ['LW', 'CAM'],
    currentPosition: 'LW',
    club: 'Manchester City',
    league: 'Premier League',
    nationalities: ['England'],
  },
  {
    id: '7',
    name: 'Walker',
    positions: ['RB'],
    currentPosition: 'RB',
    club: 'Manchester City',
    league: 'Premier League',
    nationalities: ['England'],
  },
  {
    id: '8',
    name: 'Ederson',
    positions: ['GK'],
    currentPosition: 'GK',
    club: 'Manchester City',
    league: 'Premier League',
    nationalities: ['Brazil'],
  },

  // 9-11. Liverpool players (3 players)
  {
    id: '9',
    name: 'Salah',
    positions: ['RW'],
    currentPosition: 'RW',
    club: 'Liverpool',
    league: 'Premier League',
    nationalities: ['Egypt'],
  },
  {
    id: '10',
    name: 'Van Dijk',
    positions: ['CB'],
    currentPosition: 'CB',
    club: 'Liverpool',
    league: 'Premier League',
    nationalities: ['Netherlands'],
  },
  {
    id: '11',
    name: 'Alexander-Arnold',
    positions: ['RB', 'RWB'],
    currentPosition: 'RB',
    club: 'Liverpool',
    league: 'Premier League',
    nationalities: ['England'],
  },
];

// Manager with Premier League connection
const manager = {
  nationality: 'England',
  league: 'Premier League',
};

// ============================================================================
// CALCULATE CHEMISTRY
// ============================================================================

console.log('═'.repeat(80));
console.log('SQUAD COMPOSITION');
console.log('═'.repeat(80));
console.log('- 1 Icon (Pelé)');
console.log('- 1 Premier League Hero (Robbie Keane)');
console.log('- 6 Manchester City players');
console.log('- 3 Liverpool players');
console.log('- All 11 players in Premier League');
console.log('- Manager: English, Premier League\n');

console.log('═'.repeat(80));
console.log('CHEMISTRY CALCULATION');
console.log('═'.repeat(80) + '\n');

const results = calculateSquadChemistry(squad, manager);
const totalChemistry = calculateTotalSquadChemistry(squad, manager);

// Display each player's chemistry
results.forEach((result, index) => {
  const player = squad[index];
  const b = result.breakdown;

  console.log(`${index + 1}. ${result.playerName} (${player.club})`);
  console.log(`   Chemistry: ${result.chemistry}/3 ${result.chemistry === 3 ? '⭐⭐⭐' : ''}`);
  
  if (b.isSpecialCard) {
    console.log(`   Special Card: Always receives 3 chemistry`);
  } else {
    console.log(`   • Club: ${b.club.count} players → +${b.club.chemistry} chemistry`);
    console.log(`   • Nationality (${b.nationality.bestNationality}): ${b.nationality.count} players → +${b.nationality.chemistry} chemistry`);
    console.log(`   • League (Premier League): ${b.league.count} players → +${b.league.chemistry} chemistry`);
    console.log(`   • Manager bonus: +${b.manager.bonus}${b.manager.reason ? ` (${b.manager.reason})` : ''}`);
    
    if (b.capped) {
      console.log(`   • Total before cap: ${b.club.chemistry + b.nationality.chemistry + b.league.chemistry + b.manager.bonus} → CAPPED at 3`);
    }
  }
  console.log('');
});

// ============================================================================
// SUMMARY
// ============================================================================

console.log('═'.repeat(80));
console.log('SQUAD CHEMISTRY SUMMARY');
console.log('═'.repeat(80));
console.log(`Total Squad Chemistry: ${totalChemistry}/33`);
console.log(`Average Chemistry: ${(totalChemistry / 11).toFixed(2)}/3.00`);
console.log(`Players with 3 Chemistry: ${results.filter(r => r.chemistry === 3).length}/11`);
console.log('');

// ============================================================================
// SPECIAL CARD ANALYSIS
// ============================================================================

console.log('═'.repeat(80));
console.log('SPECIAL CARDS CONTRIBUTION');
console.log('═'.repeat(80));
console.log('\n🌟 ICON (Pelé):');
console.log('   - Always receives 3 chemistry');
console.log('   - Counts as +2 for nationality thresholds');
console.log('   - Counts as +1 for ALL leagues (helps everyone)');
console.log('   - In this squad: Helps all 11 players reach league thresholds\n');

console.log('⭐ HERO (Robbie Keane):');
console.log('   - Always receives 3 chemistry');
console.log('   - Counts as +2 for Premier League ONLY');
console.log('   - Does NOT help other leagues');
console.log('   - In this squad: Provides +2 to Premier League count (9+2=11)\n');

// ============================================================================
// CLUB CHEMISTRY BREAKDOWN
// ============================================================================

console.log('═'.repeat(80));
console.log('CLUB CHEMISTRY BREAKDOWN');
console.log('═'.repeat(80));
console.log('\nManchester City (6 players):');
console.log('   - 6 players = +2 club chemistry (threshold: 4=+2, 7=+3)');
console.log('   - Players: Haaland, De Bruyne, Rodri, Foden, Walker, Ederson\n');

console.log('Liverpool (3 players):');
console.log('   - 3 players = +1 club chemistry (threshold: 2=+1, 4=+2)');
console.log('   - Players: Salah, Van Dijk, Alexander-Arnold\n');

console.log('Special Cards:');
console.log('   - Icons and Heroes do not count for club chemistry\n');

// ============================================================================
// TEST: OUT OF POSITION
// ============================================================================

console.log('═'.repeat(80));
console.log('DEMONSTRATION: OUT OF POSITION PENALTY');
console.log('═'.repeat(80) + '\n');

// Create a copy of Haaland but in wrong position
const haalandWrongPosition = {
  ...squad[2],
  id: 'test-wrong-position',
  name: 'Haaland (Playing GK - Wrong Position)',
  positions: ['ST'], // Can only play ST
  currentPosition: 'GK', // But playing GK!
};

const testSquad = [haalandWrongPosition, ...squad.slice(1)];
const wrongPositionChemistry = calculatePlayerChemistry(haalandWrongPosition, testSquad, manager);

console.log('Normal Haaland (ST):');
console.log(`   Position: ST (Preferred: ST)`);
console.log(`   Chemistry: ${results[2].chemistry}/3 ⭐⭐⭐\n`);

console.log('Haaland playing GK (Wrong Position):');
console.log(`   Position: GK (Preferred: ST)`);
console.log(`   Chemistry: ${wrongPositionChemistry}/3 ❌`);
console.log(`   Reason: Player must be in preferred position to get any chemistry\n`);

console.log('═'.repeat(80));
console.log('END OF DEMONSTRATION');
console.log('═'.repeat(80) + '\n');



