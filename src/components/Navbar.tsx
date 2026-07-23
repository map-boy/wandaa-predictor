import React from 'react';
import { ShieldCheck, Search, Info, Flame } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  onOpenDisclaimer: () => void;
  bookmarksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  showSearch,
  setShowSearch,
  onOpenDisclaimer,
  bookmarksCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-900/80 via-emerald-800/90 to-slate-900 px-3 py-1 text-xs text-emerald-200 flex items-center justify-between border-b border-emerald-500/20">
        <div className="flex items-center space-x-1.5 font-medium truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">100% Free • No Real Money Gambling • Tips & Analysis</span>
        </div>
        <button
          onClick={onOpenDisclaimer}
          className="text-[11px] underline text-emerald-300 hover:text-white shrink-0 ml-2"
        >
          Disclaimer
        </button>
      </div>

      {/* Main Header */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md shadow-emerald-500/20">
            <Flame className="w-6 h-6 fill-slate-950 stroke-none" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-1.5 bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
              Wandaa <span className="text-emerald-400">Predictions</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Free Sports Match Tips & Form Analytics
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-lg transition-all ${
              showSearch
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Search matches or teams"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenDisclaimer}
            className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition"
            title="Info & Legal"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Search Field */}
      {showSearch && (
        <div className="px-4 pb-3 max-w-5xl mx-auto transition-all animate-fadeIn">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search teams (e.g. Arsenal, Real Madrid, Bayern)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
