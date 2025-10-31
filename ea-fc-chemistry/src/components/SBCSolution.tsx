import React from 'react';
import { SolverResult, SBCRequirement } from '../types/sbc';
import { Player } from '../types/player';
import { validateNoBenchWaste } from '../services/sbcSolver';

interface SBCSolutionProps {
  result: SolverResult;
  requirement: SBCRequirement;
}

export const SBCSolution: React.FC<SBCSolutionProps> = ({ result, requirement }) => {
  const benchCheck = validateNoBenchWaste(result.squad);

  // Calculate value assessment
  const estimatedRewardValue = estimateRewardValue(requirement.reward);
  const valueAssessment =
    result.totalCost < estimatedRewardValue
      ? { type: 'good', message: `✅ Good value: Costs ${result.totalCost.toLocaleString()} coins, estimated return ~${estimatedRewardValue.toLocaleString()}` }
      : result.totalCost > estimatedRewardValue * 1.2
      ? { type: 'warning', message: `⚠️ This SBC costs ${result.totalCost.toLocaleString()} but reward pack value is ~${estimatedRewardValue.toLocaleString()}` }
      : { type: 'neutral', message: `ℹ️ Costs ${result.totalCost.toLocaleString()}, estimated return ~${estimatedRewardValue.toLocaleString()}` };

  return (
    <div className="space-y-4">
      {/* Bench Warning */}
      {benchCheck.valid ? (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200 font-medium">
            ✅ Smart Solution: Only uses {result.squad.length} players (no bench waste)
          </p>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            EA's companion app would likely use 18+ players for this SBC
          </p>
        </div>
      ) : (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 font-medium">
            {benchCheck.error}
          </p>
        </div>
      )}

      {/* Value Assessment */}
      <div
        className={`p-3 rounded-lg border ${
          valueAssessment.type === 'good'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : valueAssessment.type === 'warning'
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        }`}
      >
        <p
          className={
            valueAssessment.type === 'good'
              ? 'text-green-800 dark:text-green-200'
              : valueAssessment.type === 'warning'
              ? 'text-yellow-800 dark:text-yellow-200'
              : 'text-blue-800 dark:text-blue-200'
          }
        >
          {valueAssessment.message}
        </p>
      </div>

      {/* Solution Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {result.totalCost.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Squad Rating</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {result.averageRating}
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Chemistry</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {result.totalChemistry}/33
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Untradeable Used</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {result.untradeableUsed}
          </div>
        </div>
      </div>

      {/* Squad Display */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="font-semibold mb-4">Solution Squad (11 Players)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {result.squad.map((player, index) => (
            <div
              key={`${player.id}-${index}`}
              className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
            >
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {player.common_name || player.last_name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {player.club.name} • {player.overall_rating} rated
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {(() => {
                    const priceField = `price_${'ps'}` as keyof Player;
                    const price = player[priceField] as number | null;
                    return price ? `${price.toLocaleString()}` : 'Owned';
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Buys */}
      {result.marketBuys.length > 0 && (
        <div className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-900/20">
          <h3 className="font-semibold mb-2 text-orange-900 dark:text-orange-200">
            Players to Buy ({result.marketBuys.length})
          </h3>
          <div className="space-y-1">
            {result.marketBuys.map((player) => (
              <div key={player.id} className="flex items-center justify-between text-sm">
                <span>
                  {player.common_name || player.last_name} ({player.overall_rating})
                </span>
                <span className="font-semibold">
                  {(() => {
                    const priceField = `price_${'ps'}` as keyof Player;
                    const price = player[priceField] as number | null;
                    return price ? `${price.toLocaleString()}` : 'N/A';
                  })()} coins
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reasoning */}
      {result.reasoning.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Solver Reasoning</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
            {result.reasoning.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h3 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-200">Warnings</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
            {result.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Alternative Solutions */}
      {result.alternativeSolutions && result.alternativeSolutions.length > 0 && (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2">Alternative Solutions</h3>
          <div className="space-y-2">
            {result.alternativeSolutions.map((alt, index) => (
              <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                <div className="flex items-center justify-between">
                  <span>Alternative {index + 1}</span>
                  <span className="font-semibold">
                    {alt.totalCost.toLocaleString()} coins
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Copy to Squad Builder */}
      <button
        onClick={() => {
          // Copy squad to clipboard or squad builder
          const squadData = result.squad.map((p) => ({
            id: p.id,
            position: p.primary_position,
          }));
          navigator.clipboard.writeText(JSON.stringify(squadData));
          alert('Squad copied to clipboard!');
        }}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
      >
        Copy to Squad Builder
      </button>
    </div>
  );
};

function estimateRewardValue(reward: SBCRequirement['reward']): number {
  // Rough estimates (adjust based on market data)
  const packValues: Record<string, number> = {
    'Rare Electrum Players Pack': 15000,
    'Rare Gold Pack': 25000,
    'Gold Pack': 7500,
    'Premium Gold Players Pack': 35000,
    'Jumbo Rare Gold Pack': 45000,
    'Rare Gold Players Pack': 50000,
    'Ultimate Pack': 125000,
    'Mega Pack': 30000,
    'Prime Gold Players Pack': 75000,
  };

  if (reward.type === 'pack') {
    return packValues[reward.value] || 20000;
  }
  if (reward.type === 'coins') {
    return parseInt(reward.value) || 0;
  }
  // Player rewards vary, default to medium pack value
  return 40000;
}

