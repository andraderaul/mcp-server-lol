import { zodToJsonSchema } from "zod-to-json-schema";
import { httpConfig, lolConfig } from "../../core/config.js";
import { createHttpClient } from "../../core/http-client.js";
import type { HttpClient } from "../../core/http-client.js";
import {
  type GetEventDetailsInput,
  GetEventDetailsInputSchema,
  type GetLeaguesInput,
  GetLeaguesInputSchema,
  type GetLiveMatchesInput,
  GetLiveMatchesInputSchema,
  type GetMatchVODsInput,
  GetMatchVODsInputSchema,
  type GetScheduleInput,
  GetScheduleInputSchema,
  type GetUpcomingMatchesInput,
  GetUpcomingMatchesInputSchema,
} from "./types.js";
import { formatDate } from "../../core/utils/date.js";
import { capitalizeState } from "../../core/utils/strings.js";
import type { Team } from "./entities/team.entity.js";

// Import the domain factory from index
import { createLiveDomain } from "./factory.js";

const client = createHttpClient({
  baseURL: lolConfig.apiBaseUrl,
  timeout: httpConfig.timeout,
  apiKey: lolConfig.apiKey,
});

// Create domain with use cases
const liveDomain = createLiveDomain(client);

const getTeamsNames = (teams: Team[]) => {
  return {
    team1: teams?.[0]?.name || "TBD",
    team2: teams?.[1]?.name || "TBD",
  };
};

// Tool 1: Get Schedule
async function getScheduleTool(args: GetScheduleInput) {
  const schedule = await liveDomain.usecases.getSchedule.execute(
    args.language,
    args.leagueId
  );

  const scheduleText = schedule.events
    .map((event) => {
      const teams = event.match?.teams;
      const { team1, team2 } = getTeamsNames(teams);

      return (
        `🎮 ${event.league.name}: ${team1} vs ${team2}\n` +
        `📅 ${formatDate(event.startTime, args.language)}\n` +
        `🏆 ${event.blockName} - ${event.state}`
      );
    })
    .join("\n\n");

  return {
    content: [
      {
        type: "text" as const,
        text: `📋 LoL Esports Schedule (${args.language})\n\n${scheduleText}`,
      },
    ],
  };
}

// Tool 2: Get Live Matches
async function getLiveMatchesTool(args: GetLiveMatchesInput) {
  const liveEvents = await liveDomain.usecases.getLiveMatches.execute(
    args.language
  );

  if (liveEvents.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: "🔴 No live matches currently happening",
        },
      ],
    };
  }

  const liveText = liveEvents
    .map((event) => {
      const teams = event.match.teams;
      const { team1, team2 } = getTeamsNames(teams);

      return (
        `🔴 LIVE: ${event.league.name}\n` +
        `🎮 ${team1} vs ${team2}\n` +
        `🏆 ${event.blockName}`
      );
    })
    .join("\n\n");

  return {
    content: [
      {
        type: "text" as const,
        text: `🔴 Live Matches:\n\n${liveText}`,
      },
    ],
  };
}

// Tool 3: Get Leagues
async function getLeaguesTool(args: GetLeaguesInput) {
  let leagues: Awaited<
    ReturnType<typeof liveDomain.usecases.getLeagues.execute>
  >;

  if (args.region && args.region.trim() !== "") {
    leagues = await liveDomain.usecases.getLeagues.getByRegion(
      args.region,
      args.language
    );
  } else {
    leagues = await liveDomain.usecases.getLeagues.execute(args.language);
  }

  const leaguesText = leagues
    .map((league) => {
      return (
        `🏆 ${league.name} (${league.slug})\n` +
        `🌍 Region: ${league.region}\n` +
        `⭐ Status: ${league.displayPriority.status}`
      );
    })
    .join("\n\n");

  const title = args.region
    ? `🌍 Leagues in ${args.region}`
    : "🏆 All Available Leagues";

  return {
    content: [
      {
        type: "text" as const,
        text: `${title}\n\n${leaguesText}`,
      },
    ],
  };
}

// Tool 4: Get Event Details
async function getEventDetailsTool(args: GetEventDetailsInput) {
  try {
    const eventDetails = await liveDomain.usecases.getEventDetails.execute(
      args.eventId,
      args.language
    );

    const teams = eventDetails.match.teams;
    const games = eventDetails.match.games;

    let gamesText = "";
    if (games.length > 0) {
      gamesText = games
        .map((game) => {
          return `  Game ${game.number}: ${capitalizeState(game.state)} (${
            game.vods.length
          } VODs available)`;
        })
        .join("\n");
    }

    const teamsText = teams.map((t) => `${t.name} (${t.code})`).join(" vs ");
    const resultsText = teams
      .map((t) => `${t.name}: ${t.result.gameWins} wins`)
      .join(" | ");
    const totalVODs = games.reduce(
      (total, game) => total + game.vods.length,
      0
    );

    const detailsText =
      `🎮 ${eventDetails.league.name} Event Details\n\n` +
      `🏆 Tournament ID: ${eventDetails.tournament.id}\n` +
      `⚔️  Teams: ${teamsText}\n` +
      `📊 Results: ${resultsText}\n` +
      `🎯 Format: Best of ${eventDetails.match.strategy.count}\n\n` +
      `🎮 Games:\n${gamesText}\n\n` +
      `📺 Total VODs: ${totalVODs}`;

    return {
      content: [
        {
          type: "text" as const,
          text: detailsText,
        },
      ],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    const text = `❌ Failed to fetch event details for ID: "${args.eventId}"

      🔍 Error: ${errorMessage}
      
      💡 Troubleshooting tips:
         • Verify the event ID format is correct
         • Use get-schedule tool to find valid event IDs
         • Event might not exist or be too old
         • Try with a recently completed match
      
      📋 Event ID format examples:
         • Numeric: "110947234567890123"
         • String: "lck-2025-spring-finals-game1"
         • Check ${lolConfig.apiBaseUrl} for reference`;

    return {
      content: [
        {
          type: "text" as const,
          text,
        },
      ],
    };
  }
}

// Tool 5: Get Match VODs
async function getMatchVODsTool(args: GetMatchVODsInput) {
  try {
    const vods = await liveDomain.usecases.getEventDetails.getMatchVODs(
      args.eventId,
      args.language
    );

    if (vods.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `📺 No VODs available for event ${args.eventId}`,
          },
        ],
      };
    }

    const vodsText = vods
      .map((vod, index) => {
        return (
          `📺 VOD ${index + 1}:\n` +
          `🎥 Provider: ${vod.provider}\n` +
          `🌍 Language: ${vod.mediaLocale.englishName}\n` +
          `⏰ Duration: ${vod.firstFrameTime}\n` +
          `🔗 Parameter: ${vod.parameter}`
        );
      })
      .join("\n\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `📺 VODs for Event ${args.eventId}:\n\n${vodsText}`,
        },
      ],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    const text = `❌ Failed to fetch event details for ID: "${args.eventId}"

      🔍 Error: ${errorMessage}
      
      💡 Troubleshooting tips:
         • Verify the event ID format is correct
         • Use get-schedule tool to find valid event IDs
         • Event might not exist or be too old
         • Try with a recently completed match
      
      📋 Event ID format examples:
         • Numeric: "110947234567890123"
         • String: "lck-2025-spring-finals-game1"
         • Check ${lolConfig.apiBaseUrl} for reference`;

    return {
      content: [
        {
          type: "text" as const,
          text,
        },
      ],
    };
  }
}

// Tool 6: Get Upcoming Matches
async function getUpcomingMatchesTool(args: GetUpcomingMatchesInput) {
  const upcomingMatches = await liveDomain.usecases.getUpcomingMatches.execute(
    args.language,
    args.limit
  );

  if (upcomingMatches.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: "⏭️ No upcoming matches found",
        },
      ],
    };
  }

  const matchesText = upcomingMatches
    .map((event) => {
      const teams = event.match.teams;
      const { team1, team2 } = getTeamsNames(teams);

      return (
        `⏭️ ${event.league.name}: ${team1} vs ${team2}\n` +
        `📅 ${formatDate(event.startTime, args.language)}\n` +
        `🏆 ${event.blockName}`
      );
    })
    .join("\n\n");

  return {
    content: [
      {
        type: "text" as const,
        text: `⏭️ Upcoming Matches (Next ${upcomingMatches.length}):\n\n${matchesText}`,
      },
    ],
  };
}

// Export tool definitions for MCP server registration
export const tools = [
  {
    name: "get-schedule",
    description:
      "Get League of Legends esports schedule for a specific language",
    inputSchema: zodToJsonSchema(GetScheduleInputSchema),
    handler: getScheduleTool,
  },
  {
    name: "get-live-matches",
    description: "Get currently live League of Legends esports matches",
    inputSchema: zodToJsonSchema(GetLiveMatchesInputSchema),
    handler: getLiveMatchesTool,
  },
  {
    name: "get-leagues",
    description: "Get all available League of Legends esports leagues",
    inputSchema: zodToJsonSchema(GetLeaguesInputSchema),
    handler: getLeaguesTool,
  },
  {
    name: "get-event-details",
    description:
      "Get detailed information about a specific League of Legends esports event",
    inputSchema: zodToJsonSchema(GetEventDetailsInputSchema),
    handler: getEventDetailsTool,
  },
  {
    name: "get-match-vods",
    description:
      "Get VODs (Video on Demand) for a specific League of Legends esports match",
    inputSchema: zodToJsonSchema(GetMatchVODsInputSchema),
    handler: getMatchVODsTool,
  },
  {
    name: "get-upcoming-matches",
    description: "Get upcoming League of Legends esports matches",
    inputSchema: zodToJsonSchema(GetUpcomingMatchesInputSchema),
    handler: getUpcomingMatchesTool,
  },
] as const;
