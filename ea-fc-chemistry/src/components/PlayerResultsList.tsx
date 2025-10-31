import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { Player, FilterState } from '../types/player';
import { PlayerResultItem } from './PlayerResultItem';

interface PlayerResultsListProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  filters: FilterState;
  isLoading: boolean;
  searchQuery: string;
}

const ITEM_HEIGHT = 80;
const CONTAINER_PADDING = 16;

export const PlayerResultsList: React.FC<PlayerResultsListProps> = ({
  players,
  onSelectPlayer,
  filters,
  isLoading,
  searchQuery,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">Searching...</div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        {!searchQuery.trim() ? (
          <>
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Search for a player
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Search by name, club, or league
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">😕</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No players found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {Object.values(filters).some(
                (v) =>
                  (Array.isArray(v) && v.length > 0) ||
                  (typeof v === 'number' && v !== 0 && v !== 99 && v !== null) ||
                  (v !== null && typeof v !== 'boolean' && typeof v !== 'string')
              )
                ? 'Try adjusting your filters or search query'
                : 'Try a different search term'}
            </p>
          </>
        )}
      </div>
    );
  }

  const containerHeight = typeof window !== 'undefined' ? window.innerHeight - 200 : 600;

  return (
    <div className="h-full w-full">
      <List
        height={containerHeight}
        itemCount={players.length}
        itemSize={ITEM_HEIGHT}
        width="100%"
        className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
      >
        {({ index, style }) => (
          <div style={style}>
            <PlayerResultItem
              player={players[index]}
              onSelect={onSelectPlayer}
              filters={filters}
            />
          </div>
        )}
      </List>
    </div>
  );
};

