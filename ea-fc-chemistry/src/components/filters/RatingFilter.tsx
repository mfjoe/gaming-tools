import React, { useMemo } from 'react';
import { FilterSection } from '../FilterPanel';

interface RatingFilterProps {
  minRating: number;
  maxRating: number;
  onChange: (min: number, max: number) => void;
}

const RATING_PRESETS = [
  { label: 'Gold 75+', min: 75, max: 99 },
  { label: '83+', min: 83, max: 99 },
  { label: '85+', min: 85, max: 99 },
  { label: '90+', min: 90, max: 99 },
];

export const RatingFilter: React.FC<RatingFilterProps> = ({
  minRating,
  maxRating,
  onChange,
}) => {
  const isPresetActive = useMemo(() => {
    return RATING_PRESETS.some(
      (preset) => preset.min === minRating && preset.max === maxRating
    );
  }, [minRating, maxRating]);

  const applyPreset = (preset: typeof RATING_PRESETS[0]) => {
    onChange(preset.min, preset.max);
  };

  return (
    <FilterSection title="Rating">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {RATING_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                preset.min === minRating && preset.max === maxRating
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Min: {minRating}</span>
            <span>Max: {maxRating}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="range"
              min="0"
              max="99"
              value={minRating}
              onChange={(e) => onChange(Number(e.target.value), maxRating)}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="99"
              value={maxRating}
              onChange={(e) => onChange(minRating, Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="99"
              value={minRating}
              onChange={(e) =>
                onChange(Math.max(0, Math.min(99, Number(e.target.value))), maxRating)
              }
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm"
            />
            <input
              type="number"
              min="0"
              max="99"
              value={maxRating}
              onChange={(e) =>
                onChange(minRating, Math.max(0, Math.min(99, Number(e.target.value))))
              }
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm"
            />
          </div>
        </div>
      </div>
    </FilterSection>
  );
};


