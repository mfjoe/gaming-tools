import React from 'react';
import { FilterSection } from '../FilterPanel';
import { FilterState, WorkRate, PreferredFoot, AccelerateType } from '../../types/player';

interface AdditionalFiltersProps {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: any) => void;
}

export const AdditionalFilters: React.FC<AdditionalFiltersProps> = ({
  filters,
  setFilter,
}) => {
  return (
    <FilterSection title="Additional Filters">
      <div className="space-y-4">
        {/* Work Rates */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Attacking WR
            </label>
            <select
              value={filters.workRateAttack || ''}
              onChange={(e) =>
                setFilter('workRateAttack', e.target.value || null)
              }
              className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm"
            >
              <option value="">Any</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Defending WR
            </label>
            <select
              value={filters.workRateDefense || ''}
              onChange={(e) =>
                setFilter('workRateDefense', e.target.value || null)
              }
              className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm"
            >
              <option value="">Any</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Weak Foot & Skill Moves */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Weak Foot
            </label>
            <select
              value={filters.weakFoot || ''}
              onChange={(e) =>
                setFilter('weakFoot', e.target.value ? Number(e.target.value) : null)
              }
              className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((stars) => (
                <option key={stars} value={stars}>
                  {stars} ⭐
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Skill Moves
            </label>
            <select
              value={filters.skillMoves || ''}
              onChange={(e) =>
                setFilter('skillMoves', e.target.value ? Number(e.target.value) : null)
              }
              className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((stars) => (
                <option key={stars} value={stars}>
                  {stars} ⭐
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preferred Foot */}
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Preferred Foot
          </label>
          <select
            value={filters.preferredFoot || ''}
            onChange={(e) =>
              setFilter('preferredFoot', e.target.value || null)
            }
            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm"
          >
            <option value="">Any</option>
            <option value="Left">Left</option>
            <option value="Right">Right</option>
          </select>
        </div>

        {/* Body Type */}
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Body Type
          </label>
          <select
            value={filters.bodyType || ''}
            onChange={(e) => setFilter('bodyType', e.target.value || null)}
            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm"
          >
            <option value="">Any</option>
            <option value="Lean">Lean</option>
            <option value="Normal">Normal</option>
            <option value="Stocky">Stocky</option>
            <option value="High & Average+">High & Average+</option>
            <option value="High & Lean+">High & Lean+</option>
          </select>
        </div>

        {/* AcceleRATE Type */}
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            AcceleRATE
          </label>
          <select
            value={filters.accelerateType || ''}
            onChange={(e) =>
              setFilter('accelerateType', e.target.value || null)
            }
            className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-700 rounded text-sm"
          >
            <option value="">Any</option>
            <option value="Controlled">Controlled</option>
            <option value="Explosive">Explosive</option>
            <option value="Lengthy">Lengthy</option>
          </select>
        </div>
      </div>
    </FilterSection>
  );
};


