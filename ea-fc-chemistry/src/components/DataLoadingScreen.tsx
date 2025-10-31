import React from 'react';
import { Loader2, AlertCircle, RefreshCw, X } from 'lucide-react';

interface DataLoadingScreenProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  progress: number;
  loadingMessage: string;
  current?: number;
  total?: number;
  onRetry?: () => void;
  onSkip?: () => void;
  onCancel?: () => void;
}

export const DataLoadingScreen: React.FC<DataLoadingScreenProps> = ({
  isLoading,
  isError,
  error,
  progress,
  loadingMessage,
  current,
  total,
  onRetry,
  onSkip,
  onCancel,
}) => {
  if (isError) {
    return (
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Failed to Load Data
            </h2>
            {onCancel && (
              <button
                onClick={onCancel}
                className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error?.message || 'An error occurred while loading player data.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!isLoading) {
    return null;
  }

  const estimatedTime = total && current
    ? Math.max(0, Math.round((total - current) * 0.1 / 1000)) // Rough estimate: 0.1s per item
    : null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Loading Player Data
          </h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              aria-label="Cancel"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {loadingMessage}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {progress}%
            </span>
          </div>
          
          {current && total && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {current.toLocaleString()} / {total.toLocaleString()} players
            </div>
          )}

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {estimatedTime && estimatedTime > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Estimated time remaining: ~{estimatedTime}s
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Please wait...</span>
        </div>

        {/* Skip Option */}
        {onSkip && progress > 20 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onSkip}
              className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Use cached data (if available)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


