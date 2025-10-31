import React, { useState } from 'react';
import { PlayerSearchModal } from '../components/PlayerSearchModal';
import { Player } from '../types/player';
import { mockPlayers } from '../data/mockPlayers';

/**
 * Example integration of PlayerSearchModal with a SquadBuilder component
 */
export const PlayerSearchExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentPosition, setCurrentPosition] = useState<string | null>('ST');

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    console.log('Selected player:', player);
    // In a real app, this would update the squad builder state
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Squad Builder Example</h2>
      
      {/* Player Slot Component (simplified) */}
      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
        {selectedPlayer ? (
          <div className="text-center">
            <div className="font-semibold">{selectedPlayer.common_name || selectedPlayer.last_name}</div>
            <div className="text-sm text-gray-600">{selectedPlayer.overall_rating}</div>
          </div>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-gray-400 hover:text-blue-600"
          >
            Add Player
          </button>
        )}
      </div>

      {/* Player Search Modal */}
      <PlayerSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectPlayer={handleSelectPlayer}
        currentPosition={currentPosition}
        players={mockPlayers}
      />
    </div>
  );
};

/**
 * Alternative: Player Slot Component that can be reused
 */
interface PlayerSlotProps {
  position: string;
  player: Player | null;
  onSelectPlayer: () => void;
  onRemovePlayer?: () => void;
}

export const PlayerSlot: React.FC<PlayerSlotProps> = ({
  position,
  player,
  onSelectPlayer,
  onRemovePlayer,
}) => {
  return (
    <div
      onClick={onSelectPlayer}
      className="relative w-24 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {player ? (
        <>
          <img
            src={player.face_image_url}
            alt={player.common_name || player.last_name}
            className="w-16 h-16 object-cover rounded mb-1"
          />
          <div className="text-xs font-semibold text-center px-1 truncate w-full">
            {player.common_name || player.last_name}
          </div>
          <div className="text-xs text-gray-600">{player.overall_rating}</div>
          {onRemovePlayer && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemovePlayer();
              }}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
            >
              ×
            </button>
          )}
        </>
      ) : (
        <div className="text-gray-400 text-center text-xs">
          <div className="mb-1">{position}</div>
          <div>Click to add</div>
        </div>
      )}
    </div>
  );
};


