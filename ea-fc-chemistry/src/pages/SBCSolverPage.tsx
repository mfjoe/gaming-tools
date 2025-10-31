import React, { useEffect } from 'react';
import { SEO } from '../components/SEO';
import { trackFeatureUsed } from '../services/analytics';
import { POPULAR_SBCS } from '../data/popularSBCs';

// Placeholder SBC Helper component (direct, not lazy)
const SBCHelper = () => (
  <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
    <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg font-semibold">
      🧩 SBC Helper Component
    </p>
    <p className="text-sm text-gray-500">
      Coming soon - Intelligent SBC solutions
    </p>
  </div>
);

export const SBCSolverPage: React.FC = () => {
  useEffect(() => {
    trackFeatureUsed('sbc_solver_page_view');
  }, []);

  return (
    <>
      <SEO
        title="SBC Solver - EA FC 25 | Gaming Tools"
        description="Solve Squad Building Challenges with optimized, low-cost solutions. No bench waste."
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              SBC Solver
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Find the cheapest solutions for Squad Building Challenges
            </p>
          </div>

          {/* Popular SBCs */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Popular SBCs
            </h2>
            {POPULAR_SBCS.length === 0 ? (
              <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  SBC templates will appear here once configured
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {POPULAR_SBCS.slice(0, 6).map((sbc) => (
                <div
                  key={sbc.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {sbc.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {sbc.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Rating: {sbc.requirements.minRating}+
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      ~{sbc.estimatedCost.toLocaleString()} coins
                    </span>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>

          {/* SBC Solver Component */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
            <SBCHelper />
          </div>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              💡 How to Use
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
              <li>1. Select an SBC template or enter custom requirements</li>
              <li>2. Set your budget and platform (PS/Xbox/PC)</li>
              <li>3. Choose to use players from your club (untradeable)</li>
              <li>4. Click "Solve" to find the cheapest solution</li>
              <li>5. Review alternatives and select the best option</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

