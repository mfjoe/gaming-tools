import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Player } from '../types/player';

interface PlayerCardProps {
  player: Player;
  chemistry?: number;
  slot?: number;
}

export default function PlayerCard({ player, chemistry = 0, slot }: PlayerCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `player-${player.id}-${slot}`,
    data: { player, slot },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // Determine card rarity gradient
  const getCardGradient = () => {
    if (player.card_type === 'icon') return 'from-fut-icon via-pink-500 to-fut-icon';
    if (player.card_type === 'hero') return 'from-fut-hero via-purple-500 to-fut-hero';
    if (player.card_type === 'totw') return 'from-gray-900 via-gray-800 to-black';
    if (player.card_type === 'rare') return 'from-fut-gold via-yellow-400 to-fut-gold';
    return 'from-gray-400 via-gray-300 to-gray-400'; // Common
  };

  // Chemistry color
  const getChemistryColor = () => {
    if (chemistry === 3) return 'bg-chem-perfect text-white';
    if (chemistry === 2) return 'bg-chem-good text-gray-900';
    if (chemistry === 1) return 'bg-chem-okay text-white';
    return 'bg-chem-bad text-white';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative w-24 h-32 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:scale-105 hover:shadow-card-hover
        ${isDragging ? 'opacity-50 scale-95' : 'shadow-card'}
      `}
    >
      {/* Card Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient()}`} />

      {/* Card Border/Frame */}
      <div className="absolute inset-0 border-2 border-white/30 rounded-lg" />

      {/* Card Content */}
      <div className="relative h-full p-2 flex flex-col text-white">
        {/* Top Section: Rating & Position */}
        <div className="flex items-start justify-between mb-1">
          <div className="text-center">
            <div className="text-2xl font-bold leading-none drop-shadow-lg">
              {player.overall_rating}
            </div>
            <div className="text-xs font-bold leading-none drop-shadow-md">
              {player.primary_position}
            </div>
          </div>

          {/* Chemistry Badge */}
          {chemistry !== undefined && (
            <div
              className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${getChemistryColor()} shadow-lg
            `}
            >
              {chemistry}
            </div>
          )}
        </div>

        {/* Player Image Placeholder */}
        <div className="flex-1 flex items-center justify-center mb-1">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
        </div>

        {/* Player Name */}
        <div className="text-center mb-1">
          <div className="text-xs font-bold truncate drop-shadow-lg">
            {player.common_name || player.last_name}
          </div>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-1 text-[10px] text-center">
          <div>
            <div className="font-bold">{player.pace}</div>
            <div className="text-white/70">PAC</div>
          </div>
          <div>
            <div className="font-bold">{player.shooting}</div>
            <div className="text-white/70">SHO</div>
          </div>
          <div>
            <div className="font-bold">{player.passing}</div>
            <div className="text-white/70">PAS</div>
          </div>
        </div>

        {/* Bottom Icons */}
        <div className="flex justify-center gap-2 mt-1">
          <div
            className="w-4 h-4 rounded-sm bg-white/20 backdrop-blur-sm"
            title="Club"
          />
          <div
            className="w-4 h-4 rounded-sm bg-white/20 backdrop-blur-sm"
            title="Nation"
          />
          <div
            className="w-4 h-4 rounded-sm bg-white/20 backdrop-blur-sm"
            title="League"
          />
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

