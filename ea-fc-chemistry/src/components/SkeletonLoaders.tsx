import React from 'react';

/**
 * Squad Builder Skeleton
 */
export const SquadBuilderSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>

      {/* Formation Selector */}
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>

      {/* Squad Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(11)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

/**
 * Player Search Skeleton
 */
export const PlayerSearchSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      {/* Search Bar */}
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

      {/* Filters */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {/* Player Image */}
            <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            
            {/* Player Info */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>

            {/* Rating */}
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * SBC Solver Skeleton
 */
export const SBCSolverSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Title */}
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>

      {/* SBC Selection */}
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>

      {/* Requirements */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>

      {/* Solution */}
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  );
};

/**
 * Evolution Planner Skeleton
 */
export const EvolutionPlannerSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Player Card */}
      <div className="flex gap-4">
        <div className="h-48 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Evolution List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

/**
 * My Squads Skeleton
 */
export const MySquadsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>

      {/* Squad Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            {/* Thumbnail */}
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            
            {/* Info */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Generic Card Skeleton
 */
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
};

/**
 * Table Skeleton
 */
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex gap-4 mb-4">
        {[...Array(cols)].map((_, i) => (
          <div key={i} className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex gap-4">
            {[...Array(cols)].map((_, j) => (
              <div key={j} className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

