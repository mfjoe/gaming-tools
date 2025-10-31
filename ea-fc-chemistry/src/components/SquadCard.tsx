import React, { useState } from 'react';
import { SavedSquad } from '../services/squadStorage';

interface SquadCardProps {
  squad: SavedSquad;
  onLoad: (squad: SavedSquad) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (squad: SavedSquad) => void;
  onToggleFavorite: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export const SquadCard: React.FC<SquadCardProps> = ({
  squad,
  onLoad,
  onDuplicate,
  onDelete,
  onShare,
  onToggleFavorite,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(squad.name);
  const [showActions, setShowActions] = useState(false);

  const rating = Math.floor(
    squad.squad.players.filter((p) => p).reduce((sum, p) => sum + (p?.overall_rating || 0), 0) /
      squad.squad.players.filter((p) => p).length
  );
  const chemistry = squad.squad.totalChemistry || 0;
  const playerCount = squad.squad.players.filter((p) => p).length;

  const handleRename = () => {
    if (editName.trim() && editName !== squad.name) {
      onRename(squad.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Delete squad "${squad.name}"?`)) {
      onDelete(squad.id);
    }
  };

  return (
    <div
      className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Favorite Button */}
      <button
        onClick={() => onToggleFavorite(squad.id)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:scale-110 transition-transform"
        title={squad.isFavorite ? 'Unfavorite' : 'Favorite'}
      >
        <svg
          className={`w-5 h-5 ${
            squad.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </button>

      {/* Thumbnail/Preview */}
      <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
        {squad.thumbnail ? (
          <img src={squad.thumbnail} alt={squad.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <svg className="w-16 h-16 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm mt-2 font-semibold">{squad.squad.formation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyPress={(e) => e.key === 'Enter' && handleRename()}
              autoFocus
              className="flex-1 px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        ) : (
          <h3
            className="font-semibold text-lg text-gray-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setIsEditing(true)}
            title={squad.name}
          >
            {squad.name}
          </h3>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="font-semibold text-gray-900 dark:text-white">{rating}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="font-semibold text-gray-900 dark:text-white">{chemistry}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Chemistry</div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="font-semibold text-gray-900 dark:text-white">{playerCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Players</div>
          </div>
        </div>

        {/* Formation & Date */}
        <div className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
          <span>{squad.squad.formation}</span>
          <span>{new Date(squad.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div
          className={`flex gap-2 transition-opacity ${
            showActions ? 'opacity-100' : 'opacity-0 md:opacity-100'
          }`}
        >
          <button
            onClick={() => onLoad(squad)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            Load
          </button>
          <button
            onClick={() => onShare(squad)}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Share"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button
            onClick={() => onDuplicate(squad.id)}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Duplicate"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

