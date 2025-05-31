import { createHttpClient } from '../core/http-client.js';
import LiveService from '../domains/live/service.js';

async function liveServiceExamples(): Promise<void> {
  console.log('🎮 LoL Esports Live Service Examples\n');

  // Create service instance
  const client = createHttpClient({
    baseURL: 'https://esports-api.lolesports.com',
    timeout: 10000,
    apiKey: '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z',
  });

  const liveService = new LiveService(client);

  try {
    // Example 1: Get all leagues
    console.log('1. 📋 Getting all leagues...');
    const leagues = await liveService.getLeagues();
    console.log(`✅ Found ${leagues.length} leagues`);
    console.log(
      `First few leagues: ${leagues
        .slice(0, 3)
        .map((l) => l.name)
        .join(', ')}\n`
    );

    // Example 2: Get leagues by region
    console.log('2. 🌍 Getting leagues by region (AMERICAS)...');
    const americasLeagues = await liveService.getLeaguesByRegion('AMERICAS');
    console.log(`✅ Found ${americasLeagues.length} leagues in AMERICAS`);
    console.log(`AMERICAS leagues: ${americasLeagues.map((l) => l.name).join(', ')}\n`);

    // Example 3: Get available regions
    console.log('3. 🗺️ Getting all available regions...');
    const regions = await liveService.getAvailableRegions();
    console.log(`✅ Found ${regions.length} regions: ${regions.slice(0, 5).join(', ')}\n`);

    // Example 4: Check for live matches
    console.log('4. 🔴 Checking for live matches...');
    const hasLive = await liveService.hasLiveMatches();
    console.log(`✅ Live matches: ${hasLive ? 'YES' : 'NO'}\n`);

    // Example 5: Get live events
    console.log('5. 📺 Getting live events...');
    const liveEvents = await liveService.getLive();
    console.log(`✅ Found ${liveEvents.length} live events\n`);

    // Example 6: Get upcoming matches
    console.log('6. ⏭️ Getting upcoming matches...');
    const upcomingMatches = await liveService.getUpcomingMatches();
    console.log(`✅ Found ${upcomingMatches.length} upcoming matches`);

    if (upcomingMatches.length > 0) {
      const nextMatch = upcomingMatches[0];
      console.log(`Next match: ${nextMatch.league.name} - ${nextMatch.startTime}\n`);
    }

    // Example 7: Get completed matches
    console.log('7. ✅ Getting completed matches...');
    const completedMatches = await liveService.getCompletedMatches();
    console.log(`✅ Found ${completedMatches.length} completed matches\n`);

    // Example 8: Get event details (using a recent match ID)
    if (completedMatches.length > 0) {
      console.log('8. 🔍 Getting detailed event information...');
      const recentMatch = completedMatches[0];
      const eventDetails = await liveService.getEventDetails(recentMatch.match.id);

      console.log(`✅ Event details for ${eventDetails.league.name}:`);
      console.log(`   - Teams: ${eventDetails.match.teams.map((t) => t.name).join(' vs ')}`);
      console.log(`   - Games played: ${eventDetails.match.games.length}`);
      console.log(`   - Best of: ${eventDetails.match.strategy.count}\n`);

      // Example 9: Get VODs for the match
      console.log('9. 🎥 Getting VODs for the match...');
      const vods = await liveService.getMatchVODs(recentMatch.match.id);
      console.log(`✅ Found ${vods.length} VODs`);

      if (vods.length > 0) {
        const firstVOD = vods[0];
        console.log(`   - Provider: ${firstVOD.provider}`);
        console.log(`   - Language: ${firstVOD.mediaLocale.englishName}\n`);
      }
    }

    // Example 10: Get leagues by status
    console.log('10. ⭐ Getting selected leagues...');
    const selectedLeagues = await liveService.getLeaguesByStatus('selected');
    console.log(`✅ Found ${selectedLeagues.length} selected leagues`);
    console.log(`Selected: ${selectedLeagues.map((l) => l.name).join(', ')}\n`);

    // Example 11: Get matches for specific league (LCK)
    console.log('11. 🇰🇷 Getting LCK matches...');
    const lckMatches = await liveService.getMatchesForLeague('lck');
    console.log(`✅ Found ${lckMatches.length} LCK matches\n`);

    console.log('🎉 All Live Service examples completed successfully!');
  } catch (error) {
    console.error('❌ Error in Live Service examples:', error);
  }
}

// Export the example function
export { liveServiceExamples };

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  liveServiceExamples().catch(console.error);
}
