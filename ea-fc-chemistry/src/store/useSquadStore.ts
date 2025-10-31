import { create } from 'zustand';
import { Player } from '../types/player';

interface Manager {
  nationality: string;
  league: string;
}

interface SquadState {
  currentFormation: string;
  players: (Player | null)[];
  substitutes: (Player | null)[];
  manager: Manager | null;
  totalChemistry: number;
  totalCost: number;
  totalRating: number;
}

interface SquadActions {
  setFormation: (formationId: string) => void;
  addPlayer: (slot: number, player: Player) => void;
  removePlayer: (slot: number) => void;
  swapPlayers: (slot1: number, slot2: number) => void;
  setManager: (manager: Manager) => void;
  clearSquad: () => void;
  calculateStats: () => void;
}

const initialState: SquadState = {
  currentFormation: '4-3-3',
  players: Array(11).fill(null),
  substitutes: Array(7).fill(null),
  manager: null,
  totalChemistry: 0,
  totalCost: 0,
  totalRating: 0,
};

export const useSquadStore = create<SquadState & SquadActions>((set, get) => ({
  ...initialState,

  setFormation: (formationId: string) => {
    set({ currentFormation: formationId });
    get().calculateStats();
  },

  addPlayer: (slot: number, player: Player) => {
    const players = [...get().players];
    players[slot] = player;
    set({ players });
    get().calculateStats();
  },

  removePlayer: (slot: number) => {
    const players = [...get().players];
    players[slot] = null;
    set({ players });
    get().calculateStats();
  },

  swapPlayers: (slot1: number, slot2: number) => {
    const players = [...get().players];
    [players[slot1], players[slot2]] = [players[slot2], players[slot1]];
    set({ players });
    get().calculateStats();
  },

  setManager: (manager: Manager) => {
    set({ manager });
    get().calculateStats();
  },

  clearSquad: () => {
    set({
      ...initialState,
      currentFormation: get().currentFormation, // Keep formation
    });
  },

  calculateStats: () => {
    const { players } = get();
    
    // Calculate total rating
    const filledPlayers = players.filter((p): p is Player => p !== null);
    const totalRating = filledPlayers.length > 0
      ? Math.round(filledPlayers.reduce((sum, p) => sum + p.overall_rating, 0) / filledPlayers.length)
      : 0;

    // Calculate total cost
    const totalCost = filledPlayers.reduce((sum, p) => sum + (p.price_ps || 0), 0);

    // Chemistry calculation - simplified for now
    // TODO: Use chemistryEngine.js for accurate calculation
    const totalChemistry = filledPlayers.length * 3; // Placeholder: assume max chemistry

    set({
      totalRating,
      totalCost,
      totalChemistry,
    });
  },
}));

