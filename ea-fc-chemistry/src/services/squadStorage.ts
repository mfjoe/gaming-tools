/**
 * Squad Storage Service
 * Handles localStorage persistence for saved squads
 */

import { Squad } from '../types/player';

const STORAGE_KEY = 'eafc-saved-squads';
const MAX_SQUADS = 50; // Prevent localStorage from getting too large

export interface SavedSquad {
  id: string;
  name: string;
  squad: Squad;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  thumbnail?: string; // Base64 thumbnail image
}

/**
 * Generate unique ID
 */
function generateUniqueId(): string {
  return `squad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all saved squads from localStorage
 */
export function getSavedSquads(): SavedSquad[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((squad: any) => ({
      ...squad,
      createdAt: new Date(squad.createdAt),
      updatedAt: new Date(squad.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading saved squads:', error);
    return [];
  }
}

/**
 * Save squads to localStorage
 */
function saveSquadsToStorage(squads: SavedSquad[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(squads));
  } catch (error) {
    console.error('Error saving squads:', error);
    // Check if localStorage is full
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some squads.');
    }
    throw error;
  }
}

/**
 * Save a new squad
 */
export function saveSquad(squad: Squad, name: string, thumbnail?: string): string {
  const existing = getSavedSquads();

  // Check limit
  if (existing.length >= MAX_SQUADS) {
    throw new Error(`Maximum of ${MAX_SQUADS} squads allowed. Please delete some squads.`);
  }

  const id = generateUniqueId();
  const savedSquad: SavedSquad = {
    id,
    name: name || 'Untitled Squad',
    squad,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFavorite: false,
    thumbnail,
  };

  existing.push(savedSquad);
  saveSquadsToStorage(existing);

  return id;
}

/**
 * Load squad by ID
 */
export function loadSquad(id: string): SavedSquad | null {
  const squads = getSavedSquads();
  return squads.find((s) => s.id === id) || null;
}

/**
 * Update existing squad
 */
export function updateSquad(id: string, updates: Partial<SavedSquad>): void {
  const squads = getSavedSquads();
  const index = squads.findIndex((s) => s.id === id);

  if (index === -1) {
    throw new Error('Squad not found');
  }

  squads[index] = {
    ...squads[index],
    ...updates,
    updatedAt: new Date(),
  };

  saveSquadsToStorage(squads);
}

/**
 * Delete squad
 */
export function deleteSquad(id: string): void {
  const squads = getSavedSquads();
  const filtered = squads.filter((s) => s.id !== id);

  if (filtered.length === squads.length) {
    throw new Error('Squad not found');
  }

  saveSquadsToStorage(filtered);
}

/**
 * Toggle favorite status
 */
export function toggleFavorite(id: string): void {
  const squads = getSavedSquads();
  const squad = squads.find((s) => s.id === id);

  if (!squad) {
    throw new Error('Squad not found');
  }

  squad.isFavorite = !squad.isFavorite;
  squad.updatedAt = new Date();

  saveSquadsToStorage(squads);
}

/**
 * Duplicate squad
 */
export function duplicateSquad(id: string): string {
  const original = loadSquad(id);
  if (!original) {
    throw new Error('Squad not found');
  }

  return saveSquad(
    original.squad,
    `${original.name} (Copy)`,
    original.thumbnail
  );
}

/**
 * Rename squad
 */
export function renameSquad(id: string, newName: string): void {
  updateSquad(id, { name: newName });
}

/**
 * Export all squads as JSON
 */
export function exportSquads(): string {
  const squads = getSavedSquads();
  return JSON.stringify(squads, null, 2);
}

/**
 * Import squads from JSON
 */
export function importSquads(json: string, replace: boolean = false): number {
  try {
    const imported = JSON.parse(json) as SavedSquad[];

    if (!Array.isArray(imported)) {
      throw new Error('Invalid format: expected array of squads');
    }

    // Validate each squad
    imported.forEach((squad, idx) => {
      if (!squad.id || !squad.name || !squad.squad) {
        throw new Error(`Invalid squad at index ${idx}`);
      }
    });

    let existing = replace ? [] : getSavedSquads();
    
    // Regenerate IDs to avoid conflicts
    const importedWithNewIds = imported.map((squad) => ({
      ...squad,
      id: generateUniqueId(),
      createdAt: new Date(squad.createdAt),
      updatedAt: new Date(),
    }));

    existing.push(...importedWithNewIds);

    // Enforce limit
    if (existing.length > MAX_SQUADS) {
      existing = existing.slice(-MAX_SQUADS);
    }

    saveSquadsToStorage(existing);

    return importedWithNewIds.length;
  } catch (error) {
    console.error('Error importing squads:', error);
    throw new Error('Failed to import squads. Please check the file format.');
  }
}

/**
 * Clear all saved squads
 */
export function clearAllSquads(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get storage info
 */
export function getStorageInfo(): {
  count: number;
  maxCount: number;
  usage: number; // Approximate size in KB
} {
  const squads = getSavedSquads();
  const stored = localStorage.getItem(STORAGE_KEY) || '';
  const sizeInBytes = new Blob([stored]).size;
  const sizeInKB = Math.round(sizeInBytes / 1024);

  return {
    count: squads.length,
    maxCount: MAX_SQUADS,
    usage: sizeInKB,
  };
}

/**
 * Search squads by name
 */
export function searchSquads(query: string): SavedSquad[] {
  const squads = getSavedSquads();
  const lowerQuery = query.toLowerCase();

  return squads.filter((squad) =>
    squad.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Sort squads
 */
export function sortSquads(
  squads: SavedSquad[],
  sortBy: 'recent' | 'name' | 'rating' | 'chemistry' | 'favorites'
): SavedSquad[] {
  const sorted = [...squads];

  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'rating':
      return sorted.sort((a, b) => {
        const ratingA = calculateSquadRating(a.squad);
        const ratingB = calculateSquadRating(b.squad);
        return ratingB - ratingA;
      });

    case 'chemistry':
      return sorted.sort((a, b) => {
        const chemA = a.squad.totalChemistry || 0;
        const chemB = b.squad.totalChemistry || 0;
        return chemB - chemA;
      });

    case 'favorites':
      return sorted.sort((a, b) => {
        if (a.isFavorite === b.isFavorite) {
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        }
        return a.isFavorite ? -1 : 1;
      });

    default:
      return sorted;
  }
}

/**
 * Helper: Calculate squad rating
 */
function calculateSquadRating(squad: Squad): number {
  const players = squad.players.filter((p) => p !== null);
  if (players.length === 0) return 0;

  const totalRating = players.reduce((sum, p) => sum + (p?.overall_rating || 0), 0);
  return Math.floor(totalRating / players.length);
}

