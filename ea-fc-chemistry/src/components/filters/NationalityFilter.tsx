import React, { useMemo, useState } from 'react';
import { FilterSection } from '../FilterPanel';
import { Player } from '../../types/player';

interface NationalityFilterProps {
  value: string[];
  onChange: (nationalities: string[]) => void;
  players: Player[];
}

export const NationalityFilter: React.FC<NationalityFilterProps> = ({
  value,
  onChange,
  players,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const nationalities = useMemo(() => {
    const unique = new Map<string, Player['primary_nationality']>();
    players.forEach((player) => {
      if (!unique.has(player.primary_nationality.id)) {
        unique.set(player.primary_nationality.id, player.primary_nationality);
      }
    });
    return Array.from(unique.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [players]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return nationalities;
    const query = searchQuery.toLowerCase();
    return nationalities.filter((n) => n.name.toLowerCase().includes(query));
  }, [nationalities, searchQuery]);

  const handleToggle = (nationalityId: string) => {
    if (value.includes(nationalityId)) {
      onChange(value.filter((id) => id !== nationalityId));
    } else {
      onChange([...value, nationalityId]);
    }
  };

  return (
    <FilterSection title="Nationality">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Search nationalities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm"
        />
        <div className="max-h-48 overflow-y-auto space-y-1">
          {filtered.map((nationality) => (
            <label
              key={nationality.id}
              className="flex items-center space-x-2 cursor-pointer py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2"
            >
              <input
                type="checkbox"
                checked={value.includes(nationality.id)}
                onChange={() => handleToggle(nationality.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              {nationality.flag_url && (
                <img
                  src={nationality.flag_url}
                  alt={nationality.name}
                  className="w-5 h-5 object-contain"
                />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                {nationality.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </FilterSection>
  );
};


