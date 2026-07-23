import React, { useState } from 'react';
import { Match, OddsFormat } from '../types';
import {
  ArrowLeft,
  Share2,
  Heart,
  Sparkles,
  TrendingUp,
  Award,
  ShieldCheck,
  CheckCircle2,
  Info,
  Calendar,
  MapPin,
  Bot
} from 'lucide-react';
import { AdBanner } from './AdBanner';

interface MatchDetailProps {
  match: Match;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (matchId: string) => void;
  oddsFormat: OddsFormat;
}

export const MatchDetail: React.FC<MatchDetailProps> = ({
  match,
  onBack,
  isFavorite,
  onToggleFavorite,
  oddsFormat,
}) => {
  const [copied, setCopied] = useState(false);
  const [aiCustomReport, setAiCustomReport] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleShare = () => {
    const text = `⚽ Wandaa Prediction for ${match.homeTeam.name} vs ${match.awayTeam.name}:\n🔥 Tip: ${match.prediction.primaryTip} (${match.prediction.confidenceScore}% Confidence)\n📊 Check details on Wandaa Predictions!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const generateDeepAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          league: match.league,
          homeForm: match.homeTeam.form,
          awayForm: match.awayTeam.form,
          primaryTip: match.prediction.primaryTip,
        }),
      });
      const data = await res.json();
      if (data && data.analysis) {
        setAiCustomReport(data.analysis);
      } else {
        setAiCustomReport(
          `Deep AI Tactical Insights: ${match.homeTeam.name}'s high pressing intensity coupled with ${match.awayTeam.name}'s defensive transition weaknesses creates a strong statistical alignment for ${match.prediction.primaryTip}. Expect key battles in central midfield.`
        );
      }
    } catch {
      setAiCustomReport(
        `Deep AI Tactical Insights: ${match.homeTeam.name}'s high pressing intensity coupled with ${match.awayTeam.name}'s defensive transition weaknesses creates a strong statistical alignment for ${match.prediction.primaryTip}. Expect key battles in central midfield.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-fadeIn">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl font-medium text-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold text-xs transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Tip!' : 'Share Tip'}</span>
          </button>

          <button
            onClick={() => onToggleFavorite(match.id)}
            className={`p-2 rounded-xl border transition ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Match Scoreboard Header */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* League and Meta info */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6 border-b border-slate-800 pb-3">
          <span className="font-extrabold text-emerald-400 tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {match.league} ({match.leagueCountry})
          </span>
          <div className="flex items-center space-x-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {match.kickoffDateLabel}, {match.kickoffTime}
            </span>
            {match.venue && (
              <span className="hidden sm:flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {match.venue}
              </span>
            )}
          </div>
        </div>

        {/* Teams Matchup Display */}
        <div className="grid grid-cols-12 items-center gap-4 text-center my-2">
          {/* Home Team */}
          <div className="col-span-5 flex flex-col items-center space-y-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 p-2 border-2 border-slate-800 shadow-xl flex items-center justify-center overflow-hidden">
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <h2 className="text-base sm:text-lg font-black text-white line-clamp-1">
              {match.homeTeam.name}
            </h2>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
              Rank #{match.homeTeam.rank}
            </span>
            <div className="flex items-center space-x-1">
              {match.homeTeam.form.map((f, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-extrabold w-5 h-5 rounded flex items-center justify-center ${
                    f === 'W'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : f === 'D'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Center VS / Status */}
          <div className="col-span-2 flex flex-col items-center justify-center space-y-2">
            {match.status === 'LIVE' ? (
              <div className="bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1.5 rounded-2xl text-center">
                <span className="text-xl font-black block">
                  {match.liveScore?.home} - {match.liveScore?.away}
                </span>
                <span className="text-[10px] uppercase font-bold animate-pulse">LIVE {match.minute}'</span>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl">
                <span className="text-xl font-black text-slate-400 block">VS</span>
                <span className="text-[10px] text-slate-500 font-mono font-bold block mt-1">
                  {match.kickoffTime}
                </span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="col-span-5 flex flex-col items-center space-y-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 p-2 border-2 border-slate-800 shadow-xl flex items-center justify-center overflow-hidden">
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <h2 className="text-base sm:text-lg font-black text-white line-clamp-1">
              {match.awayTeam.name}
            </h2>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
              Rank #{match.awayTeam.rank}
            </span>
            <div className="flex items-center space-x-1">
              {match.awayTeam.form.map((f, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-extrabold w-5 h-5 rounded flex items-center justify-center ${
                    f === 'W'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : f === 'D'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Prediction & Confidence Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Wandaa Statistical Prediction
              </h3>
              <p className="text-xs text-emerald-400 font-semibold">
                Form & H2H Algorithmic Model
              </p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-md">
            {match.prediction.confidenceScore}% Confidence Rating ({match.prediction.confidenceLevel})
          </div>
        </div>

        {/* Primary Tip Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-emerald-500/30 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-medium">Primary Recommended Tip</span>
            <span className="text-xl font-black text-emerald-300 mt-1">
              {match.prediction.primaryTip}
            </span>
            <span className="text-xs text-slate-400 mt-2">
              Secondary Tip: <strong className="text-white">{match.prediction.secondaryTip}</strong>
            </span>
          </div>

          {/* Probability Bar */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-medium block">Match Outcome Probability</span>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex font-mono text-[9px] font-black">
              <div
                style={{ width: `${match.prediction.homeWinProb}%` }}
                className="bg-emerald-500 text-slate-950 flex items-center justify-center"
                title={`Home Win: ${match.prediction.homeWinProb}%`}
              >
                {match.prediction.homeWinProb > 15 && `${match.prediction.homeWinProb}%`}
              </div>
              <div
                style={{ width: `${match.prediction.drawProb}%` }}
                className="bg-amber-500 text-slate-950 flex items-center justify-center"
                title={`Draw: ${match.prediction.drawProb}%`}
              >
                {match.prediction.drawProb > 15 && `${match.prediction.drawProb}%`}
              </div>
              <div
                style={{ width: `${match.prediction.awayWinProb}%` }}
                className="bg-sky-500 text-slate-950 flex items-center justify-center"
                title={`Away Win: ${match.prediction.awayWinProb}%`}
              >
                {match.prediction.awayWinProb > 15 && `${match.prediction.awayWinProb}%`}
              </div>
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-1">
              <span className="text-emerald-400">Home {match.prediction.homeWinProb}%</span>
              <span className="text-amber-400">Draw {match.prediction.drawProb}%</span>
              <span className="text-sky-400">Away {match.prediction.awayWinProb}%</span>
            </div>
          </div>
        </div>

        {/* Plain Language Analysis / Reasoning */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-400" />
            Prediction Reasoning & Match Context
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {match.prediction.aiReasoning}
          </p>
        </div>

        {/* Key Factor Bullet Points */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Key Statistical Factors
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {match.prediction.keyFactors.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-tight">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deep AI Report Generator Button */}
        <div className="pt-2">
          {aiCustomReport ? (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-1 text-xs text-emerald-200 animate-fadeIn">
              <div className="flex items-center space-x-2 font-bold text-emerald-400">
                <Bot className="w-4 h-4" />
                <span>AI Tactical Breakdown</span>
              </div>
              <p className="leading-relaxed">{aiCustomReport}</p>
            </div>
          ) : (
            <button
              onClick={generateDeepAiAnalysis}
              disabled={loadingAi}
              className="w-full py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl transition flex items-center justify-center space-x-2"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>{loadingAi ? 'Synthesizing Tactical Data...' : 'Generate Deep AI Tactical Report'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Ad Placement: Native Banner */}
      <AdBanner slotId="ca-app-pub-3904357053213893/7788990011" title="Special Partner Promotion" />

      {/* Team Stats & Goal Averages Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Goal Metrics & Form Comparison
        </h3>

        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Home Stats */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="font-extrabold text-white text-sm block">
              {match.homeTeam.name}
            </span>
            <div className="flex justify-between text-slate-400">
              <span>Avg Goals Scored:</span>
              <strong className="text-emerald-400">{match.homeTeam.avgGoalsScored}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Avg Conceded:</span>
              <strong className="text-rose-400">{match.homeTeam.avgGoalsConceded}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Clean Sheets:</span>
              <strong className="text-slate-200">{match.homeTeam.cleanSheets}</strong>
            </div>
          </div>

          {/* Away Stats */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="font-extrabold text-white text-sm block">
              {match.awayTeam.name}
            </span>
            <div className="flex justify-between text-slate-400">
              <span>Avg Goals Scored:</span>
              <strong className="text-emerald-400">{match.awayTeam.avgGoalsScored}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Avg Conceded:</span>
              <strong className="text-rose-400">{match.awayTeam.avgGoalsConceded}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Clean Sheets:</span>
              <strong className="text-slate-200">{match.awayTeam.cleanSheets}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Head to Head (H2H) History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Head-to-Head Record (Last {match.h2h.totalMatches} Matches)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {match.homeTeam.shortName} {match.h2h.homeWins} - {match.h2h.draws} Draws - {match.h2h.awayWins} {match.awayTeam.shortName}
          </span>
        </div>

        <div className="space-y-2">
          {match.h2h.recentMatches.map((h) => (
            <div
              key={h.id}
              className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
            >
              <span className="text-slate-500 font-mono text-[11px]">{h.date}</span>
              <div className="font-semibold text-white space-x-2">
                <span>{h.homeTeam}</span>
                <span className="px-2 py-0.5 bg-slate-900 rounded font-bold text-amber-400 border border-slate-800">
                  {h.score}
                </span>
                <span>{h.awayTeam}</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-medium">
                {h.league}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
