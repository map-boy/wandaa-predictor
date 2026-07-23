import React, { useState, useEffect } from 'react';
import { Match, NavigationTab, UserPreferences, OddsFormat } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { MatchCard } from './components/MatchCard';
import { MatchDetail } from './components/MatchDetail';
import { PredictionsTab } from './components/PredictionsTab';
import { FavoritesTab } from './components/FavoritesTab';
import { SettingsTab } from './components/SettingsTab';
import { AdBanner } from './components/AdBanner';
import { AdInterstitial } from './components/AdInterstitial';
import { LegalDisclaimerModal } from './components/LegalDisclaimerModal';
import { Sparkles, Calendar, Filter, Flame, Award, ShieldCheck } from 'lucide-react';

export default function App() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch('/api/matches')
      .then((res) => res.json())
      .then((data) => setMatches(data.matches || []))
      .catch((err) => console.error('Failed to load matches:', err));
  }, []);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Filters
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');
  const [selectedDay, setSelectedDay] = useState<string>('ALL');

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wandaa_favorites');
      return saved ? JSON.parse(saved) : ['m1', 'm3'];
    } catch {
      return ['m1', 'm3'];
    }
  });

  // User preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('wandaa_preferences');
      return saved
        ? JSON.parse(saved)
        : {
            oddsFormat: 'decimal' as OddsFormat,
            notificationsEnabled: true,
            darkMode: true,
            favoriteTeamIds: [],
            bookmarkedMatchIds: [],
            adMobTestMode: true,
            adFrequency: 'standard',
          };
    } catch {
      return {
        oddsFormat: 'decimal' as OddsFormat,
        notificationsEnabled: true,
        darkMode: true,
        favoriteTeamIds: [],
        bookmarkedMatchIds: [],
        adMobTestMode: true,
        adFrequency: 'standard',
      };
    }
  });

  // Interstitial Ad Modal trigger state
  const [interstitialAdOpen, setInterstitialAdOpen] = useState(false);
  const [pendingMatch, setPendingMatch] = useState<Match | null>(null);

  // Disclaimer Modal
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wandaa_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Save preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wandaa_preferences', JSON.stringify(preferences));
    } catch (e) {
      console.error(e);
    }
  }, [preferences]);

  const toggleFavorite = (matchId: string) => {
    setFavorites((prev) =>
      prev.includes(matchId) ? prev.filter((id) => id !== matchId) : [...prev, matchId]
    );
  };

  const handleSelectMatchWithAd = (match: Match) => {
    // Occasionally trigger Interstitial Ad before navigating to detail view
    setPendingMatch(match);
    setInterstitialAdOpen(true);
  };

  const confirmNavigateToMatch = () => {
    if (pendingMatch) {
      setSelectedMatch(pendingMatch);
      setPendingMatch(null);
    }
    setInterstitialAdOpen(false);
  };

  const updatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  // Filter logic
  const leagues = ['ALL', 'Premier League', 'La Liga', 'UEFA Champions League', 'Serie A', 'Bundesliga', 'Ligue 1'];

  const filteredMatches = matches.filter((m) => {
    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchText = `${m.homeTeam.name} ${m.awayTeam.name} ${m.league} ${m.prediction.primaryTip}`.toLowerCase();
      if (!matchText.includes(query)) return false;
    }

    // League filter
    if (selectedLeague !== 'ALL' && m.league !== selectedLeague) {
      return false;
    }

    // Day filter
    if (selectedDay === 'TODAY' && m.kickoffDateLabel !== 'Today') return false;
    if (selectedDay === 'TOMORROW' && m.kickoffDateLabel !== 'Tomorrow') return false;
    if (selectedDay === 'LIVE' && m.status !== 'LIVE') return false;

    return true;
  });

  const bankerMatch = matches.find((m) => m.prediction?.confidenceLevel === 'BANKER') || matches[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top App Header */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        onOpenDisclaimer={() => setShowDisclaimerModal(true)}
        bookmarksCount={favorites.length}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-5">
        {selectedMatch ? (
          <MatchDetail
            match={selectedMatch}
            onBack={() => setSelectedMatch(null)}
            isFavorite={favorites.includes(selectedMatch.id)}
            onToggleFavorite={toggleFavorite}
            oddsFormat={preferences.oddsFormat}
          />
        ) : (
          <>
            {/* TAB CONTENT: HOME FEED */}
            {currentTab === 'home' && (
              <div className="space-y-6 pb-20 animate-fadeIn">
                {/* Banker of the Day Spotlight Hero */}
                {bankerMatch && !searchQuery && (
                  <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-md">
                          <Award className="w-3.5 h-3.5" />
                          Banker of the Day
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          Highest Confidence Pick ({bankerMatch.prediction.confidenceScore}%)
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-400">
                        {bankerMatch.league}
                      </span>
                    </div>

                    <div
                      onClick={() => handleSelectMatchWithAd(bankerMatch)}
                      className="cursor-pointer bg-slate-950/80 rounded-2xl p-4 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center -space-x-2">
                          <img
                            src={bankerMatch.homeTeam.logo}
                            alt={bankerMatch.homeTeam.name}
                            className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-950 p-0.5 object-contain"
                          />
                          <img
                            src={bankerMatch.awayTeam.logo}
                            alt={bankerMatch.awayTeam.name}
                            className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-950 p-0.5 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white">
                            {bankerMatch.homeTeam.name} vs {bankerMatch.awayTeam.name}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            Tip: <span className="text-emerald-300 font-bold">{bankerMatch.prediction.primaryTip}</span>
                          </p>
                        </div>
                      </div>

                      <button className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition shrink-0">
                        View Analysis & Stats
                      </button>
                    </div>
                  </div>
                )}

                {/* Filter Controls Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                  {/* Day Filter Tabs */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 text-xs">
                    <div className="flex items-center space-x-1.5 font-bold text-slate-300">
                      <Filter className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Match Schedule</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {[
                        { id: 'ALL', label: 'All Fixtures' },
                        { id: 'TODAY', label: 'Today' },
                        { id: 'TOMORROW', label: 'Tomorrow' },
                        { id: 'LIVE', label: 'Live Now' },
                      ].map((day) => (
                        <button
                          key={day.id}
                          onClick={() => setSelectedDay(day.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            selectedDay === day.id
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-950 text-slate-400 hover:text-white'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* League Filter Horizontal Scroll */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                    {leagues.map((lg) => (
                      <button
                        key={lg}
                        onClick={() => setSelectedLeague(lg)}
                        className={`px-3 py-1.5 rounded-xl font-extrabold whitespace-nowrap transition border ${
                          selectedLeague === lg
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {lg === 'ALL' ? 'ðŸŒ All Leagues' : lg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Match Cards List with Ad Placement every 3-4 items */}
                <div className="space-y-4">
                  {filteredMatches.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-2">
                      <p className="text-slate-300 font-bold text-sm">No matches found matching your filters.</p>
                      <button
                        onClick={() => {
                          setSelectedLeague('ALL');
                          setSelectedDay('ALL');
                          setSearchQuery('');
                        }}
                        className="text-xs text-emerald-400 underline font-semibold"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    filteredMatches.map((match, index) => (
                      <React.Fragment key={match.id}>
                        <MatchCard
                          match={match}
                          onSelectMatch={handleSelectMatchWithAd}
                          isFavorite={favorites.includes(match.id)}
                          onToggleFavorite={toggleFavorite}
                          oddsFormat={preferences.oddsFormat}
                        />

                        {/* Ad Placement Slot: Insert banner ad every 3-4 matches */}
                        {(index + 1) % 3 === 0 && (
                          <AdBanner
                            slotId={`ca-app-pub-3904357053213893/feed-${index}`}
                            title="Sponsor Offer â€¢ Wandaa Ads"
                          />
                        )}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PREDICTIONS */}
            {currentTab === 'predictions' && (
              <PredictionsTab
                matches={matches}
                onSelectMatch={handleSelectMatchWithAd}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                oddsFormat={preferences.oddsFormat}
              />
            )}

            {/* TAB CONTENT: FAVORITES */}
            {currentTab === 'favorites' && (
              <FavoritesTab
                matches={matches}
                favorites={favorites}
                onSelectMatch={handleSelectMatchWithAd}
                onToggleFavorite={toggleFavorite}
                onClearFavorites={() => setFavorites([])}
                oddsFormat={preferences.oddsFormat}
                onGoHome={() => setCurrentTab('home')}
              />
            )}

            {/* TAB CONTENT: SETTINGS */}
            {currentTab === 'settings' && (
              <SettingsTab
                preferences={preferences}
                onUpdatePreferences={updatePreferences}
                onOpenDisclaimer={() => setShowDisclaimerModal(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Sticky Mobile Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setSelectedMatch(null);
          setCurrentTab(tab);
        }}
        favoritesCount={favorites.length}
      />

      {/* Interstitial Ad Popup Modal */}
      <AdInterstitial
        isOpen={interstitialAdOpen}
        onClose={() => setInterstitialAdOpen(false)}
        onContinueToMatch={confirmNavigateToMatch}
      />

      {/* Legal & Terms Modal */}
      <LegalDisclaimerModal
        isOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
      />
    </div>
  );
}



