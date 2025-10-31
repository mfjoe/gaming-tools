import React, { useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Search } from 'lucide-react';
import { Player } from '../types/player';
import { usePlayerSearch } from '../hooks/usePlayerSearch';
import { SearchInput } from './SearchInput';
import { FilterPanel } from './FilterPanel';
import { PlayerResultsList } from './PlayerResultsList';
import { SortSelector } from './SortSelector';

interface PlayerSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  currentPosition?: string | null;
  players: Player[];
}

export const PlayerSearchModal: React.FC<PlayerSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPlayer,
  currentPosition,
  players,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    clearFilters,
    sortBy,
    setSortBy,
    results,
    isLoading,
    resultCount,
  } = usePlayerSearch({
    players,
    initialPosition: currentPosition,
  });

  // Autofocus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSelectPlayer = (player: Player) => {
    onSelectPlayer(player);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 data-[state=open]:animate-fadeIn" />
        <Dialog.Content
          className="fixed inset-0 sm:inset-[5%] sm:rounded-xl bg-white dark:bg-gray-900 z-50 flex flex-col shadow-2xl focus:outline-none overflow-hidden"
          aria-describedby="player-search-description"
          onEscapeKeyDown={onClose}
          onInteractOutside={(e) => {
            // Prevent closing on filter panel clicks
            if ((e.target as HTMLElement).closest('[data-filter-panel]')) {
              e.preventDefault();
            }
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              Search Players
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Controls Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <SearchInput
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search by name, club, or league..."
                />
              </div>
              <SortSelector value={sortBy} onChange={setSortBy} />
            </div>

            {/* Result count */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                {isLoading ? (
                  'Searching...'
                ) : (
                  <>
                    <span className="font-medium">{resultCount.toLocaleString()}</span> player
                    {resultCount !== 1 ? 's' : ''} found
                  </>
                )}
              </span>
              {Object.values(filters).some(
                (v) =>
                  (Array.isArray(v) && v.length > 0) ||
                  (typeof v === 'number' && v !== 0 && v !== 99 && v !== null) ||
                  (v !== null && typeof v !== 'boolean' && typeof v !== 'string')
              ) && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Filter Panel - Hidden on mobile by default */}
            <div className="hidden lg:block w-80 border-r border-gray-200 dark:border-gray-800 overflow-y-auto flex-shrink-0">
              <FilterPanel
                filters={filters}
                setFilter={setFilter}
                players={players}
                currentPosition={currentPosition}
              />
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-hidden">
              <PlayerResultsList
                players={results}
                onSelectPlayer={handleSelectPlayer}
                filters={filters}
                isLoading={isLoading}
                searchQuery={searchQuery}
              />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <Dialog.Root>
            <Dialog.Trigger className="lg:hidden fixed bottom-4 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Search className="w-5 h-5" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60 z-60" />
              <Dialog.Content className="fixed bottom-0 left-0 right-0 max-h-[80vh] bg-white dark:bg-gray-900 rounded-t-xl overflow-y-auto z-70">
                <FilterPanel
                  filters={filters}
                  setFilter={setFilter}
                  players={players}
                  currentPosition={currentPosition}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <p id="player-search-description" className="sr-only">
            Search and filter through thousands of EA FC 25 players
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};


