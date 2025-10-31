import React, { useState, useMemo } from 'react';
import { ClubPlayer } from '../types/sbc';
import { Player } from '../types/player';

interface ClubInventoryProps {
  players: Player[];
  onUpdate: (updatedPlayers: ClubPlayer[]) => void;
}

export const ClubInventory: React.FC<ClubInventoryProps> = ({ players, onUpdate }) => {
  const [clubPlayers, setClubPlayers] = useState<ClubPlayer[]>(() => {
    return players.map((p) => ({
      ...p,
      isUntradeable: false,
      isDuplicate: false,
      sbcValue: calculateSBCValue(p),
      recommendedUse: 'keep' as const,
      quantity: 1,
    }));
  });

  const updatePlayer = (id: string, updates: Partial<ClubPlayer>) => {
    const updated = clubPlayers.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    setClubPlayers(updated);
    onUpdate(updated);
  };

  const sorted = useMemo(() => {
    return [...clubPlayers].sort((a, b) => {
      // Untradeables first
      if (a.isUntradeable && !b.isUntradeable) return -1;
      if (!a.isUntradeable && b.isUntradeable) return 1;
      // Then by SBC value
      return b.sbcValue - a.sbcValue;
    });
  }, [clubPlayers]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Club Inventory</h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sorted.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-4 p-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {player.common_name || `${player.first_name} ${player.last_name}`}
                </span>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                  {player.overall_rating}
                </span>
                {player.isUntradeable && (
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs">
                    Untradeable
                  </span>
                )}
                {player.isDuplicate && (
                  <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                    Duplicate
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                SBC Value: {player.sbcValue.toFixed(2)}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={player.isUntradeable}
                  onChange={(e) =>
                    updatePlayer(player.id, { isUntradeable: e.target.checked })
                  }
                />
                Untradeable
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={player.isDuplicate}
                  onChange={(e) =>
                    updatePlayer(player.id, { isDuplicate: e.target.checked })
                  }
                />
                Duplicate
              </label>
              <input
                type="number"
                min="1"
                value={player.quantity}
                onChange={(e) =>
                  updatePlayer(player.id, { quantity: parseInt(e.target.value) || 1 })
                }
                className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Tip:</strong> Mark untradeable and duplicate cards to prioritize them in SBC solutions.
          Higher SBC value means better rating-to-price ratio for SBCs.
        </p>
      </div>
    </div>
  );
};

function calculateSBCValue(player: Player): number {
  const price = player.price_ps || player.price_xbox || player.price_pc || 1000;
  // SBC value = rating / price ratio (higher is better)
  return player.overall_rating / Math.max(price, 100);
}


