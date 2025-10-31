import React from 'react';
import { Player } from '../types/player';
import PlayerCard from './PlayerCard';

interface Position {
  x: number;
  y: number;
  position: string;
}

interface PitchViewProps {
  formation: string;
  players: (Player | null)[];
  onSlotClick: (slot: number) => void;
  onPlayerRemove: (slot: number) => void;
}

// Formation position coordinates (percentage-based)
const FORMATION_POSITIONS: Record<string, Position[]> = {
  '4-3-3': [
    { x: 50, y: 90, position: 'GK' },
    { x: 15, y: 70, position: 'LB' },
    { x: 35, y: 75, position: 'CB' },
    { x: 65, y: 75, position: 'CB' },
    { x: 85, y: 70, position: 'RB' },
    { x: 30, y: 50, position: 'CM' },
    { x: 50, y: 50, position: 'CM' },
    { x: 70, y: 50, position: 'CM' },
    { x: 15, y: 20, position: 'LW' },
    { x: 50, y: 15, position: 'ST' },
    { x: 85, y: 20, position: 'RW' },
  ],
  '4-4-2': [
    { x: 50, y: 90, position: 'GK' },
    { x: 15, y: 70, position: 'LB' },
    { x: 35, y: 75, position: 'CB' },
    { x: 65, y: 75, position: 'CB' },
    { x: 85, y: 70, position: 'RB' },
    { x: 15, y: 45, position: 'LM' },
    { x: 40, y: 50, position: 'CM' },
    { x: 60, y: 50, position: 'CM' },
    { x: 85, y: 45, position: 'RM' },
    { x: 35, y: 15, position: 'ST' },
    { x: 65, y: 15, position: 'ST' },
  ],
  '4-2-3-1': [
    { x: 50, y: 90, position: 'GK' },
    { x: 15, y: 70, position: 'LB' },
    { x: 35, y: 75, position: 'CB' },
    { x: 65, y: 75, position: 'CB' },
    { x: 85, y: 70, position: 'RB' },
    { x: 35, y: 55, position: 'CDM' },
    { x: 65, y: 55, position: 'CDM' },
    { x: 15, y: 30, position: 'LM' },
    { x: 50, y: 30, position: 'CAM' },
    { x: 85, y: 30, position: 'RM' },
    { x: 50, y: 10, position: 'ST' },
  ],
};

const PlayerSlot: React.FC<{
  position: string;
  player: Player | null;
  onClick: () => void;
  onRemove: () => void;
  chemistry: number;
  slot: number;
}> = ({ position, player, onClick, onRemove, chemistry, slot }) => {
  if (player) {
    return (
      <div className="relative group">
        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold z-20 hover:bg-red-600 shadow-lg"
        >
          ×
        </button>

        {/* Player Card */}
        <div onClick={onClick}>
          <PlayerCard player={player} chemistry={chemistry} slot={slot} />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="w-24 h-32 border-2 border-dashed border-white/40 rounded-lg cursor-pointer hover:border-white/80 hover:bg-white/10 transition-all flex flex-col items-center justify-center text-white/70 hover:text-white backdrop-blur-sm"
    >
      <div className="text-2xl font-bold drop-shadow-lg">{position}</div>
      <div className="text-xs mt-2 font-semibold drop-shadow-md">Click to add</div>
    </div>
  );
};

export const PitchView: React.FC<PitchViewProps> = ({
  formation,
  players,
  onSlotClick,
  onPlayerRemove,
}) => {
  const positions = FORMATION_POSITIONS[formation] || FORMATION_POSITIONS['4-3-3'];

  return (
    <div className="relative w-full aspect-[2/3] md:aspect-[3/4] max-w-2xl mx-auto">
      {/* Pitch Background */}
      <div className="absolute inset-0 bg-pitch-radial rounded-2xl overflow-hidden shadow-2xl">
        {/* Pitch Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Center circle */}
          <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="0.5" fill="white" />

          {/* Center line */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.5" />

          {/* Penalty boxes */}
          <rect
            x="25"
            y="0"
            width="50"
            height="18"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
          <rect
            x="25"
            y="82"
            width="50"
            height="18"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />

          {/* Goal boxes */}
          <rect
            x="37.5"
            y="0"
            width="25"
            height="8"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
          <rect
            x="37.5"
            y="92"
            width="25"
            height="8"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />

          {/* Penalty spots */}
          <circle cx="50" cy="12" r="0.5" fill="white" />
          <circle cx="50" cy="88" r="0.5" fill="white" />

          {/* Corner arcs */}
          <path d="M 0,0 Q 3,0 3,3" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M 100,0 Q 97,0 97,3" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M 0,100 Q 3,100 3,97" fill="none" stroke="white" strokeWidth="0.5" />
          <path
            d="M 100,100 Q 97,100 97,97"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </svg>

        {/* Grass texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 8%,
              rgba(0,0,0,0.1) 8%,
              rgba(0,0,0,0.1) 16%
            )`,
          }}
        />

        {/* Player Slots */}
        <div className="relative w-full h-full p-4">
          {positions.map((pos, idx) => (
            <div
              key={idx}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <PlayerSlot
                position={pos.position}
                player={players[idx]}
                chemistry={players[idx] ? 3 : 0}
                slot={idx}
                onClick={() => onSlotClick(idx)}
                onRemove={() => onPlayerRemove(idx)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Formation Label */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <div className="px-4 py-1 bg-white rounded-full shadow-lg border-2 border-ea-blue-500">
          <span className="text-sm font-bold text-ea-blue-600">{formation}</span>
        </div>
      </div>
    </div>
  );
};

export default PitchView;

