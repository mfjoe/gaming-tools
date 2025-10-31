import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useSquadFromURL } from '../hooks/useSquadFromURL';
import { trackSquadLoaded } from '../services/analytics';
import { useSavedSquads } from '../hooks/useSavedSquads';

export const SharedSquadPage: React.FC = () => {
  const { encodedSquad, shortCode } = useParams<{ encodedSquad?: string; shortCode?: string }>();
  const navigate = useNavigate();
  const { squad, isLoading, error } = useSquadFromURL();
  const { saveSquad } = useSavedSquads();

  useEffect(() => {
    if (squad) {
      trackSquadLoaded('url');
    }
  }, [squad]);

  const handleCopyToMySquads = () => {
    if (squad) {
      const savedId = saveSquad({
        name: `Shared Squad ${new Date().toLocaleDateString()}`,
        squad,
      });
      navigate('/my-squads');
    }
  };

  const handleEditSquad = () => {
    if (squad) {
      // Navigate to squad builder with the squad data
      // The squad builder should pick up the URL parameter
      navigate(`/squad-builder?s=${encodedSquad || shortCode}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading squad...</p>
        </div>
      </div>
    );
  }

  if (error || !squad) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Invalid Squad Link
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || 'This squad link appears to be invalid or corrupted.'}
          </p>
          <button
            onClick={() => navigate('/squad-builder')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Build New Squad
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Shared Squad - EA FC 25 | Gaming Tools`}
        description="View a shared EA FC 25 Ultimate Team squad"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Shared Squad
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Formation: {squad.formation} • Rating: {squad.averageRating || 0} • Chemistry: {squad.chemistry || 0}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCopyToMySquads}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Copy to My Squads
                </button>
                <button
                  onClick={handleEditSquad}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Edit Squad
                </button>
              </div>
            </div>
          </div>

          {/* Squad Display (Read-only) */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center text-gray-600 dark:text-gray-400 py-12">
              <p>Squad visualization would appear here</p>
              <p className="text-sm mt-2">(Render squad using your PitchView component)</p>
            </div>
          </div>

          {/* Share Again */}
          <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
              Like this squad?
            </h3>
            <p className="text-sm text-green-800 dark:text-green-400 mb-3">
              Save it to your collection or edit it to make it your own!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

