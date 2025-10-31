import React from 'react';
import { FilterSection } from '../FilterPanel';
import { Platform } from '../../types/player';

interface PriceFilterProps {
  minPrice: number | null;
  maxPrice: number | null;
  platform: Platform;
  onChange: (min: number | null, max: number | null, platform: Platform) => void;
}

const PRICE_PRESETS = [
  { label: 'Under 10k', max: 10000 },
  { label: 'Under 50k', max: 50000 },
  { label: 'Under 100k', max: 100000 },
  { label: '500k+', min: 500000 },
];

export const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  platform,
  onChange,
}) => {
  const applyPreset = (preset: typeof PRICE_PRESETS[0]) => {
    onChange(preset.min || null, preset.max || null, platform);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)}k`;
    return price.toString();
  };

  return (
    <FilterSection title="Price">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Platform
          </label>
          <select
            value={platform}
            onChange={(e) => onChange(minPrice, maxPrice, e.target.value as Platform)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="ps">PlayStation</option>
            <option value="xbox">Xbox</option>
            <option value="pc">PC</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Min Price
              </label>
              <input
                type="number"
                placeholder="Min"
                value={minPrice || ''}
                onChange={(e) =>
                  onChange(e.target.value ? Number(e.target.value) : null, maxPrice, platform)
                }
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Max Price
              </label>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice || ''}
                onChange={(e) =>
                  onChange(minPrice, e.target.value ? Number(e.target.value) : null, platform)
                }
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm"
              />
            </div>
          </div>
          {minPrice !== null || maxPrice !== null ? (
            <button
              onClick={() => onChange(null, null, platform)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear price filter
            </button>
          ) : null}
        </div>
      </div>
    </FilterSection>
  );
};


