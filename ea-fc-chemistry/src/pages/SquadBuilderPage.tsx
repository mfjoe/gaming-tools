import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { DataLoadingScreen } from '../components/DataLoadingScreen';
import { SquadBuilderSkeleton } from '../components/SkeletonLoaders';
import { usePlayerData } from '../hooks/usePlayerData';
import { useSquadFromURL } from '../hooks/useSquadFromURL';
import { trackFeatureUsed } from '../services/analytics';

// Import SquadBuilder component
import SquadBuilder from '../components/SquadBuilder';

export const SquadBuilderPage: React.FC = () => {
  const { players, clubs, leagues, nationalities, isLoading, error, progress } = usePlayerData();
  const { squad: urlSquad, isLoading: isLoadingSquad, error: squadError } = useSquadFromURL();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    trackFeatureUsed('squad_builder_page_view');
  }, []);

  // Show loading screen while data loads
  if (isLoading) {
    return (
      <DataLoadingScreen
        progress={progress}
        stage={progress < 30 ? 'Loading essential data...' : progress < 60 ? 'Loading player database...' : 'Almost ready...'}
      />
    );
  }

  // Show error if data failed to load
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Failed to Load Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {String(error)}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Squad Builder - EA FC 25 | Gaming Tools"
        description="Build your EA FC 25 Ultimate Team squad with real-time chemistry calculations and 20,000+ players"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <SquadBuilder initialSquad={urlSquad || undefined} />
      </div>
    </>
  );
};

