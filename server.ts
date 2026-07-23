import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const COMPETITIONS = ['PL', 'PD', 'SA', 'BL1', 'FL1']; // Premier League, La Liga, Serie A, Bundesliga, Ligue 1

  app.get('/api/matches', async (req, res) => {
    try {
      const apiKey = process.env.FOOTBALL_DATA_API_KEY;
      const headers = { 'X-Auth-Token': apiKey || '' };

      const allMatches: any[] = [];

      for (const code of COMPETITIONS) {
        try {
          const [matchesRes, standingsRes] = await Promise.all([
            fetch(`https://api.football-data.org/v4/competitions/${code}/matches?status=SCHEDULED`, { headers }),
            fetch(`https://api.football-data.org/v4/competitions/${code}/standings`, { headers }),
          ]);

          const matchesData = await matchesRes.json();
          const standingsData = await standingsRes.json();
          const table = (standingsData.standings?.[0]?.table) || [];
          const rankOf = (teamId: number) => table.find((t: any) => t.team.id === teamId)?.position || 0;
          const formOf = (teamId: number) => {
            const raw = table.find((t: any) => t.team.id === teamId)?.form || '';
            return raw ? raw.split(',') : [];
          };

          const leagueMatches = (matchesData.matches || []).slice(0, 8).map((m: any) => {
            const homeRank = rankOf(m.homeTeam.id);
            const awayRank = rankOf(m.awayTeam.id);
            const homeForm = formOf(m.homeTeam.id);
            const awayForm = formOf(m.awayTeam.id);

            let primaryTip = 'Draw';
            if (homeRank && awayRank) {
              if (homeRank < awayRank) primaryTip = 'Home Win';
              else if (awayRank < homeRank) primaryTip = 'Away Win';
            }

            return {
              id: String(m.id),
              league: m.competition?.name || code,
              homeTeam: { name: m.homeTeam.name, logo: m.homeTeam.crest || '', form: homeForm, rank: homeRank },
              awayTeam: { name: m.awayTeam.name, logo: m.awayTeam.crest || '', form: awayForm, rank: awayRank },
              kickoffDateLabel: new Date(m.utcDate).toLocaleDateString(),
              kickoffTime: new Date(m.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              venue: m.venue || '',
              status: 'UPCOMING',
              odds: { homeWin: 0, draw: 0, awayWin: 0 },
              prediction: {
                primaryTip,
                secondaryTip: '',
                confidenceScore: homeRank && awayRank ? Math.min(95, Math.abs(homeRank - awayRank) * 5 + 50) : 0,
                confidenceLevel: 'STATS_BASED',
                homeWinProb: 0,
                drawProb: 0,
                awayWinProb: 0,
                over25Prob: 0,
                bttsProb: 0,
                aiReasoning: homeRank && awayRank
                  ? `Based on current league standings, ${homeRank < awayRank ? m.homeTeam.name : m.awayTeam.name} sits higher in the table (position ${Math.min(homeRank, awayRank)} vs ${Math.max(homeRank, awayRank)}).`
                  : 'Standings not yet available for this fixture (season may not have started).',
                keyFactors: [],
              },
              h2h: { totalMatches: 0, homeWins: 0, draws: 0, awayWins: 0, recentMatches: [] },
            };
          });

          allMatches.push(...leagueMatches);
        } catch (innerErr) {
          console.error(`Error fetching ${code}:`, innerErr);
        }
      }

      res.json({ matches: allMatches });
    } catch (err) {
      console.error('Fixture fetch error:', err);
      res.status(500).json({ matches: [], error: 'Could not fetch fixtures' });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Wandaa Predictions' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
