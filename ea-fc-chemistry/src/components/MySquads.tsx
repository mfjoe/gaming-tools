import React, { useState } from 'react';
import { Squad } from '../types/player';
import { useSavedSquads } from '../hooks/useSavedSquads';
import { SquadCard } from './SquadCard';
import { ShareSquadModal } from './ShareSquadModal';
import { SavedSquad } from '../services/squadStorage';

interface MySquadsProps {
  onLoadSquad: (squad: Squad) => void;
}

export const MySquads: React.FC<MySquadsProps> = ({ onLoadSquad }) => {
  const {
    squads,
    isLoading,
    error,
    storageInfo,
    remove,
    duplicate,
    favorite,
    rename,
    sort,
    search,
    exportAll,
    importAll,
  } = useSavedSquads();

  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'rating' | 'chemistry' | 'favorites'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [shareSquad, setShareSquad] = useState<SavedSquad | null>(null);

  const handleSort = (newSort: typeof sortBy) => {
    setSortBy(newSort);
    sort(newSort);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    search(query);
  };

  const handleExport = () => {
    try {
      const json = exportAll();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `eafc-squads-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export squads');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: any) => {
      try {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        const count = importAll(text, false);
        alert(`Successfully imported ${count} squad(s)`);
      } catch (err: any) {
        alert(`Failed to import: ${err.message}`);
      }
    };
    input.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading squads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Squads</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {storageInfo.count} of {storageInfo.maxCount} squads ({storageInfo.usage}KB used)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            📤 Export
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            📥 Import
          </button>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search squads..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value as typeof sortBy)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="recent">Most Recent</option>
          <option value="name">Name (A-Z)</option>
          <option value="rating">Highest Rating</option>
          <option value="chemistry">Best Chemistry</option>
          <option value="favorites">Favorites First</option>
        </select>
      </div>

      {/* Squads Grid */}
      {squads.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-700 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No squads yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Build your first squad and save it to see it here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {squads.map((squad) => (
            <SquadCard
              key={squad.id}
              squad={squad}
              onLoad={(s) => onLoadSquad(s.squad)}
              onDuplicate={duplicate}
              onDelete={remove}
              onShare={setShareSquad}
              onToggleFavorite={favorite}
              onRename={rename}
            />
          ))}
        </div>
      )}

      {/* Share Modal */}
      {shareSquad && (
        <ShareSquadModal
          squad={shareSquad.squad}
          isOpen={true}
          onClose={() => setShareSquad(null)}
        />
      )}
    </div>
  );
};

