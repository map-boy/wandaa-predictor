export default async function handler(req, res) {
  try {
    const apiKey = process.env.RAPIDAPI_KEY;
    const headers = {
      'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
      'x-rapidapi-key': apiKey || '',
    };

    const LEAGUES = [{ id: 47, name: 'Premier League' }];
    const allMatches = [];

    for (const league of LEAGUES) {
      const fixturesRes = await fetch(
        `https://free-api-live-football-data.p.rapidapi.com/football-get-all-matches-by-league?leagueid=${league.id}`,
        { headers }
      );
      const fixturesData = await fixturesRes.json();
      const allFixtures = fixturesData.response?.matches || fixturesData.response || [];
      const upcoming = (Array.isArray(allFixtures) ? allFixtures : []).slice(-15);

      const leagueMatches = upcoming.map((m) => {
        const kickoff = new Date(m.status?.utcTime || Date.now());
        const homeScore = m.home?.score ?? 0;
        const awayScore = m.away?.score ?? 0;
        let result = 'Draw';
        if (homeScore > awayScore) result = `${m.home?.name} Won`;
        else if (awayScore > homeScore) result = `${m.away?.name} Won`;

        return {
          id: String(m.id),
          league: league.name,
          leagueCountry: '',
          homeTeam: { name: m.home?.name || 'TBD', shortName: m.home?.name || 'TBD', logo: m.home?.id ? `https://images.fotmob.com/image_resources/logo/teamlogo/${m.home.id}_large.png` : '', form: [], rank: 0 },
          awayTeam: { name: m.away?.name || 'TBD', shortName: m.away?.name || 'TBD', logo: m.away?.id ? `https://images.fotmob.com/image_resources/logo/teamlogo/${m.away.id}_large.png` : '', form: [], rank: 0 },
          kickoffDateLabel: kickoff.toLocaleDateString(),
          kickoffTime: kickoff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          venue: '',
          status: 'FINISHED',
          odds: { homeWin: 0, draw: 0, awayWin: 0 },
          prediction: {
            primaryTip: result,
            secondaryTip: `Final Score: ${homeScore} - ${awayScore}`,
            confidenceScore: 100,
            confidenceLevel: 'RESULT',
            homeWinProb: 0,
            drawProb: 0,
            awayWinProb: 0,
            over25Prob: 0,
            bttsProb: 0,
            aiReasoning: `Match completed: ${m.home?.name} ${homeScore} - ${awayScore} ${m.away?.name}.`,
            keyFactors: [],
          },
          h2h: { totalMatches: 0, homeWins: 0, draws: 0, awayWins: 0, recentMatches: [] },
        };
      });

      allMatches.push(...leagueMatches);
    }

    res.status(200).json({ matches: allMatches });
  } catch (err) {
    console.error('Fixture fetch error:', err);
    res.status(500).json({ matches: [], error: 'Could not fetch fixtures' });
  }
}
