import React, { useMemo, useState } from 'react';
import { FilterSection } from '../FilterPanel';
import { Player } from '../../types/player';

interface ClubFilterProps {
  value: string[];
  onChange: (clubs: string[]) => void;
  players: Player[];
}

export const ClubFilter: React.FC<ClubFilterProps> = ({
  value,
  onChange,
  players,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const clubs = useMemo(() => {
    const unique = new Map<string, Player['club']>();
    players.forEach((player) => {
      if (!unique.has(player.club.id)) {
        unique.set(player.club.id, player.club);
      }
    });
    return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [players]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return clubs;
    const query = searchQuery.toLowerCase();
    return clubs.filter((c) => c.name.toLowerCase().includes(query));
  }, [clubs, searchQuery]);

  const handleToggle = (clubId: string) => {
    if (value.includes(clubId)) {
      onChange(value.filter((id) => id !== clubId));
    } else {
      onChange([...value, clubId]);
    }
  };

  return (
    <FilterSection title="Club">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Search clubs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm"
        />
        <div className="max-h-48 overflow-y-auto space-y-1">
          {filtered.map((club) => (
            <label
              key={club.id}
              className="flex items-center space-x-2 cursor-pointer py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2"
            >
              <input
                type="checkbox"
                checked={value.includes(club.id)}
                onChange={() => handleToggle(club.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              {club.logo_url && (
                <img
                  src={club.logo_url}
                  alt={club.name}
                  className="w-5 h-5 object-contain"
                />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                {club.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </FilterSection>
  );
};


