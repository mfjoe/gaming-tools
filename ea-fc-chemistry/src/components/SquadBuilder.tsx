import React, { useState } from 'react';
import { useSquadStore } from '../store/useSquadStore';
import { AlertTriangle, Download, Share2, Trash2 } from 'lucide-react';
import PitchView from './PitchView';

const FormationSelector: React.FC<any> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-4 py-3 border-2 border-ea-blue-500 rounded-lg bg-white text-gray-900 font-semibold text-lg shadow-lg hover:shadow-xl transition-all focus:ring-2 focus:ring-ea-blue-500 focus:outline-none"
  >
    <option value="4-3-3">4-3-3 (Attack)</option>
    <option value="4-4-2">4-4-2 (Flat)</option>
    <option value="4-2-3-1">4-2-3-1 (Wide)</option>
    <option value="4-3-2-1">4-3-2-1 (Diamond)</option>
    <option value="3-5-2">3-5-2 (Attacking)</option>
  </select>
);

const ChemistrySummary: React.FC<any> = ({ chemistry, rating, cost }) => {
  const chemPercentage = (chemistry / 33) * 100;
  const chemColor =
    chemPercentage >= 90
      ? 'from-chem-perfect to-ea-green-500'
      : chemPercentage >= 70
      ? 'from-chem-good to-yellow-500'
      : chemPercentage >= 50
      ? 'from-chem-okay to-orange-500'
      : 'from-chem-bad to-red-500';

  return (
    <div className="space-y-4">
      <div className={`p-6 bg-gradient-to-br ${chemColor} rounded-xl shadow-xl text-white`}>
        <div className="text-sm font-semibold mb-2 opacity-90">Squad Chemistry</div>
        <div className="text-5xl font-bold mb-1">{chemistry}/33</div>
        <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${chemPercentage}%` }}
          />
        </div>
      </div>
      <div className="p-6 bg-gradient-to-br from-fut-gold to-orange-500 rounded-xl shadow-xl text-white">
        <div className="text-sm font-semibold mb-2 opacity-90">Squad Rating</div>
        <div className="text-5xl font-bold">{rating || '--'}</div>
      </div>
      <div className="p-6 bg-gradient-to-br from-ea-blue-500 to-ea-blue-700 rounded-xl shadow-xl text-white">
        <div className="text-sm font-semibold mb-2 opacity-90">Total Value</div>
        <div className="text-3xl font-bold">{cost.toLocaleString()}</div>
        <div className="text-sm opacity-75">coins</div>
      </div>
    </div>
  );
};

export default function SquadBuilder({ initialSquad }: { initialSquad?: any }) {
  const {
    currentFormation,
    players,
    totalChemistry,
    totalRating,
    totalCost,
    setFormation,
    addPlayer,
    removePlayer,
    clearSquad,
  } = useSquadStore();

  const [showShareModal, setShowShareModal] = useState(false);

  const handleSlotClick = (slot: number) => {
    // TODO: Open PlayerSearchModal
    console.log('Slot clicked:', slot);
  };

  const handlePlayerRemove = (slot: number) => {
    removePlayer(slot);
  };

  const handleSaveSquad = () => {
    // TODO: Implement squad saving
    alert('Squad saving coming soon!');
  };

  const handleShareSquad = () => {
    setShowShareModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Squad Builder</h1>
          <p className="text-gray-600 mt-1">Build your Ultimate Team with real-time chemistry</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={clearSquad}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-105 shadow-lg flex items-center gap-2 font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={handleSaveSquad}
            className="px-4 py-2 bg-ea-blue-600 text-white rounded-lg hover:bg-ea-blue-700 transition-all hover:scale-105 shadow-lg flex items-center gap-2 font-semibold"
          >
            <Download className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleShareSquad}
            className="px-4 py-2 bg-ea-green-600 text-white rounded-lg hover:bg-ea-green-700 transition-all hover:scale-105 shadow-lg flex items-center gap-2 font-semibold"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pitch View (70%) */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Formation
            </label>
            <FormationSelector value={currentFormation} onChange={setFormation} />
          </div>

          <PitchView
            formation={currentFormation}
            players={players}
            onSlotClick={handleSlotClick}
            onPlayerRemove={handlePlayerRemove}
          />

          {/* Help Text */}
          <div className="mt-6 p-6 bg-gradient-to-br from-ea-blue-50 to-ea-green-50 rounded-xl border-2 border-ea-blue-200 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-ea-blue-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-gray-800">
              <p className="font-bold text-lg mb-2 text-ea-blue-700">Getting Started</p>
              <p className="mb-2">
                Click on player slots to search and add players from our database of 20,000+ players.
              </p>
              <p className="text-xs text-gray-600">
                The chemistry system will automatically calculate based on position, club, league, and nationality links.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Panel (30%) */}
        <div className="space-y-6">
          <ChemistrySummary
            chemistry={totalChemistry}
            rating={totalRating}
            cost={totalCost}
          />

          {/* Squad Progress */}
          <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Squad Progress
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Starting XI</span>
                  <span className="font-bold text-gray-900">
                    {players.filter((p) => p).length}/11
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-ea-blue-500 to-ea-green-500 rounded-full transition-all"
                    style={{ width: `${(players.filter((p) => p).length / 11) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chemistry Tips */}
          <div className="p-6 bg-gradient-to-br from-chem-perfect/10 to-ea-green-50 rounded-xl border-2 border-chem-perfect/30">
            <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Chemistry Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-chem-perfect font-bold">✓</span>
                <span><strong>Same Club:</strong> +2 chemistry per link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-chem-good font-bold">✓</span>
                <span><strong>Same League:</strong> +1 chemistry per link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-chem-good font-bold">✓</span>
                <span><strong>Same Nation:</strong> +1 chemistry per link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fut-icon font-bold">⭐</span>
                <span><strong>Icons & Heroes:</strong> Link to everyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 font-bold">•</span>
                <span>Max 3 chemistry points per player</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
