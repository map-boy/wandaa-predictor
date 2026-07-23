import React from 'react';
import { UserPreferences, OddsFormat } from '../types';
import {
  Settings,
  ShieldCheck,
  Percent,
  Bell,
  Smartphone,
  Info,
  DollarSign,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface SettingsTabProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onOpenDisclaimer: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  preferences,
  onUpdatePreferences,
  onOpenDisclaimer,
}) => {
  return (
    <div className="space-y-6 pb-20 animate-fadeIn max-w-3xl mx-auto">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3">
        <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-white">App Settings & Preferences</h2>
          <p className="text-xs text-slate-400">Configure odds formats, notifications, and ad options</p>
        </div>
      </div>

      {/* Preferences Group 1: General Options */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Percent className="w-4 h-4 text-emerald-400" />
          Odds Format Preference
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {(['decimal', 'fractional', 'american'] as OddsFormat[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => onUpdatePreferences({ oddsFormat: fmt })}
              className={`py-2.5 px-3 rounded-xl font-extrabold text-xs capitalize transition border ${
                preferences.oddsFormat === fmt
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {fmt} ({fmt === 'decimal' ? '1.80' : fmt === 'fractional' ? '4/5' : '-125'})
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Bell className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-xs font-bold text-white block">Match Reminder Notifications</span>
              <span className="text-[11px] text-slate-400">Receive alerts before bookmarked kickoffs</span>
            </div>
          </div>
          <button
            onClick={() => onUpdatePreferences({ notificationsEnabled: !preferences.notificationsEnabled })}
            className={`w-11 h-6 rounded-full transition-colors p-1 ${
              preferences.notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                preferences.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Group 2: Google AdMob / AdSense Simulator */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            Google AdMob & Display Monetization Console
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Developer Mode
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Wandaa Predictions is monetized 100% through banner and interstitial display ads. No betting subscriptions, deposits, or paywalls exist.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Feed Banner Units</span>
            <span className="text-sm font-black text-white block mt-1">Every 3-4 Matches</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Match Detail Interstitial</span>
            <span className="text-sm font-black text-amber-400 block mt-1">On Navigation</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">AdMob Test Mode</span>
            <button
              onClick={() => onUpdatePreferences({ adMobTestMode: !preferences.adMobTestMode })}
              className="text-xs font-bold text-emerald-400 underline block mt-1"
            >
              {preferences.adMobTestMode ? 'Enabled (Test Ads Active)' : 'Disabled (Production Units)'}
            </button>
          </div>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
          <div className="text-amber-400 font-bold font-sans text-xs">Target Ad Unit Mapping:</div>
          <div>• Banner Feed: ca-app-pub-3904357053213893/1029384756</div>
          <div>• Interstitial Detail: ca-app-pub-3904357053213893/5839201948</div>
        </div>
      </div>

      {/* Group 3: Legal & Responsible Gaming */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Responsible Usage & Terms
        </h3>

        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <Info className="w-4 h-4 shrink-0" />
            <span>100% Free Informational Platform</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Wandaa Predictions provides sports statistics, team form evaluations, and algorithmic match previews for entertainment and statistical reference only. No real money betting or financial transactions occur on this service.
          </p>
          <button
            onClick={onOpenDisclaimer}
            className="text-xs font-extrabold text-emerald-400 underline pt-1 block"
          >
            Read Complete Disclaimer & Privacy Policy
          </button>
        </div>

        <div className="text-center pt-2 text-[11px] text-slate-500 font-mono">
          Wandaa Predictions Mobile v1.4.0 • Built with React & Tailwind CSS
        </div>
      </div>
    </div>
  );
};
