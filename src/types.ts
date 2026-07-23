export type FormResult = 'W' | 'D' | 'L';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  rank: number;
  form: FormResult[];
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  avgGoalsScored: number;
  avgGoalsConceded: number;
}

export interface MatchH2HItem {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  winner: 'home' | 'away' | 'draw';
  league: string;
}

export interface MatchH2H {
  totalMatches: number;
  homeWins: number;
  draws: number;
  awayWins: number;
  recentMatches: MatchH2HItem[];
}

export interface PredictionDetails {
  primaryTip: 'Home Win' | 'Draw' | 'Away Win' | 'Over 2.5 Goals' | 'Both Teams To Score' | 'Double Chance 1X' | 'Double Chance X2' | 'Under 2.5 Goals';
  secondaryTip: string;
  confidenceScore: number; // 0 - 100
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'VALUE' | 'BANKER' | 'BTTS';
  homeWinProb: number; // percentage
  drawProb: number; // percentage
  awayWinProb: number; // percentage
  over25Prob: number; // percentage
  bttsProb: number; // percentage
  aiReasoning: string;
  keyFactors: string[];
}

export interface MatchOdds {
  homeWin: number;
  draw: number;
  awayWin: number;
}

export type MatchStatus = 'UPCOMING' | 'LIVE' | 'FINISHED';

export interface Match {
  id: string;
  league: string;
  leagueCountry: string;
  leagueLogo: string;
  kickoffTime: string;
  kickoffDateLabel: string; // e.g. "Today", "Tomorrow", "Saturday"
  timestamp: string; // ISO String
  status: MatchStatus;
  minute?: number;
  liveScore?: {
    home: number;
    away: number;
  };
  homeTeam: Team;
  awayTeam: Team;
  prediction: PredictionDetails;
  h2h: MatchH2H;
  odds: MatchOdds;
  venue: string;
  referee?: string;
  featuredCategory?: 'BANKER' | 'VALUE' | 'BTTS' | 'OVER_2_5' | 'TOP_LEAGUE';
}

export type NavigationTab = 'home' | 'predictions' | 'favorites' | 'settings';

export type OddsFormat = 'decimal' | 'fractional' | 'american';

export interface UserPreferences {
  oddsFormat: OddsFormat;
  notificationsEnabled: boolean;
  darkMode: boolean;
  favoriteTeamIds: string[];
  bookmarkedMatchIds: string[];
  adMobTestMode: boolean;
  adFrequency: 'standard' | 'high' | 'minimal';
}

export interface AdUnitConfig {
  id: string;
  type: 'banner' | 'native' | 'interstitial';
  slotName: string;
  adUnitId: string;
  aspectRatio?: string;
  title?: string;
}
