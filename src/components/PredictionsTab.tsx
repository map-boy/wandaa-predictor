import React, { useState } from 'react';
import { Match, OddsFormat } from '../types';
import { Sparkles, Flame, ShieldAlert, Award, Layers } from 'lucide-react';
import { MatchCard } from './MatchCard';
import { AdBanner } from './AdBanner';

interface PredictionsTabProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  favorites: string[];
  onToggleFavorite: (matchId: string) => void;
  oddsFormat: OddsFormat;
}

export const PredictionsTab: React.FC<PredictionsTabProps> = ({
  matches,
  onSelectMatch,
  favorites,
  onToggleFavorite,
  oddsFormat,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'BANKER' | 'VALUE' | 'BTTS' | 'OVER_2_5'>('ALL');

  const filteredMatches = matches.filter((m) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'BANKER') return m.prediction.confidenceLevel === 'BANKER' || m.prediction.confidenceScore >= 88;
    if (activeCategory === 'VALUE') return m.prediction.confidenceLevel === 'VALUE';
    if (activeCategory === 'BTTS') return m.prediction.primaryTip === 'Both Teams To Score' || m.prediction.bttsProb >= 70;
    if (activeCategory === 'OVER_2_5') return m.prediction.primaryTip === 'Over 2.5 Goals' || m.prediction.over25Prob >= 70;
    return true;
  });

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Category Pills Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Curated Prediction Hub</h2>
            <p className="text-xs text-slate-400">Algorithmic tips grouped by strategy & probability</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activeCategory === 'ALL'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            🔥 All Daily Tips ({matches.length})
          </button>
          <button
            onClick={() => setActiveCategory('BANKER')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCategory === 'BANKER'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-emerald-400 hover:bg-slate-800 border border-emerald-500/30'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Bankers of the Day (85%+)</span>
          </button>
          <button
            onClick={() => setActiveCategory('VALUE')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCategory === 'VALUE'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-amber-400 hover:bg-slate-800 border border-amber-500/30'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>High Value Picks</span>
          </button>
          <button
            onClick={() => setActiveCategory('BTTS')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activeCategory === 'BTTS'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-cyan-300 hover:bg-slate-800 border border-cyan-500/30'
            }`}
          >
            Both Teams To Score
          </button>
          <button
            onClick={() => setActiveCategory('OVER_2_5')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              activeCategory === 'OVER_2_5'
                ? 'bg-purple-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-purple-300 hover:bg-slate-800 border border-purple-500/30'
            }`}
          >
            Over 2.5 Goals
          </button>
        </div>
      </div>

      {/* Featured Banner Slot */}
      <AdBanner slotId="ca-app-pub-3904357053213893/8811223344" title="Featured Prediction Sponsor" />

      {/* Match Cards List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
            No matches found for this prediction filter.
          </div>
        ) : (
          filteredMatches.map((match, idx) => (
            <React.Fragment key={match.id}>
              <MatchCard
                match={match}
                onSelectMatch={onSelectMatch}
                isFavorite={favorites.includes(match.id)}
                onToggleFavorite={onToggleFavorite}
                oddsFormat={oddsFormat}
              />
              {/* Insert ad banner every 3 items */}
              {(idx + 1) % 3 === 0 && (
                <AdBanner slotId={`ca-app-pub-3904357053213893/slot-${idx}`} />
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};
