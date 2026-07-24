import React from 'react';
import { Match, OddsFormat } from '../types';
import { Heart, ChevronRight, TrendingUp, Sparkles, Clock, MapPin } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onSelectMatch: (match: Match) => void;
  isFavorite: boolean;
  onToggleFavorite: (matchId: string) => void;
  oddsFormat: OddsFormat;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onSelectMatch,
  isFavorite,
  onToggleFavorite,
  oddsFormat,
}) => {
  const getConfidenceBadgeColor = (level: string) => {
    switch (level) {
      case 'BANKER':
        return 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black';
      case 'VALUE':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'BTTS':
        return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    }
  };

  const formatOdd = (decimal: number) => {
    if (oddsFormat === 'american') {
      if (decimal >= 2.0) {
        return `+${Math.round((decimal - 1) * 100)}`;
      } else {
        return `${Math.round(-100 / (decimal - 1))}`;
      }
    }
    if (oddsFormat === 'fractional') {
      // rough fraction representation
      if (decimal === 2.0) return '1/1';
      if (decimal === 1.5) return '1/2';
      if (decimal === 2.5) return '6/4';
      if (decimal === 1.75) return '3/4';
      if (decimal === 3.5) return '5/2';
    }
    return decimal.toFixed(2);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-md hover:shadow-xl relative group">
      {/* Top Card Header: League & Status */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-300 tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {match.league}
          </span>
          <span className="text-slate-500">â€¢</span>
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            {match.kickoffDateLabel}, {match.kickoffTime}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {match.status === 'LIVE' ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              LIVE {match.minute}' ({match.liveScore?.home}-{match.liveScore?.away})
            </span>
          ) : (
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${getConfidenceBadgeColor(match.prediction.confidenceLevel)}`}>
              {match.prediction.confidenceScore}% {match.prediction.confidenceLevel}
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(match.id);
            }}
            className={`p-1.5 rounded-lg transition ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content Area (Clickable to open Match Detail) */}
      <div onClick={() => onSelectMatch(match)} className="cursor-pointer space-y-3">
        {/* Teams Matchup Grid */}
        <div className="grid grid-cols-12 items-center gap-2">
          {/* Home Team */}
          <div className="col-span-5 flex flex-col items-center text-center space-y-1.5">
            <div className="w-12 h-12 rounded-xl bg-slate-950 p-1 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-emerald-500/40 transition">
              {match.homeTeam.logo ? (
                <img
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                  className="w-full h-full object-contain rounded"
                  loading="lazy"
                />
              ) : (
                <span className="text-sm font-black text-slate-500">{match.homeTeam.shortName?.slice(0, 3) || match.homeTeam.name.slice(0, 3)}</span>
              )}
            </div>
            <span className="text-xs font-bold text-white line-clamp-1">
              {match.homeTeam.name}
            </span>
            <div className="flex items-center space-x-1">
              {match.homeTeam.form.map((res, i) => (
                <span
                  key={i}
                  className={`text-[9px] font-bold w-4 h-4 rounded flex items-center justify-center ${
                    res === 'W'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : res === 'D'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {res}
                </span>
              ))}
            </div>
          </div>

          {/* VS Divider / Score */}
          <div className="col-span-2 flex flex-col items-center justify-center text-center">
            {match.status === 'LIVE' ? (
              <div className="text-lg font-black text-white bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                {match.liveScore?.home} - {match.liveScore?.away}
              </div>
            ) : (
              <span className="text-xs font-black text-slate-500 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                VS
              </span>
            )}
            <span className="text-[10px] text-slate-400 font-mono mt-1">
              {formatOdd(match.odds.homeWin)} | {formatOdd(match.odds.draw)} | {formatOdd(match.odds.awayWin)}
            </span>
          </div>

          {/* Away Team */}
          <div className="col-span-5 flex flex-col items-center text-center space-y-1.5">
            <div className="w-12 h-12 rounded-xl bg-slate-950 p-1 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-emerald-500/40 transition">
              {match.awayTeam.logo ? (
                <img
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                  className="w-full h-full object-contain rounded"
                  loading="lazy"
                />
              ) : (
                <span className="text-sm font-black text-slate-500">{match.awayTeam.shortName?.slice(0, 3) || match.awayTeam.name.slice(0, 3)}</span>
              )}
            </div>
            <span className="text-xs font-bold text-white line-clamp-1">
              {match.awayTeam.name}
            </span>
            <div className="flex items-center space-x-1">
              {match.awayTeam.form.map((res, i) => (
                <span
                  key={i}
                  className={`text-[9px] font-bold w-4 h-4 rounded flex items-center justify-center ${
                    res === 'W'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : res === 'D'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {res}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Prediction Summary Pill */}
        <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Wandaa Tip</span>
              <span className="text-xs font-extrabold text-emerald-300">
                {match.prediction.primaryTip}
              </span>
            </div>
          </div>

          <div className="flex items-center text-xs font-bold text-slate-300 group-hover:text-emerald-400 transition space-x-1">
            <span>View Stats & Analysis</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

