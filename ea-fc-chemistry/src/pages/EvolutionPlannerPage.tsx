import React, { useEffect } from 'react';
import { SEO } from '../components/SEO';
import { trackFeatureUsed } from '../services/analytics';
import { getPopularEvolutions } from '../data/evolutions';

// Placeholder Evolution Planner component (direct, not lazy)
const EvolutionPlanner = () => (
  <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
    <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg font-semibold">
      📈 Evolution Planner Component
    </p>
    <p className="text-sm text-gray-500">
      Coming soon - Player evolution planning and stat comparisons
    </p>
  </div>
);

export const EvolutionPlannerPage: React.FC = () => {
  const popularEvolutions = getPopularEvolutions(5);

  useEffect(() => {
    trackFeatureUsed('evolution_planner_page_view');
  }, []);

  return (
    <>
      <SEO
        title="Evolution Planner - EA FC 25 | Gaming Tools"
        description="Plan player evolutions with before/after stat comparisons and chemistry style optimization"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Evolution Planner
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Upgrade your players and see exactly what they'll become
            </p>
          </div>

          {/* Popular Evolutions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Evolutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularEvolutions.map((evo) => (
                <div
                  key={evo.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {evo.name}
                    </h3>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      {evo.popularity}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {evo.description}
                  </p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Time:</span>
                      <span className="text-gray-700 dark:text-gray-300">{evo.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Cost:</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {evo.estimatedCoins.toLocaleString()} coins
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Worth it:</span>
                      <span className={evo.worthIt ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {evo.worthIt ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evolution Planner Component */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
            <EvolutionPlanner />
          </div>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
              ⚡ Evolution Tips
            </h3>
            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-400">
              <li>• Check player eligibility before buying (rating, position, league)</li>
              <li>• Compare before/after stats with chemistry styles applied</li>
              <li>• Limited-time evolutions expire - complete them first!</li>
              <li>• Most evolutions make players untradeable</li>
              <li>• Track your progress to avoid losing your place</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

