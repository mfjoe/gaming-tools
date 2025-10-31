import React, { useMemo } from 'react';
import { Squad } from '../types/player';

interface SquadComparisonProps {
  squad1: Squad;
  squad2: Squad;
  squad1Name?: string;
  squad2Name?: string;
}

interface ComparisonStat {
  name: string;
  squad1: number;
  squad2: number;
  better: 1 | 2 | 'tie';
  format: 'number' | 'percentage';
}

export const SquadComparison: React.FC<SquadComparisonProps> = ({
  squad1,
  squad2,
  squad1Name = 'Squad 1',
  squad2Name = 'Squad 2',
}) => {
  const comparison = useMemo(() => {
    // Helper to calculate average stats
    const getAvgStat = (squad: Squad, stat: keyof typeof squad.players[0]) => {
      const players = squad.players.filter((p) => p !== null);
      if (players.length === 0) return 0;
      const total = players.reduce((sum, p) => sum + ((p as any)[stat] || 0), 0);
      return Math.round(total / players.length);
    };

    // Calculate stats for both squads
    const stats: ComparisonStat[] = [
      {
        name: 'Overall Rating',
        squad1: getAvgStat(squad1, 'overall_rating'),
        squad2: getAvgStat(squad2, 'overall_rating'),
        better: 'tie',
        format: 'number',
      },
      {
        name: 'Chemistry',
        squad1: squad1.totalChemistry || 0,
        squad2: squad2.totalChemistry || 0,
        better: 'tie',
        format: 'number',
      },
      {
        name: 'Pace',
        squad1: getAvgStat(squad1, 'pace'),
        squad2: getAvgStat(squad2, 'pace'),
        better: 'tie',
        format: 'number',
      },
      {
        name: 'Shooting',
        squad1: getAvgStat(squad1, 'shooting'),
        squad2: getAvgStat(squad2, 'shooting'),
        better: 'tie',
        format: 'number',
      },
      {
        name: 'Passing',
        squad1: getAvgStat(squad1, 'passing'),
        squad2: getAvgStat(squad2, 'passing'),
        better: 'tie',
        format: 'number',
      },
      {
        name: 'Dribbling',
        squad1: getAvgStat(squad1, 'dribbling'),
        squad2: getAvgStat(squad2, 'dribbling'),
        better: 'tie',
        format: 'number',
      },
      {
        name: 'Defending',
        squad1: getAvgStat(squad1, 'defending'),
        squad2: getAvgStat(squad2, 'defending'),
        better: 'tie',
        format: 'number',
      },
      {
        name: 'Physical',
        squad1: getAvgStat(squad1, 'physical'),
        squad2: getAvgStat(squad2, 'physical'),
        better: 'tie',
        format: 'number',
      },
    ];

    // Determine which is better for each stat
    stats.forEach((stat) => {
      if (stat.squad1 > stat.squad2) {
        stat.better = 1;
      } else if (stat.squad2 > stat.squad1) {
        stat.better = 2;
      } else {
        stat.better = 'tie';
      }
    });

    // Overall winner
    const squad1Wins = stats.filter((s) => s.better === 1).length;
    const squad2Wins = stats.filter((s) => s.better === 2).length;
    const betterSquad: 1 | 2 | 'tie' =
      squad1Wins > squad2Wins ? 1 : squad2Wins > squad1Wins ? 2 : 'tie';

    return { stats, betterSquad, squad1Wins, squad2Wins };
  }, [squad1, squad2]);

  const getBarWidth = (value: number, max: number) => {
    return Math.round((value / max) * 100);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Squad Comparison</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Compare two squads side-by-side to find the best option
        </p>
      </div>

      {/* Squad Names */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-500">
          <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-200">{squad1Name}</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">{squad1.formation}</p>
        </div>
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-500">
          <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-200">{squad2Name}</h3>
          <p className="text-sm text-purple-700 dark:text-purple-300">{squad2.formation}</p>
        </div>
      </div>

      {/* Winner Banner */}
      {comparison.betterSquad !== 'tie' && (
        <div
          className={`p-4 rounded-lg text-center ${
            comparison.betterSquad === 1
              ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
              : 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500'
          }`}
        >
          <h4
            className={`text-lg font-bold ${
              comparison.betterSquad === 1
                ? 'text-blue-900 dark:text-blue-200'
                : 'text-purple-900 dark:text-purple-200'
            }`}
          >
            🏆 {comparison.betterSquad === 1 ? squad1Name : squad2Name} is Better Overall
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Wins {comparison.betterSquad === 1 ? comparison.squad1Wins : comparison.squad2Wins} out of{' '}
            {comparison.stats.length} categories
          </p>
        </div>
      )}

      {comparison.betterSquad === 'tie' && (
        <div className="p-4 rounded-lg text-center bg-gray-100 dark:bg-gray-800 border-2 border-gray-400">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">⚖️ It's a Tie!</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Both squads are equally balanced
          </p>
        </div>
      )}

      {/* Stats Comparison */}
      <div className="space-y-4">
        {comparison.stats.map((stat, index) => {
          const maxValue = Math.max(stat.squad1, stat.squad2, 1);
          const squad1Width = getBarWidth(stat.squad1, maxValue);
          const squad2Width = getBarWidth(stat.squad2, maxValue);

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                <span>{stat.name}</span>
                <span className="text-xs text-gray-500">
                  {stat.squad1} vs {stat.squad2}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Squad 1 Bar */}
                <div className="flex items-center justify-end">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-full flex items-center justify-end pr-2 text-xs font-semibold text-white transition-all ${
                        stat.better === 1
                          ? 'bg-blue-600'
                          : stat.better === 'tie'
                          ? 'bg-gray-500'
                          : 'bg-blue-400'
                      }`}
                      style={{ width: `${squad1Width}%` }}
                    >
                      {stat.squad1}
                    </div>
                  </div>
                </div>

                {/* Squad 2 Bar */}
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-full flex items-center pl-2 text-xs font-semibold text-white transition-all ${
                        stat.better === 2
                          ? 'bg-purple-600'
                          : stat.better === 'tie'
                          ? 'bg-gray-500'
                          : 'bg-purple-400'
                      }`}
                      style={{ width: `${squad2Width}%` }}
                    >
                      {stat.squad2}
                    </div>
                  </div>
                </div>
              </div>

              {/* Difference */}
              {stat.squad1 !== stat.squad2 && (
                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                  Difference: {Math.abs(stat.squad1 - stat.squad2)}
                  {stat.better !== 'tie' && (
                    <span className="ml-1">
                      ({stat.better === 1 ? squad1Name : squad2Name} ahead)
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">💡 Recommendations</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
          {comparison.betterSquad === 1 && (
            <li>{squad1Name} has better overall performance across more categories</li>
          )}
          {comparison.betterSquad === 2 && (
            <li>{squad2Name} has better overall performance across more categories</li>
          )}
          {comparison.betterSquad === 'tie' && (
            <li>Both squads are well-balanced - choose based on playstyle preference</li>
          )}
          {comparison.stats[0].squad1 > comparison.stats[0].squad2 && (
            <li>{squad1Name} has a higher average player rating</li>
          )}
          {comparison.stats[0].squad2 > comparison.stats[0].squad1 && (
            <li>{squad2Name} has a higher average player rating</li>
          )}
          {comparison.stats[1].squad1 > comparison.stats[1].squad2 && (
            <li>{squad1Name} has better chemistry between players</li>
          )}
          {comparison.stats[1].squad2 > comparison.stats[1].squad1 && (
            <li>{squad2Name} has better chemistry between players</li>
          )}
        </ul>
      </div>

      {/* Position-by-Position Comparison */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
          Position-by-Position
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {squad1.players.map((player1, index) => {
            const player2 = squad2.players[index];
            
            if (!player1 && !player2) return null;

            return (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Position {index + 1}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    {player1 ? (
                      <div>
                        <div className="font-semibold text-blue-600">{player1.common_name || player1.last_name}</div>
                        <div className="text-xs">⭐ {player1.overall_rating}</div>
                      </div>
                    ) : (
                      <div className="text-gray-400 italic">Empty</div>
                    )}
                  </div>
                  <div className="px-2 text-gray-400">vs</div>
                  <div className="flex-1 text-right">
                    {player2 ? (
                      <div>
                        <div className="font-semibold text-purple-600">{player2.common_name || player2.last_name}</div>
                        <div className="text-xs">⭐ {player2.overall_rating}</div>
                      </div>
                    ) : (
                      <div className="text-gray-400 italic">Empty</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

