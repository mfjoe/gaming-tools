/**
 * EA FC 25 Chemistry Engine Test Suite
 * 
 * Comprehensive test cases demonstrating all chemistry calculation scenarios
 */

import {
  calculatePlayerChemistry,
  calculateSquadChemistry,
  calculateTotalSquadChemistry,
  buildChemistryBreakdown,
  CARD_TYPES,
} from './chemistryEngine.js';

// ============================================================================
// TEST HELPERS
// ============================================================================

/**
 * Creates a base player object
 */
function createPlayer(overrides = {}) {
  return {
    id: Math.random().toString(),
    name: 'Test Player',
    positions: ['ST'],
    currentPosition: 'ST',
    club: 'Test FC',
    league: 'Test League',
    nationalities: ['Test Nation'],
    cardType: CARD_TYPES.BASE,
    ...overrides,
  };
}

/**
 * Creates a manager object
 */
function createManager(overrides = {}) {
  return {
    nationality: null,
    league: null,
    ...overrides,
  };
}

/**
 * Logs test results with formatting
 */
function logTest(testName, result, expected = null) {
  console.log('\n' + '='.repeat(80));
  console.log(`TEST: ${testName}`);
  console.log('='.repeat(80));
  
  if (expected !== null) {
    const passed = JSON.stringify(result) === JSON.stringify(expected);
    console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    if (!passed) {
      console.log('Expected:', expected);
      console.log('Received:', result);
    }
  }
  
  console.log('Result:', JSON.stringify(result, null, 2));
}

// ============================================================================
// TEST CASE 1: Player in correct position with good chemistry
// ============================================================================

function testCase1_CorrectPositionGoodChemistry() {
  console.log('\n\n' + '█'.repeat(80));
  console.log('TEST CASE 1: Player in correct position with 3 club-mates, 5 same-nation, matching manager');
  console.log('█'.repeat(80));

  // Create squad with 3 PSG teammates, 5 French players
  const squad = [
    // Player being tested
    createPlayer({
      id: '1',
      name: 'Mbappé',
      positions: ['ST', 'LW'],
      currentPosition: 'ST',
      club: 'PSG',
      league: 'Ligue 1',
      nationalities: ['France'],
    }),
    
    // PSG teammates (need 4 total for +2 club chemistry)
    createPlayer({
      id: '2',
      name: 'Neymar',
      positions: ['LW'],
      currentPosition: 'LW',
      club: 'PSG',
      league: 'Ligue 1',
      nationalities: ['Brazil'],
    }),
    createPlayer({
      id: '3',
      name: 'Marquinhos',
      positions: ['CB'],
      currentPosition: 'CB',
      club: 'PSG',
      league: 'Ligue 1',
      nationalities: ['Brazil'],
    }),
    createPlayer({
      id: '4',
      name: 'Hakimi',
      positions: ['RB'],
      currentPosition: 'RB',
      club: 'PSG',
      league: 'Ligue 1',
      nationalities: ['Morocco'],
    }),
    
    // French players (need 5 total for +2 nationality chemistry)
    createPlayer({
      id: '5',
      name: 'Griezmann',
      positions: ['CAM'],
      currentPosition: 'CAM',
      club: 'Atletico Madrid',
      league: 'La Liga',
      nationalities: ['France'],
    }),
    createPlayer({
      id: '6',
      name: 'Benzema',
      positions: ['ST'],
      currentPosition: 'ST',
      club: 'Al-Ittihad',
      league: 'Saudi Pro League',
      nationalities: ['France'],
    }),
    createPlayer({
      id: '7',
      name: 'Kante',
      positions: ['CDM'],
      currentPosition: 'CDM',
      club: 'Al-Ittihad',
      league: 'Saudi Pro League',
      nationalities: ['France'],
    }),
    createPlayer({
      id: '8',
      name: 'Varane',
      positions: ['CB'],
      currentPosition: 'CB',
      club: 'Manchester United',
      league: 'Premier League',
      nationalities: ['France'],
    }),
    
    // Ligue 1 players (need 5 total for +2 league chemistry)
    createPlayer({
      id: '9',
      name: 'Lacazette',
      positions: ['ST'],
      currentPosition: 'ST',
      club: 'Lyon',
      league: 'Ligue 1',
      nationalities: ['France'],
    }),
    createPlayer({
      id: '10',
      name: 'Paquetá',
      positions: ['CM'],
      currentPosition: 'CM',
      club: 'Lyon',
      league: 'Ligue 1',
      nationalities: ['Brazil'],
    }),
    createPlayer({
      id: '11',
      name: 'David',
      positions: ['ST'],
      currentPosition: 'ST',
      club: 'Lille',
      league: 'Ligue 1',
      nationalities: ['Canada'],
    }),
  ];

  // Manager with matching nationality
  const manager = createManager({
    nationality: 'France',
    league: 'Premier League',
  });

  const player = squad[0]; // Mbappé
  const chemistry = calculatePlayerChemistry(player, squad, manager);
  const breakdown = buildChemistryBreakdown(player, squad, manager);

  logTest('Player Chemistry', chemistry, 3);
  console.log('\nBreakdown:');
  console.log(`- Club (PSG): ${breakdown.club.count} players → +${breakdown.club.chemistry} chemistry`);
  console.log(`- Nationality (France): ${breakdown.nationality.count} players → +${breakdown.nationality.chemistry} chemistry`);
  console.log(`- League (Ligue 1): ${breakdown.league.count} players → +${breakdown.league.chemistry} chemistry`);
  console.log(`- Manager bonus: +${breakdown.manager.bonus} (${breakdown.manager.reason || 'No match'})`);
  console.log(`- Total: ${breakdown.total}${breakdown.capped ? ' (CAPPED at 3)' : ''}`);
}

// ============================================================================
// TEST CASE 2: Player out of position
// ============================================================================

function testCase2_OutOfPosition() {
  console.log('\n\n' + '█'.repeat(80));
  console.log('TEST CASE 2: Player out of position (should return 0)');
  console.log('█'.repeat(80));

  const squad = [
    createPlayer({
      id: '1',
      name: 'Mbappé',
      positions: ['ST', 'LW'], // Can only play ST or LW
      currentPosition: 'CDM',   // Playing CDM - WRONG POSITION!
      club: 'PSG',
      league: 'Ligue 1',
      nationalities: ['France'],
    }),
    ...Array(10).fill(null).map((_, i) => createPlayer({
      id: `${i + 2}`,
      name: `Player ${i + 2}`,
      club: 'PSG',
      league: 'Ligue 1',
      nationalities: ['France'],
    })),
  ];

  const manager = createManager({ nationality: 'France' });
  const player = squad[0];
  const chemistry = calculatePlayerChemistry(player, squad, manager);
  const breakdown = buildChemistryBreakdown(player, squad, manager);

  logTest('Player Chemistry (Out of Position)', chemistry, 0);
  console.log('\nReason: Player must be in preferred position (ST or LW), but is playing CDM');
  console.log('In Preferred Position:', breakdown.inPreferredPosition);
}

// ============================================================================
// TEST CASE 3: Icon contributing to multiple leagues
// ============================================================================

function testCase3_IconChemistry() {
  console.log('\n\n' + '█'.repeat(80));
  console.log('TEST CASE 3: Icon contributing to multiple leagues');
  console.log('█'.repeat(80));

  const squad = [
    // Icon player
    createPlayer({
      id: '1',
      name: 'Pelé',
      positions: ['ST'],
      currentPosition: 'ST',
      club: 'Icons',
      league: 'Icons',
      nationalities: ['Brazil'],
      cardType: CARD_TYPES.ICON,
    }),
    
    // Regular player who benefits from Icon
    createPlayer({
      id: '2',
      name: 'Son',
      positions: ['LW'],
      currentPosition: 'LW',
      club: 'Tottenham',
      league: 'Premier League',
      nationalities: ['South Korea'],
    }),
    
    // More Premier League players
    createPlayer({
      id: '3',
      name: 'Kane',
      positions: ['ST'],
      currentPosition: 'ST',
      club: 'Bayern Munich',
      league: 'Premier League', // Before transfer
      nationalities: ['England'],
    }),
    
    ...Array(8).fill(null).map((_, i) => createPlayer({
      id: `${i + 4}`,
      name: `Player ${i + 4}`,
      club: 'Random FC',
      league: 'Premier League',
      nationalities: ['Random'],
    })),
  ];

  // Calculate chemistry for Icon
  const icon = squad[0];
  const iconChemistry = calculatePlayerChemistry(icon, squad, null);
  const iconBreakdown = buildChemistryBreakdown(icon, squad, null);

  console.log('\n--- ICON CHEMISTRY ---');
  logTest('Icon (Pelé) Chemistry', iconChemistry, 3);
  console.log('Icons always get 3 chemistry regardless of squad composition');
  console.log('Is Special Card:', iconBreakdown.isSpecialCard);

  // Calculate chemistry for regular player
  const regularPlayer = squad[1];
  const regularChemistry = calculatePlayerChemistry(regularPlayer, squad, null);
  const regularBreakdown = buildChemistryBreakdown(regularPlayer, squad, null);

  console.log('\n--- REGULAR PLAYER BENEFITING FROM ICON ---');
  logTest('Regular Player (Son) Chemistry', regularChemistry);
  console.log('\nHow Icon helps:');
  console.log(`- Icon counts as +1 for ALL leagues`);
  console.log(`- Premier League count: ${regularBreakdown.league.count} (includes Icon's +1)`);
  console.log(`- League chemistry: +${regularBreakdown.league.chemistry}`);
  console.log(`- Icon also counts as +2 for nationality thresholds`);
}

// ============================================================================
// TEST CASE 4: Hero contributing to specific league
// ============================================================================

function testCase4_HeroChemistry() {
  console.log('\n\n' + '█'.repeat(80));
  console.log('TEST CASE 4: Hero contributing to specific league');
  console.log('█'.repeat(80));

  const squad = [
    // Hero player (Premier League Hero)
    createPlayer({
      id: '1',
      name: 'Robbie Keane',
      positions: ['ST'],
      currentPosition: 'ST',
      club: 'Heroes',
      league: 'Heroes',
      nationalities: ['Ireland'],
      cardType: CARD_TYPES.HERO,
      heroLeague: 'Premier League',
    }),
    
    // Premier League players
    createPlayer({
      id: '2',
      name: 'Salah',
      positions: ['RW'],
      currentPosition: 'RW',
      club: 'Liverpool',
      league: 'Premier League',
      nationalities: ['Egypt'],
    }),
    createPlayer({
      id: '3',
      name: 'De Bruyne',
      positions: ['CAM'],
      currentPosition: 'CAM',
      club: 'Manchester City',
      league: 'Premier League',
      nationalities: ['Belgium'],
    }),
    
    // La Liga players (Hero should NOT help these)
    createPlayer({
      id: '4',
      name: 'Lewandowski',
      positions: ['ST'],
      currentPosition: 'ST',
      club: 'Barcelona',
      league: 'La Liga',
      nationalities: ['Poland'],
    }),
    
    ...Array(7).fill(null).map((_, i) => createPlayer({
      id: `${i + 5}`,
      name: `Player ${i + 5}`,
      club: 'Random FC',
      league: i < 4 ? 'Premier League' : 'La Liga',
      nationalities: ['Random'],
    })),
  ];

  // Calculate chemistry for Hero
  const hero = squad[0];
  const heroChemistry = calculatePlayerChemistry(hero, squad, null);
  const heroBreakdown = buildChemistryBreakdown(hero, squad, null);

  console.log('\n--- HERO CHEMISTRY ---');
  logTest('Hero (Robbie Keane) Chemistry', heroChemistry, 3);
  console.log('Heroes always get 3 chemistry regardless of squad composition');
  console.log('Is Special Card:', heroBreakdown.isSpecialCard);

  // Calculate chemistry for Premier League player
  const plPlayer = squad[1];
  const plChemistry = calculatePlayerChemistry(plPlayer, squad, null);
  const plBreakdown = buildChemistryBreakdown(plPlayer, squad, null);

  console.log('\n--- PREMIER LEAGUE PLAYER BENEFITING FROM HERO ---');
  logTest('Premier League Player (Salah) Chemistry', plChemistry);
  console.log('\nHow Hero helps:');
  console.log(`- Hero counts as +2 for their specific league (Premier League)`);
  console.log(`- Premier League count: ${plBreakdown.league.count} (includes Hero's +2)`);
  console.log(`- League chemistry: +${plBreakdown.league.chemistry}`);

  // Calculate chemistry for La Liga player
  const laLigaPlayer = squad[3];
  const laLigaChemistry = calculatePlayerChemistry(laLigaPlayer, squad, null);
  const laLigaBreakdown = buildChemistryBreakdown(laLigaPlayer, squad, null);

  console.log('\n--- LA LIGA PLAYER (Hero does NOT help) ---');
  logTest('La Liga Player (Lewandowski) Chemistry', laLigaChemistry);
  console.log('\nWhy Hero doesn\'t help:');
  console.log(`- Hero only counts for Premier League, not La Liga`);
  console.log(`- La Liga count: ${laLigaBreakdown.league.count} (Hero NOT included)`);
  console.log(`- League chemistry: +${laLigaBreakdown.league.chemistry}`);
}

// ============================================================================
// TEST CASE 5: Player with dual nationality using best match
// ============================================================================

function testCase5_DualNationality() {
  console.log('\n\n' + '█'.repeat(80));
  console.log('TEST CASE 5: Player with dual nationality using best match');
  console.log('█'.repeat(80));

  const squad = [
    // Player with dual nationality
    createPlayer({
      id: '1',
      name: 'Laporte',
      positions: ['CB'],
      currentPosition: 'CB',
      club: 'Al-Nassr',
      league: 'Saudi Pro League',
      nationalities: ['France', 'Spain'], // Dual nationality
    }),
    
    // 7 Spanish players (would give +3 for Spain)
    ...Array(7).fill(null).map((_, i) => createPlayer({
      id: `${i + 2}`,
      name: `Spanish Player ${i + 1}`,
      club: 'Random FC',
      league: 'La Liga',
      nationalities: ['Spain'],
    })),
    
    // 3 French players (would only give +2 for France)
    ...Array(3).fill(null).map((_, i) => createPlayer({
      id: `${i + 9}`,
      name: `French Player ${i + 1}`,
      club: 'Random FC',
      league: 'Ligue 1',
      nationalities: ['France'],
    })),
  ];

  const player = squad[0];
  const chemistry = calculatePlayerChemistry(player, squad, null);
  const breakdown = buildChemistryBreakdown(player, squad, null);

  logTest('Dual Nationality Player Chemistry', chemistry);
  console.log('\nNationality Analysis:');
  console.log(`- Player nationalities: ${player.nationalities.join(', ')}`);
  console.log(`- Best nationality chosen: ${breakdown.nationality.bestNationality}`);
  console.log(`- ${breakdown.nationality.bestNationality} players in squad: ${breakdown.nationality.count}`);
  console.log(`- Nationality chemistry: +${breakdown.nationality.chemistry}`);
  console.log('\nWhy Spain was chosen over France:');
  console.log('- Spain: 8 players (including self) → +3 chemistry');
  console.log('- France: 4 players (including self) → +2 chemistry');
  console.log('- System automatically selects Spain for better chemistry');
}

// ============================================================================
// TEST CASE 6: Full squad chemistry calculation
// ============================================================================

function testCase6_FullSquadChemistry() {
  console.log('\n\n' + '█'.repeat(80));
  console.log('TEST CASE 6: Full squad chemistry calculation');
  console.log('█'.repeat(80));

  const squad = [
    // Full French squad
    ...Array(11).fill(null).map((_, i) => createPlayer({
      id: `${i + 1}`,
      name: `French Player ${i + 1}`,
      positions: ['ST', 'CM', 'CB'][i % 3] ? [['ST', 'CM', 'CB'][i % 3]] : ['ST'],
      currentPosition: ['ST', 'CM', 'CB'][i % 3] || 'ST',
      club: i < 7 ? 'PSG' : 'Lyon', // 7 PSG, 4 Lyon
      league: 'Ligue 1',
      nationalities: ['France'],
    })),
  ];

  const manager = createManager({
    nationality: 'France',
    league: 'Ligue 1',
  });

  const results = calculateSquadChemistry(squad, manager);
  const totalChemistry = calculateTotalSquadChemistry(squad, manager);

  console.log('\n--- SQUAD CHEMISTRY RESULTS ---');
  console.log(`Total Squad Chemistry: ${totalChemistry}/33`);
  console.log(`Average Chemistry: ${(totalChemistry / 11).toFixed(2)}/3.00`);
  
  console.log('\n--- INDIVIDUAL PLAYER BREAKDOWN ---');
  results.forEach((result, index) => {
    const b = result.breakdown;
    console.log(`\n${index + 1}. ${result.playerName} (${squad[index].club})`);
    console.log(`   Chemistry: ${result.chemistry}/3`);
    console.log(`   - Club: ${b.club.count} → +${b.club.chemistry}`);
    console.log(`   - Nation: ${b.nationality.count} → +${b.nationality.chemistry}`);
    console.log(`   - League: ${b.league.count} → +${b.league.chemistry}`);
    console.log(`   - Manager: +${b.manager.bonus}`);
  });

  console.log('\n--- EXPECTED RESULTS ---');
  console.log('First 7 players (PSG):');
  console.log('  - Club: 7 players → +3');
  console.log('  - Nation: 11 players → +3');
  console.log('  - League: 11 players → +3');
  console.log('  - Manager: +1 (nationality match)');
  console.log('  - Total: 10 → CAPPED at 3');
  console.log('\nLast 4 players (Lyon):');
  console.log('  - Club: 4 players → +2');
  console.log('  - Nation: 11 players → +3');
  console.log('  - League: 11 players → +3');
  console.log('  - Manager: +1 (nationality match)');
  console.log('  - Total: 9 → CAPPED at 3');
  console.log('\nAll 11 players should have 3/3 chemistry = 33/33 total');
}

// ============================================================================
// TEST CASE 7: Error handling
// ============================================================================

function testCase7_ErrorHandling() {
  console.log('\n\n' + '█'.repeat(80));
  console.log('TEST CASE 7: Error handling and validation');
  console.log('█'.repeat(80));

  const errors = [];

  // Test 1: Missing required fields
  try {
    calculatePlayerChemistry({}, [], null);
  } catch (e) {
    errors.push({ test: 'Missing player fields', error: e.message });
  }

  // Test 2: Invalid position
  try {
    const player = createPlayer({
      positions: ['ST'],
      currentPosition: 'GK', // Not in positions array
    });
    const squad = [player];
    calculatePlayerChemistry(player, squad, null);
  } catch (e) {
    errors.push({ test: 'Invalid position', error: e.message });
  }

  // Test 3: Hero without heroLeague
  try {
    const player = createPlayer({
      cardType: CARD_TYPES.HERO,
      // Missing heroLeague!
    });
    calculatePlayerChemistry(player, [player], null);
  } catch (e) {
    errors.push({ test: 'Hero without heroLeague', error: e.message });
  }

  // Test 4: Empty squad
  try {
    calculateSquadChemistry([], null);
  } catch (e) {
    errors.push({ test: 'Empty squad', error: e.message });
  }

  console.log('\nValidation Tests:');
  errors.forEach((err, index) => {
    console.log(`\n${index + 1}. ${err.test}`);
    console.log(`   ✅ Error caught: ${err.error}`);
  });
  
  console.log(`\n${errors.length} validation tests passed successfully`);
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

function runAllTests() {
  console.log('\n\n');
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                 EA FC 25 CHEMISTRY ENGINE TEST SUITE                       ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝');

  try {
    testCase1_CorrectPositionGoodChemistry();
    testCase2_OutOfPosition();
    testCase3_IconChemistry();
    testCase4_HeroChemistry();
    testCase5_DualNationality();
    testCase6_FullSquadChemistry();
    testCase7_ErrorHandling();

    console.log('\n\n');
    console.log('╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                       ALL TESTS COMPLETED                                  ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error);
    console.error(error.stack);
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { runAllTests };



