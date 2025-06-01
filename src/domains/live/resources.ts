/**
 * MCP Resources for League of Legends Esports
 *
 * Provides cached data that can be accessed directly without tool calls,
 * useful for AI assistants to have quick access to current LoL esports information.
 */

import { createLiveDomain } from "./factory.js";
import { createHttpClient } from "../../core/http-client.js";
import { MemoryCache } from "../../core/cache/memory-cache.js";
import { httpConfig, lolConfig } from "../../core/config.js";
import { formatDate } from "../../core/utils/date.js";

const client = createHttpClient({
  baseURL: lolConfig.apiBaseUrl,
  timeout: httpConfig.timeout,
  apiKey: lolConfig.apiKey,
});

const cache = new MemoryCache();
const liveDomain = createLiveDomain(client, cache);

export interface MCPResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

/**
 * Available resources for the MCP server
 */
export const resources: MCPResource[] = [
  {
    uri: "lol://leagues/all",
    name: "All LoL Esports Leagues",
    description:
      "Complete list of all available League of Legends esports leagues and tournaments worldwide with regional information",
    mimeType: "application/json",
  },
  {
    uri: "lol://leagues/major",
    name: "Major LoL Esports Leagues",
    description:
      "List of major League of Legends esports leagues (LCK, LEC, LCS, LPL) with current status",
    mimeType: "application/json",
  },
  {
    uri: "lol://matches/live",
    name: "Current Live Matches",
    description:
      "Real-time information about currently ongoing League of Legends esports matches",
    mimeType: "application/json",
  },
  {
    uri: "lol://matches/upcoming",
    name: "Upcoming Matches Today",
    description:
      "Today's upcoming League of Legends esports matches with timing and league information",
    mimeType: "application/json",
  },
  {
    uri: "lol://schedule/week",
    name: "This Week's Schedule",
    description:
      "Complete schedule of League of Legends esports matches for the current week",
    mimeType: "application/json",
  },
  {
    uri: "lol://status/summary",
    name: "LoL Esports Status Summary",
    description:
      "Quick overview of current LoL esports activity including live matches count, upcoming matches, and major leagues status",
    mimeType: "application/json",
  },
];

/**
 * Resource handlers for different URI patterns
 */
export async function getResourceContent(uri: string): Promise<unknown> {
  const language = "en-US"; // Default language for resources

  switch (uri) {
    case "lol://leagues/all":
      return await getAllLeagues(language);

    case "lol://leagues/major":
      return await getMajorLeagues(language);

    case "lol://matches/live":
      return await getLiveMatches(language);

    case "lol://matches/upcoming":
      return await getUpcomingMatchesToday(language);

    case "lol://schedule/week":
      return await getWeekSchedule(language);

    case "lol://status/summary":
      return await getStatusSummary(language);

    default:
      throw new Error(`Resource not found: ${uri}`);
  }
}

/**
 * Get all available leagues
 */
async function getAllLeagues(language: string) {
  try {
    const leagues = await liveDomain.usecases.getLeagues.execute(language);

    return {
      data: leagues.map((league) => ({
        id: league.id,
        name: league.name,
        slug: league.slug,
        region: league.region,
        status: league.displayPriority.status,
        priority: league.displayPriority.position,
      })),
      totalCount: leagues.length,
      lastUpdated: new Date().toISOString(),
      regions: [...new Set(leagues.map((l) => l.region))].sort(),
    };
  } catch (error) {
    return {
      error: "Failed to fetch leagues data",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get major leagues only
 */
async function getMajorLeagues(language: string) {
  try {
    const leagues = await liveDomain.usecases.getLeagues.execute(language);

    // Filter major leagues (typically the ones with highest priority)
    const majorLeagues = leagues
      .filter((league) => league.displayPriority.position <= 10)
      .sort((a, b) => a.displayPriority.position - b.displayPriority.position);

    return {
      data: majorLeagues.map((league) => ({
        id: league.id,
        name: league.name,
        slug: league.slug,
        region: league.region,
        status: league.displayPriority.status,
        priority: league.displayPriority.position,
      })),
      totalCount: majorLeagues.length,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    return {
      error: "Failed to fetch major leagues data",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get currently live matches
 */
async function getLiveMatches(language: string) {
  try {
    const liveMatchEvents =
      await liveDomain.usecases.getLiveMatches.getLiveMatchEventsOnly(language);

    return {
      data: liveMatchEvents.map((event) => ({
        league: {
          name: event.league.name,
          slug: event.league.slug,
        },
        match: {
          title: event.match.getMatchTitle(),
          teams: event.match.teams.map((team) => ({
            name: team.name,
            code: team.code,
            wins: team.result.gameWins,
          })),
        },
        blockName: event.blockName,
        state: event.state,
        startTime: event.startTime,
      })),
      totalCount: liveMatchEvents.length,
      lastUpdated: new Date().toISOString(),
      isLive: liveMatchEvents.length > 0,
    };
  } catch (error) {
    return {
      error: "Failed to fetch live matches data",
      message: error instanceof Error ? error.message : "Unknown error",
      totalCount: 0,
      isLive: false,
    };
  }
}

/**
 * Get today's upcoming matches
 */
async function getUpcomingMatchesToday(language: string) {
  try {
    const upcomingEvents =
      await liveDomain.usecases.getUpcomingMatches.getUpcomingMatchEventsOnly(
        language,
        20
      );

    // Filter for today's matches
    const today = new Date();
    const todayStr = today.toDateString();

    const todayMatches = upcomingEvents.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === todayStr;
    });

    return {
      data: todayMatches.map((event) => ({
        league: {
          name: event.league.name,
          slug: event.league.slug,
        },
        match: {
          title: event.match.getMatchTitle(),
          teams: event.match.teams.map((team) => ({
            name: team.name,
            code: team.code,
          })),
        },
        blockName: event.blockName,
        startTime: event.startTime,
        formattedTime: formatDate(event.startTime, language),
      })),
      totalCount: todayMatches.length,
      date: todayStr,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    return {
      error: "Failed to fetch upcoming matches data",
      message: error instanceof Error ? error.message : "Unknown error",
      totalCount: 0,
    };
  }
}

/**
 * Get this week's schedule
 */
async function getWeekSchedule(language: string) {
  try {
    const scheduleEvents =
      await liveDomain.usecases.getSchedule.getMatchEventsOnly(language);

    // Filter for this week's matches
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)

    const weekMatches = scheduleEvents.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });

    return {
      data: weekMatches.map((event) => ({
        league: {
          name: event.league.name,
          slug: event.league.slug,
        },
        match: {
          title: event.match.getMatchTitle(),
          teams: event.match.teams.map((team) => ({
            name: team.name,
            code: team.code,
          })),
        },
        blockName: event.blockName,
        state: event.state,
        startTime: event.startTime,
        formattedTime: formatDate(event.startTime, language),
      })),
      totalCount: weekMatches.length,
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    return {
      error: "Failed to fetch week schedule data",
      message: error instanceof Error ? error.message : "Unknown error",
      totalCount: 0,
    };
  }
}

/**
 * Get status summary
 */
async function getStatusSummary(language: string) {
  try {
    const [liveMatches, upcomingMatches, leagues] = await Promise.all([
      liveDomain.usecases.getLiveMatches.getLiveMatchEventsOnly(language),
      liveDomain.usecases.getUpcomingMatches.getUpcomingMatchEventsOnly(
        language,
        10
      ),
      liveDomain.usecases.getLeagues.execute(language),
    ]);

    // Get today's upcoming matches
    const today = new Date().toDateString();
    const todayUpcoming = upcomingMatches.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === today;
    });

    const majorLeagues = leagues.filter(
      (league) => league.displayPriority.position <= 10
    );

    return {
      summary: {
        liveMatchesCount: liveMatches.length,
        upcomingTodayCount: todayUpcoming.length,
        totalLeaguesCount: leagues.length,
        majorLeaguesCount: majorLeagues.length,
        hasLiveMatches: liveMatches.length > 0,
        hasUpcomingToday: todayUpcoming.length > 0,
      },
      liveMatches: liveMatches.map((event) => ({
        league: event.league.name,
        matchTitle: event.match.getMatchTitle(),
      })),
      nextMatches: upcomingMatches.slice(0, 3).map((event) => ({
        league: event.league.name,
        matchTitle: event.match.getMatchTitle(),
        startTime: formatDate(event.startTime, language),
      })),
      majorLeagues: majorLeagues.slice(0, 5).map((league) => ({
        name: league.name,
        region: league.region,
        status: league.displayPriority.status,
      })),
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    return {
      error: "Failed to fetch status summary",
      message: error instanceof Error ? error.message : "Unknown error",
      summary: {
        liveMatchesCount: 0,
        upcomingTodayCount: 0,
        totalLeaguesCount: 0,
        majorLeaguesCount: 0,
        hasLiveMatches: false,
        hasUpcomingToday: false,
      },
    };
  }
}
