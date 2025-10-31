import React from 'react';
import { Player, FilterState } from '../types/player';

interface PlayerResultItemProps {
  player: Player;
  onSelect: (player: Player) => void;
  filters: FilterState;
}

const formatPrice = (price: number | null): string => {
  if (price === null) return 'N/A';
  if (price >= 1000000) return `€${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `€${(price / 1000).toFixed(0)}k`;
  return `€${price}`;
};

export const PlayerResultItem: React.FC<PlayerResultItemProps> = ({
  player,
  onSelect,
  filters,
}) => {
  const displayName = player.common_name || `${player.first_name} ${player.last_name}`;
  const priceField = `price_${filters.platform}` as keyof Player;
  const price = player[priceField] as number | null;

  const handleClick = () => {
    onSelect(player);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(player);
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Select ${displayName}, ${player.overall_rating} rated ${player.primary_position}`}
      className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="flex items-center gap-4">
        {/* Player Image */}
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center overflow-hidden">
          {player.face_image_url ? (
            <img
              src={player.face_image_url}
              alt={displayName}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="text-gray-400 text-xs">No img</div>
          )}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
              {displayName}
            </h4>
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
              {player.overall_rating}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
              {player.primary_position}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {player.club.logo_url && (
              <img
                src={player.club.logo_url}
                alt={player.club.name}
                className="w-4 h-4 object-contain"
                loading="lazy"
              />
            )}
            <span className="truncate">{player.club.name}</span>
            {player.league.logo_url && (
              <>
                <span className="mx-1">•</span>
                <img
                  src={player.league.logo_url}
                  alt={player.league.name}
                  className="w-4 h-4 object-contain"
                  loading="lazy"
                />
                <span className="truncate">{player.league.name}</span>
              </>
            )}
            {player.primary_nationality.flag_url && (
              <>
                <span className="mx-1">•</span>
                <img
                  src={player.primary_nationality.flag_url}
                  alt={player.primary_nationality.name}
                  className="w-4 h-4 object-contain"
                  loading="lazy"
                />
              </>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex-shrink-0 text-right">
          <div className="font-semibold text-gray-900 dark:text-white">
            {formatPrice(price)}
          </div>
          {player.card_type !== 'base' && (
            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {player.card_type}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


