/**
 * Chemistry Styles Data
 * All chemistry styles with their stat boosts per chemistry level
 */

export interface ChemistryStyle {
  id: string;
  name: string;
  description: string;
  category: 'pace' | 'shooting' | 'passing' | 'dribbling' | 'defending' | 'physical' | 'balanced';
  boosts: {
    stat: string;
    amount: [number, number, number, number]; // [0 chem, 1 chem, 2 chem, 3 chem]
  }[];
}

export const CHEMISTRY_STYLES: ChemistryStyle[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'No stat boosts',
    category: 'balanced',
    boosts: [],
  },
  {
    id: 'hunter',
    name: 'Hunter',
    description: 'Boosts pace and shooting',
    category: 'pace',
    boosts: [
      { stat: 'acceleration', amount: [0, 1, 2, 3] },
      { stat: 'sprint_speed', amount: [0, 1, 2, 3] },
      { stat: 'positioning', amount: [0, 1, 2, 3] },
      { stat: 'finishing', amount: [0, 1, 2, 3] },
      { stat: 'shot_power', amount: [0, 1, 2, 3] },
    ],
  },
  {
    id: 'shadow',
    name: 'Shadow',
    description: 'Boosts pace and defending',
    category: 'defending',
    boosts: [
      { stat: 'acceleration', amount: [0, 1, 2, 3] },
      { stat: 'sprint_speed', amount: [0, 1, 2, 3] },
      { stat: 'defensive_awareness', amount: [0, 1, 2, 3] },
      { stat: 'standing_tackle', amount: [0, 1, 2, 3] },
      { stat: 'sliding_tackle', amount: [0, 1, 2, 3] },
    ],
  },
  {
    id: 'catalyst',
    name: 'Catalyst',
    description: 'Boosts pace and passing',
    category: 'passing',
    boosts: [
      { stat: 'acceleration', amount: [0, 1, 2, 3] },
      { stat: 'sprint_speed', amount: [0, 1, 2, 3] },
      { stat: 'vision', amount: [0, 1, 2, 3] },
      { stat: 'crossing', amount: [0, 1, 2, 3] },
      { stat: 'short_passing', amount: [0, 1, 2, 3] },
      { stat: 'long_passing', amount: [0, 1, 2, 3] },
    ],
  },
  {
    id: 'engine',
    name: 'Engine',
    description: 'Boosts pace, dribbling, and passing',
    category: 'balanced',
    boosts: [
      { stat: 'acceleration', amount: [0, 1, 1, 2] },
      { stat: 'sprint_speed', amount: [0, 1, 1, 2] },
      { stat: 'agility', amount: [0, 1, 2, 2] },
      { stat: 'balance', amount: [0, 1, 2, 2] },
      { stat: 'ball_control', amount: [0, 1, 2, 2] },
      { stat: 'vision', amount: [0, 1, 1, 2] },
      { stat: 'short_passing', amount: [0, 1, 2, 2] },
    ],
  },
  {
    id: 'anchor',
    name: 'Anchor',
    description: 'Boosts pace, defending, and physical',
    category: 'defending',
    boosts: [
      { stat: 'acceleration', amount: [0, 1, 1, 2] },
      { stat: 'sprint_speed', amount: [0, 1, 1, 2] },
      { stat: 'defensive_awareness', amount: [0, 1, 2, 2] },
      { stat: 'standing_tackle', amount: [0, 1, 2, 2] },
      { stat: 'sliding_tackle', amount: [0, 1, 2, 2] },
      { stat: 'jumping', amount: [0, 1, 1, 2] },
      { stat: 'strength', amount: [0, 1, 2, 2] },
    ],
  },
  {
    id: 'finisher',
    name: 'Finisher',
    description: 'Boosts shooting, dribbling, and physical',
    category: 'shooting',
    boosts: [
      { stat: 'positioning', amount: [0, 1, 2, 2] },
      { stat: 'finishing', amount: [0, 1, 2, 3] },
      { stat: 'shot_power', amount: [0, 1, 2, 2] },
      { stat: 'long_shots', amount: [0, 1, 2, 2] },
      { stat: 'ball_control', amount: [0, 1, 1, 2] },
      { stat: 'dribbling_stat', amount: [0, 1, 1, 2] },
      { stat: 'strength', amount: [0, 1, 2, 2] },
    ],
  },
  {
    id: 'marksman',
    name: 'Marksman',
    description: 'Boosts shooting, dribbling, and physical',
    category: 'shooting',
    boosts: [
      { stat: 'positioning', amount: [0, 1, 1, 2] },
      { stat: 'finishing', amount: [0, 1, 2, 2] },
      { stat: 'shot_power', amount: [0, 1, 2, 2] },
      { stat: 'long_shots', amount: [0, 1, 2, 2] },
      { stat: 'agility', amount: [0, 1, 1, 2] },
      { stat: 'reactions', amount: [0, 1, 2, 2] },
      { stat: 'jumping', amount: [0, 1, 1, 2] },
      { stat: 'strength', amount: [0, 1, 2, 2] },
    ],
  },
  {
    id: 'hawk',
    name: 'Hawk',
    description: 'Boosts pace, shooting, and physical',
    category: 'physical',
    boosts: [
      { stat: 'acceleration', amount: [0, 1, 1, 2] },
      { stat: 'sprint_speed', amount: [0, 1, 1, 2] },
      { stat: 'positioning', amount: [0, 1, 2, 2] },
      { stat: 'finishing', amount: [0, 1, 2, 2] },
      { stat: 'shot_power', amount: [0, 1, 2, 2] },
      { stat: 'jumping', amount: [0, 1, 1, 2] },
      { stat: 'strength', amount: [0, 1, 2, 2] },
    ],
  },
  {
    id: 'artist',
    name: 'Artist',
    description: 'Boosts passing and dribbling',
    category: 'passing',
    boosts: [
      { stat: 'vision', amount: [0, 1, 2, 3] },
      { stat: 'crossing', amount: [0, 1, 2, 3] },
      { stat: 'short_passing', amount: [0, 1, 2, 3] },
      { stat: 'agility', amount: [0, 1, 2, 3] },
      { stat: 'balance', amount: [0, 1, 2, 3] },
      { stat: 'reactions', amount: [0, 1, 2, 3] },
    ],
  },
  {
    id: 'architect',
    name: 'Architect',
    description: 'Boosts passing, dribbling, and physical',
    category: 'physical',
    boosts: [
      { stat: 'vision', amount: [0, 1, 2, 2] },
      { stat: 'crossing', amount: [0, 1, 2, 2] },
      { stat: 'short_passing', amount: [0, 1, 2, 3] },
      { stat: 'long_passing', amount: [0, 1, 2, 2] },
      { stat: 'reactions', amount: [0, 1, 1, 2] },
      { stat: 'ball_control', amount: [0, 1, 1, 2] },
      { stat: 'jumping', amount: [0, 1, 2, 2] },
      { stat: 'strength', amount: [0, 1, 2, 3] },
    ],
  },
  {
    id: 'powerhouse',
    name: 'Powerhouse',
    description: 'Boosts passing, defending, and physical',
    category: 'defending',
    boosts: [
      { stat: 'vision', amount: [0, 1, 2, 2] },
      { stat: 'short_passing', amount: [0, 1, 2, 2] },
      { stat: 'long_passing', amount: [0, 1, 2, 2] },
      { stat: 'defensive_awareness', amount: [0, 1, 2, 3] },
      { stat: 'standing_tackle', amount: [0, 1, 2, 3] },
      { stat: 'stamina', amount: [0, 1, 2, 2] },
      { stat: 'strength', amount: [0, 1, 2, 2] },
    ],
  },
  {
    id: 'maestro',
    name: 'Maestro',
    description: 'Boosts shooting, passing, and dribbling',
    category: 'balanced',
    boosts: [
      { stat: 'positioning', amount: [0, 1, 1, 2] },
      { stat: 'finishing', amount: [0, 1, 1, 2] },
      { stat: 'shot_power', amount: [0, 1, 1, 2] },
      { stat: 'long_shots', amount: [0, 1, 1, 2] },
      { stat: 'vision', amount: [0, 1, 2, 2] },
      { stat: 'short_passing', amount: [0, 1, 2, 2] },
      { stat: 'long_passing', amount: [0, 1, 2, 2] },
      { stat: 'reactions', amount: [0, 1, 1, 2] },
      { stat: 'ball_control', amount: [0, 1, 2, 2] },
    ],
  },
  {
    id: 'sniper',
    name: 'Sniper',
    description: 'Boosts shooting and dribbling',
    category: 'shooting',
    boosts: [
      { stat: 'positioning', amount: [0, 1, 2, 3] },
      { stat: 'finishing', amount: [0, 1, 2, 3] },
      { stat: 'shot_power', amount: [0, 1, 2, 3] },
      { stat: 'long_shots', amount: [0, 1, 2, 3] },
      { stat: 'volleys', amount: [0, 1, 2, 3] },
      { stat: 'agility', amount: [0, 1, 2, 3] },
      { stat: 'reactions', amount: [0, 1, 2, 3] },
      { stat: 'ball_control', amount: [0, 1, 2, 3] },
      { stat: 'dribbling_stat', amount: [0, 1, 2, 3] },
    ],
  },
  {
    id: 'deadeye',
    name: 'Deadeye',
    description: 'Boosts shooting and passing',
    category: 'shooting',
    boosts: [
      { stat: 'positioning', amount: [0, 1, 2, 3] },
      { stat: 'finishing', amount: [0, 1, 2, 3] },
      { stat: 'shot_power', amount: [0, 1, 2, 3] },
      { stat: 'long_shots', amount: [0, 1, 2, 3] },
      { stat: 'vision', amount: [0, 1, 2, 3] },
      { stat: 'crossing', amount: [0, 1, 2, 3] },
      { stat: 'short_passing', amount: [0, 1, 2, 3] },
      { stat: 'long_passing', amount: [0, 1, 2, 3] },
      { stat: 'curve', amount: [0, 1, 2, 3] },
    ],
  },
  {
    id: 'gladiator',
    name: 'Gladiator',
    description: 'Boosts shooting, defending, and physical',
    category: 'physical',
    boosts: [
      { stat: 'positioning', amount: [0, 1, 1, 2] },
      { stat: 'finishing', amount: [0, 1, 2, 2] },
      { stat: 'shot_power', amount: [0, 1, 1, 2] },
      { stat: 'defensive_awareness', amount: [0, 1, 2, 2] },
      { stat: 'standing_tackle', amount: [0, 1, 2, 2] },
      { stat: 'strength', amount: [0, 1, 2, 3] },
      { stat: 'aggression', amount: [0, 1, 2, 2] },
    ],
  },
  {
    id: 'backbone',
    name: 'Backbone',
    description: 'Boosts passing, defending, and physical',
    category: 'defending',
    boosts: [
      { stat: 'vision', amount: [0, 1, 1, 2] },
      { stat: 'short_passing', amount: [0, 1, 1, 2] },
      { stat: 'long_passing', amount: [0, 1, 1, 2] },
      { stat: 'defensive_awareness', amount: [0, 1, 2, 3] },
      { stat: 'standing_tackle', amount: [0, 1, 2, 3] },
      { stat: 'sliding_tackle', amount: [0, 1, 2, 3] },
      { stat: 'jumping', amount: [0, 1, 2, 2] },
      { stat: 'strength', amount: [0, 1, 2, 2] },
    ],
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    description: 'Boosts defending and physical',
    category: 'defending',
    boosts: [
      { stat: 'defensive_awareness', amount: [0, 1, 2, 3] },
      { stat: 'standing_tackle', amount: [0, 1, 2, 3] },
      { stat: 'sliding_tackle', amount: [0, 1, 2, 3] },
      { stat: 'heading_accuracy', amount: [0, 1, 2, 3] },
      { stat: 'jumping', amount: [0, 1, 2, 3] },
      { stat: 'stamina', amount: [0, 1, 2, 3] },
      { stat: 'strength', amount: [0, 1, 2, 3] },
      { stat: 'aggression', amount: [0, 1, 2, 3] },
    ],
  },
  {
    id: 'guardian',
    name: 'Guardian',
    description: 'Boosts dribbling and defending',
    category: 'defending',
    boosts: [
      { stat: 'agility', amount: [0, 1, 2, 3] },
      { stat: 'reactions', amount: [0, 1, 2, 3] },
      { stat: 'ball_control', amount: [0, 1, 2, 3] },
      { stat: 'dribbling_stat', amount: [0, 1, 2, 3] },
      { stat: 'defensive_awareness', amount: [0, 1, 2, 3] },
      { stat: 'standing_tackle', amount: [0, 1, 2, 3] },
      { stat: 'sliding_tackle', amount: [0, 1, 2, 3] },
    ],
  },
  {
    id: 'wall',
    name: 'Wall',
    description: 'Goalkeeper-only: Boosts GK stats',
    category: 'defending',
    boosts: [
      { stat: 'gk_diving', amount: [0, 1, 2, 3] },
      { stat: 'gk_handling', amount: [0, 1, 2, 3] },
      { stat: 'gk_positioning', amount: [0, 1, 2, 3] },
    ],
  },
  {
    id: 'glove',
    name: 'Glove',
    description: 'Goalkeeper-only: Boosts handling and positioning',
    category: 'defending',
    boosts: [
      { stat: 'gk_handling', amount: [0, 1, 2, 3] },
      { stat: 'gk_positioning', amount: [0, 1, 2, 3] },
      { stat: 'gk_reflexes', amount: [0, 1, 2, 3] },
    ],
  },
  {
    id: 'cat',
    name: 'Cat',
    description: 'Goalkeeper-only: All-round GK boost',
    category: 'defending',
    boosts: [
      { stat: 'gk_reflexes', amount: [0, 1, 2, 3] },
      { stat: 'gk_speed', amount: [0, 1, 2, 3] },
      { stat: 'gk_positioning', amount: [0, 1, 2, 3] },
    ],
  },
];

/**
 * Get chemistry style by ID
 */
export function getChemistryStyle(id: string): ChemistryStyle | undefined {
  return CHEMISTRY_STYLES.find((style) => style.id === id);
}

/**
 * Get all chemistry styles for a position
 */
export function getChemistryStylesForPosition(position: string): ChemistryStyle[] {
  if (position === 'GK') {
    return CHEMISTRY_STYLES.filter((style) => 
      ['basic', 'wall', 'glove', 'cat'].includes(style.id)
    );
  }
  
  return CHEMISTRY_STYLES.filter((style) => 
    !['wall', 'glove', 'cat'].includes(style.id)
  );
}

/**
 * Get recommended chemistry styles for a position
 */
export function getRecommendedChemistryStyles(position: string): string[] {
  const recommendations: Record<string, string[]> = {
    'ST': ['hunter', 'hawk', 'engine', 'finisher', 'marksman'],
    'CF': ['engine', 'hunter', 'catalyst', 'finisher'],
    'LW': ['hunter', 'hawk', 'catalyst', 'finisher'],
    'RW': ['hunter', 'hawk', 'catalyst', 'finisher'],
    'CAM': ['engine', 'catalyst', 'hunter', 'maestro'],
    'CM': ['engine', 'catalyst', 'powerhouse', 'architect'],
    'CDM': ['shadow', 'anchor', 'powerhouse', 'catalyst'],
    'LB': ['shadow', 'anchor', 'catalyst', 'sentinel'],
    'RB': ['shadow', 'anchor', 'catalyst', 'sentinel'],
    'CB': ['shadow', 'anchor', 'sentinel', 'backbone'],
    'LWB': ['shadow', 'anchor', 'catalyst'],
    'RWB': ['shadow', 'anchor', 'catalyst'],
    'GK': ['cat', 'glove', 'wall'],
  };

  return recommendations[position] || ['basic', 'engine', 'shadow', 'hunter'];
}

