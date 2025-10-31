import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { trackFeatureUsed } from '../services/analytics';

// Placeholder MySquads component (direct, not lazy)
const MySquads = () => (
  <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
    <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg font-semibold">
      💾 My Squads Component
    </p>
    <p className="text-sm text-gray-500">
      Coming soon - Save and manage your squads
    </p>
  </div>
);

export const MySquadsPage: React.FC = () => {
  useEffect(() => {
    trackFeatureUsed('my_squads_page_view');
  }, []);

  return (
    <>
      <SEO
        title="My Squads - EA FC 25 | Gaming Tools"
        description="View, manage, and share your saved EA FC 25 Ultimate Team squads"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                My Squads
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage your saved squads
              </p>
            </div>
            <Link
              to="/squad-builder"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              + New Squad
            </Link>
          </div>

          {/* MySquads Component */}
          <MySquads />
        </div>
      </div>
    </>
  );
};

