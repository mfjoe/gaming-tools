import React from 'react';
import { FilterSection } from '../FilterPanel';

const POSITION_GROUPS = {
  Goalkeeper: ['GK'],
  Defender: ['LB', 'LWB', 'CB', 'RB', 'RWB'],
  Midfielder: ['LM', 'CM', 'CDM', 'CAM', 'RM', 'LW', 'RW'],
  Attacker: ['LF', 'CF', 'ST', 'RF'],
};

interface PositionFilterProps {
  value: string[];
  onChange: (positions: string[]) => void;
  currentPosition?: string | null;
}

export const PositionFilter: React.FC<PositionFilterProps> = ({
  value,
  onChange,
  currentPosition,
}) => {
  const handleToggle = (position: string) => {
    if (value.includes(position)) {
      onChange(value.filter((p) => p !== position));
    } else {
      onChange([...value, position]);
    }
  };

  return (
    <FilterSection title="Position" defaultOpen={!!currentPosition}>
      <div className="space-y-3">
        {Object.entries(POSITION_GROUPS).map(([groupName, positions]) => (
          <div key={groupName}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {groupName}
            </label>
            <div className="flex flex-wrap gap-2">
              {positions.map((pos) => (
                <label
                  key={pos}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(pos)}
                    onChange={() => handleToggle(pos)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{pos}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FilterSection>
  );
};


