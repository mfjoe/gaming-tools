import React, { useState } from 'react';
import { SBCRequirement, SolverOptions, ClubPlayer } from '../types/sbc';
import { Player } from '../types/player';
import { useSBCSolver } from '../hooks/useSBCSolver';
import { POPULAR_SBCS } from '../data/popularSBCs';
import { SBCSolution } from './SBCSolution';
import { ClubInventory } from './ClubInventory';

interface SBCHelperProps {
  allPlayers: Player[];
  userClub?: ClubPlayer[];
}

export const SBCHelper: React.FC<SBCHelperProps> = ({ allPlayers, userClub = [] }) => {
  const [selectedSBC, setSelectedSBC] = useState<SBCRequirement | null>(null);
  const [useMyClub, setUseMyClub] = useState(true);
  const [maxBudget, setMaxBudget] = useState<number | null>(null);
  const [platform, setPlatform] = useState<'ps' | 'xbox' | 'pc'>('ps');
  
  const { isLoading, result, error, solve, clearResult } = useSBCSolver();
  const [updatedClub, setUpdatedClub] = useState<ClubPlayer[]>(userClub);

  const handleSolve = async () => {
    if (!selectedSBC) return;

    const options: SolverOptions = {
      userClub: useMyClub ? updatedClub : [],
      preferUntradeable: true,
      maxBudget,
      platform,
      allowPartialSolution: false,
    };

    await solve(selectedSBC, options);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">SBC Solver</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Intelligent SBC solver that minimizes cost and avoids bench waste (only uses 11 players!)
        </p>
      </div>

      {/* Popular SBCs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select SBC
        </label>
        <select
          value={selectedSBC?.id || ''}
          onChange={(e) => {
            const sbc = POPULAR_SBCS.find((s) => s.id === e.target.value);
            setSelectedSBC(sbc || null);
            clearResult();
          }}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="">Select an SBC...</option>
          {POPULAR_SBCS.map((sbc) => (
            <option key={sbc.id} value={sbc.id}>
              {sbc.name} (~{sbc.estimatedCost?.toLocaleString()} coins)
            </option>
          ))}
        </select>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useMyClub}
            onChange={(e) => setUseMyClub(e.target.checked)}
          />
          <span>Use my club players</span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as 'ps' | 'xbox' | 'pc')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="ps">PlayStation</option>
            <option value="xbox">Xbox</option>
            <option value="pc">PC</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Budget (optional)
          </label>
          <input
            type="number"
            placeholder="No limit"
            value={maxBudget || ''}
            onChange={(e) =>
              setMaxBudget(e.target.value ? parseInt(e.target.value) : null)
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      {/* Club Inventory (if using club) */}
      {useMyClub && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
          <ClubInventory players={updatedClub} onUpdate={setUpdatedClub} />
        </div>
      )}

      {/* Solve Button */}
      <button
        onClick={handleSolve}
        disabled={!selectedSBC || isLoading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
      >
        {isLoading ? 'Solving...' : 'Solve SBC'}
      </button>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">Error: {error.message}</p>
        </div>
      )}

      {/* Solution */}
      {result && <SBCSolution result={result} requirement={selectedSBC!} />}
    </div>
  );
};


