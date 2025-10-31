import React, { useMemo, useState } from 'react';
import { FilterSection } from '../FilterPanel';
import { Player } from '../../types/player';

interface LeagueFilterProps {
  value: string[];
  onChange: (leagues: string[]) => void;
  players: Player[];
}

export const LeagueFilter: React.FC<LeagueFilterProps> = ({
  value,
  onChange,
  players,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const leagues = useMemo(() => {
    const unique = new Map<string, Player['league']>();
    players.forEach((player) => {
      if (!unique.has(player.league.id)) {
        unique.set(player.league.id, player.league);
      }
    });
    return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [players]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return leagues;
    const query = searchQuery.toLowerCase();
    return leagues.filter((l) => l.name.toLowerCase().includes(query));
  }, [leagues, searchQuery]);

  const handleToggle = (leagueId: string) => {
    if (value.includes(leagueId)) {
      onChange(value.filter((id) => id !== leagueId));
    } else {
      onChange([...value, leagueId]);
    }
  };

  return (
    <FilterSection title="League">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Search leagues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm"
        />
        <div className="max-h-48 overflow-y-auto space-y-1">
          {filtered.map((league) => (
            <label
              key={league.id}
              className="flex items-center space-x-2 cursor-pointer py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2"
            >
              <input
                type="checkbox"
                checked={value.includes(league.id)}
                onChange={() => handleToggle(league.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              {league.logo_url && (
                <img
                  src={league.logo_url}
                  alt={league.name}
                  className="w-5 h-5 object-contain"
                />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                {league.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </FilterSection>
  );
};


