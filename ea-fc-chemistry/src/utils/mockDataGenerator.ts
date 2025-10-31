/**
 * Mock Data Generator for Testing
 * Generates realistic EA FC 25 player data
 */

import { Player } from '../types/player';

const FIRST_NAMES = [
  'Kylian', 'Erling', 'Cristiano', 'Lionel', 'Karim', 'Mohamed', 'Kevin',
  'Virgil', 'Sadio', 'Raheem', 'Paul', 'N\'Golo', 'Joshua', 'Trent',
  'Son', 'Heung-min', 'Bukayo', 'Phil', 'Jude', 'Jamal', 'Pedri',
  'Gavi', 'Vinicius', 'Rodrygo', 'Federico', 'Rafael', 'Alessandro',
];

const LAST_NAMES = [
  'Mbappé', 'Haaland', 'Ronaldo', 'Messi', 'Benzema', 'Salah', 'De Bruyne',
  'van Dijk', 'Mané', 'Sterling', 'Pogba', 'Kanté', 'Kimmich', 'Alexander-Arnold',
  'Kane', 'Saka', 'Foden', 'Bellingham', 'Musiala', 'Gavi', 'Júnior',
  'Valverde', 'Bastoni', 'Leão', 'Tchouaméni', 'Camavinga', 'Rodrigo',
];

const COMMON_NAMES = [
  'Mbappé', 'Haaland', 'CR7', 'Messi', 'Benzema', 'Salah', 'KDB',
  'Van Dijk', 'Mané', 'Sterling', 'Pogba', 'Kanté', 'Kimmich', 'TAA',
  'Kane', 'Saka', 'Foden', 'Bellingham', 'Musiala', null, null, null,
];

const CLUBS = [
  { id: 'mancity', name: 'Manchester City', logo_url: 'https://logos.com/mancity.svg' },
  { id: 'realmadrid', name: 'Real Madrid', logo_url: 'https://logos.com/realmadrid.svg' },
  { id: 'psg', name: 'Paris Saint-Germain', logo_url: 'https://logos.com/psg.svg' },
  { id: 'liverpool', name: 'Liverpool', logo_url: 'https://logos.com/liverpool.svg' },
  { id: 'barcelona', name: 'Barcelona', logo_url: 'https://logos.com/barcelona.svg' },
  { id: 'bayern', name: 'Bayern Munich', logo_url: 'https://logos.com/bayern.svg' },
  { id: 'chelsea', name: 'Chelsea', logo_url: 'https://logos.com/chelsea.svg' },
  { id: 'arsenal', name: 'Arsenal', logo_url: 'https://logos.com/arsenal.svg' },
];

const LEAGUES = [
  { id: 'prem', name: 'Premier League', logo_url: 'https://logos.com/premier-league.svg' },
  { id: 'laliga', name: 'La Liga', logo_url: 'https://logos.com/la-liga.svg' },
  { id: 'bundesliga', name: 'Bundesliga', logo_url: 'https://logos.com/bundesliga.svg' },
  { id: 'seriea', name: 'Serie A', logo_url: 'https://logos.com/serie-a.svg' },
  { id: 'ligue1', name: 'Ligue 1', logo_url: 'https://logos.com/ligue-1.svg' },
];

const NATIONALITIES = [
  { id: 'fr', name: 'France', flag_url: 'https://flags.com/france.svg' },
  { id: 'br', name: 'Brazil', flag_url: 'https://flags.com/brazil.svg' },
  { id: 'ar', name: 'Argentina', flag_url: 'https://flags.com/argentina.svg' },
  { id: 'pt', name: 'Portugal', flag_url: 'https://flags.com/portugal.svg' },
  { id: 'eng', name: 'England', flag_url: 'https://flags.com/england.svg' },
  { id: 'es', name: 'Spain', flag_url: 'https://flags.com/spain.svg' },
  { id: 'de', name: 'Germany', flag_url: 'https://flags.com/germany.svg' },
  { id: 'it', name: 'Italy', flag_url: 'https://flags.com/italy.svg' },
];

const POSITIONS = ['GK', 'LB', 'CB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'];
const CARD_TYPES: Player['card_type'][] = ['base', 'rare', 'icon', 'hero', 'totw', 'toty', 'promo'];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

function generateRating(): number {
  const rand = Math.random();
  if (rand < 0.01) return randomInt(90, 99); // Top players
  if (rand < 0.05) return randomInt(85, 89); // High rated
  if (rand < 0.20) return randomInt(80, 84); // Good players
  if (rand < 0.50) return randomInt(75, 79); // Average
  return randomInt(65, 74); // Lower rated
}

function generatePrice(rating: number): number {
  if (rating >= 90) return randomInt(500000, 5000000);
  if (rating >= 85) return randomInt(50000, 500000);
  if (rating >= 80) return randomInt(5000, 50000);
  if (rating >= 75) return randomInt(500, 5000);
  return randomInt(100, 500);
}

export function generateMockPlayers(count: number): Player[] {
  const players: Player[] = [];

  for (let i = 0; i < count; i++) {
    const rating = generateRating();
    const firstName = randomChoice(FIRST_NAMES);
    const lastName = randomChoice(LAST_NAMES);
    const commonName = Math.random() < 0.3 ? randomChoice(COMMON_NAMES) : null;
    const club = randomChoice(CLUBS);
    const league = randomChoice(LEAGUES);
    const nationality = randomChoice(NATIONALITIES);
    const position = randomChoice(POSITIONS);
    const cardType = rating >= 90 && Math.random() < 0.1 
      ? randomChoice(['icon', 'hero'] as const)
      : rating >= 87 && Math.random() < 0.05
      ? 'totw'
      : 'base';

    const pace = position === 'GK' ? randomInt(30, 50) : randomInt(40, 99);
    const shooting = position === 'GK' || position.includes('D') ? randomInt(20, 50) : randomInt(50, 99);
    const passing = randomInt(40, 99);
    const dribbling = position === 'GK' || position.includes('D') ? randomInt(30, 70) : randomInt(50, 99);
    const defending = position.includes('D') || position === 'CDM' ? randomInt(60, 99) : randomInt(20, 60);
    const physical = randomInt(50, 99);

    const player: Player = {
      id: `player-${i}`,
      asset_id: 200000 + i,
      first_name: firstName,
      last_name: lastName,
      common_name: commonName,
      overall_rating: rating,
      card_type: cardType,
      version: cardType === 'base' ? 'Base' : cardType.toUpperCase(),
      club: { ...club },
      league: { ...league },
      primary_nationality: { ...nationality },
      primary_position: position,
      alternative_positions: position === 'ST' ? ['CF'] : position === 'CM' ? ['CAM', 'CDM'] : [],
      pace,
      shooting,
      passing,
      dribbling,
      defending,
      physical,
      price_ps: generatePrice(rating),
      price_xbox: generatePrice(rating) * (0.95 + Math.random() * 0.1),
      price_pc: generatePrice(rating) * (0.9 + Math.random() * 0.15),
      work_rate_attack: randomChoice(['High', 'Medium', 'Low']),
      work_rate_defense: randomChoice(['High', 'Medium', 'Low']),
      weak_foot: randomInt(2, 5),
      skill_moves: position === 'GK' || position.includes('D') ? randomInt(2, 3) : randomInt(3, 5),
      preferred_foot: randomChoice(['Left', 'Right']),
      body_type: randomChoice(['Lean', 'Normal', 'Stocky', null]),
      accelerate_type: randomChoice(['Controlled', 'Explosive', 'Lengthy']),
      face_image_url: `https://fifa.com/players/${200000 + i}.jpg`,
    };

    players.push(player);
  }

  return players;
}

export async function seedMockData(playerCount: number = 1000): Promise<void> {
  const { playerDB } = await import('../db/playerDatabase');
  const players = generateMockPlayers(playerCount);

  await playerDB.savePlayers(players);
  await playerDB.updateCacheInfo({
    lastUpdated: new Date(),
    playerCount: players.length,
    dataVersion: new Date().toISOString().split('T')[0],
    schemaVersion: '1.0.0',
    source: 'bundled',
  });
}

export async function resetDatabase(): Promise<void> {
  const { playerDB } = await import('../db/playerDatabase');
  await playerDB.clearAllData();
}


