import React from 'react';
import { Match, OddsFormat } from '../types';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { MatchCard } from './MatchCard';

interface FavoritesTabProps {
  matches: Match[];
  favorites: string[];
  onSelectMatch: (match: Match) => void;
  onToggleFavorite: (matchId: string) => void;
  onClearFavorites: () => void;
  oddsFormat: OddsFormat;
  onGoHome: () => void;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({
  matches,
  favorites,
  onSelectMatch,
  onToggleFavorite,
  onClearFavorites,
  oddsFormat,
  onGoHome,
}) => {
  const favoriteMatches = matches.filter((m) => favorites.includes(m.id));

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Saved Favorites</h2>
            <p className="text-xs text-slate-400">Your bookmarked matches & team tracking</p>
          </div>
        </div>

        {favoriteMatches.length > 0 && (
          <button
            onClick={onClearFavorites}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 rounded-xl text-xs font-semibold transition border border-slate-700"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Content */}
      {favoriteMatches.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Bookmarked Matches Yet</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              Tap the heart icon on any match card to save predictions and form insights for quick access.
            </p>
          </div>
          <button
            onClick={onGoHome}
            className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition inline-flex items-center gap-1.5"
          >
            <span>Browse Match Feed</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {favoriteMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelectMatch={onSelectMatch}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              oddsFormat={oddsFormat}
            />
          ))}
        </div>
      )}
    </div>
  );
};
