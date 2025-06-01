import { zodToJsonSchema } from "zod-to-json-schema";
import { httpConfig, lolConfig } from "../../core/config.js";
import { createHttpClient } from "../../core/http-client.js";
import type {
  GetEventDetailsInput,
  GetLeaguesInput,
  GetLiveMatchesInput,
  GetLiveMatchScoreInput,
  GetMatchVODsInput,
  GetScheduleInput,
  GetUpcomingMatchesInput,
} from "./types.js";
import {
  GetEventDetailsInputSchema,
  GetLeaguesInputSchema,
  GetLiveMatchesInputSchema,
  GetLiveMatchScoreInputSchema,
  GetMatchVODsInputSchema,
  GetScheduleInputSchema,
  GetUpcomingMatchesInputSchema,
} from "./types.js";
import { formatDate } from "../../core/utils/date.js";
import { capitalizeState } from "../../core/utils/strings.js";
import { toolDescriptions } from "./tool-descriptions.js";
import {
  handleToolError,
  formatErrorResponse,
  ErrorFactory,
} from "../../core/errors/mcp-errors.js";

// Import the domain factory from index
import { createLiveDomain } from "./factory.js";
import { MemoryCache } from "../../core/cache/memory-cache.js";

const client = createHttpClient({
  baseURL: lolConfig.apiBaseUrl,
  timeout: httpConfig.timeout,
  apiKey: lolConfig.apiKey,
});

const cache = new MemoryCache();

// Create domain with use cases
const liveDomain = createLiveDomain(client, cache);

// Tool 1: Get Schedule
async function getScheduleTool(args: GetScheduleInput) {
  try {
    const matchEvents =
      await liveDomain.usecases.getSchedule.getMatchEventsOnly(
        args.language,
        args.leagueId
      );

    const scheduleText = matchEvents
      .map((event) => {
        return (
          `🎮 ${event.league.name}: ${event.match.getMatchTitle()}\n` +
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
  } catch (error) {
    const mcpError = handleToolError(error, "get-schedule", {
      language: args.language,
    });
    return formatErrorResponse(mcpError);
  }
}

// Tool 2: Get Live Matches
async function getLiveMatchesTool(args: GetLiveMatchesInput) {
  try {
    const liveMatchEvents =
      await liveDomain.usecases.getLiveMatches.getLiveMatchEventsOnly(
        args.language
      );

    if (liveMatchEvents.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: "🔴 No live matches currently happening",
          },
        ],
      };
    }

    const liveText = liveMatchEvents
      .map((event) => {
        return (
          `🔴 LIVE: ${event.league.name}\n` +
          `🎮 ${event.match.getMatchTitle()}\n` +
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
  } catch (error) {
    const mcpError = handleToolError(error, "get-live-matches", {
      language: args.language,
    });
    return formatErrorResponse(mcpError);
  }
}

// Tool 3: Get Leagues
async function getLeaguesTool(args: GetLeaguesInput) {
  try {
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
  } catch (error) {
    const mcpError = handleToolError(error, "get-leagues", {
      language: args.language,
    });
    return formatErrorResponse(mcpError);
  }
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
    // Special handling for event not found errors
    if (error instanceof Error && error.message.includes("not found")) {
      const eventNotFoundError = ErrorFactory.eventNotFound(
        args.eventId,
        "get-event-details"
      );
      return formatErrorResponse(eventNotFoundError);
    }

    const mcpError = handleToolError(error, "get-event-details", {
      eventId: args.eventId,
      language: args.language,
    });
    return formatErrorResponse(mcpError);
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
    // Special handling for event not found errors
    if (error instanceof Error && error.message.includes("not found")) {
      const eventNotFoundError = ErrorFactory.eventNotFound(
        args.eventId,
        "get-match-vods"
      );
      return formatErrorResponse(eventNotFoundError);
    }

    const mcpError = handleToolError(error, "get-match-vods", {
      eventId: args.eventId,
      language: args.language,
    });
    return formatErrorResponse(mcpError);
  }
}

// Tool 6: Get Upcoming Matches
async function getUpcomingMatchesTool(args: GetUpcomingMatchesInput) {
  try {
    const upcomingMatchEvents =
      await liveDomain.usecases.getUpcomingMatches.getUpcomingMatchEventsOnly(
        args.language,
        args.limit
      );

    if (upcomingMatchEvents.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: "⏭️ No upcoming matches found",
          },
        ],
      };
    }

    const matchesText = upcomingMatchEvents
      .map((event) => {
        return (
          `⏭️ ${event.league.name}: ${event.match.getMatchTitle()}\n` +
          `📅 ${formatDate(event.startTime, args.language)}\n` +
          `🏆 ${event.blockName}`
        );
      })
      .join("\n\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `⏭️ Upcoming Matches (Next ${upcomingMatchEvents.length}):\n\n${matchesText}`,
        },
      ],
    };
  } catch (error) {
    const mcpError = handleToolError(error, "get-upcoming-matches", {
      language: args.language,
    });
    return formatErrorResponse(mcpError);
  }
}

//Tool 7: Get Live Match Score
async function getLiveMatchScoreTool(args: GetLiveMatchScoreInput) {
  try {
    const liveMatchScore =
      await liveDomain.usecases.getLiveMatches.getLiveMatchScore(
        args.teamName,
        args.language
      );

    if (liveMatchScore.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: "🔴 No live match score found",
          },
        ],
      };
    }

    const liveMatchScoreText = liveMatchScore
      .map((match) => {
        return (
          `🔴 Live Match Title: ${match.title}\n` +
          `📊 Score: ${match.score}\n` +
          `🔗 Event ID: ${match.eventId}\n\n`
        );
      })
      .join("\n\n");

    return {
      content: [
        {
          type: "text" as const,
          text: liveMatchScoreText,
        },
      ],
    };
  } catch (error) {
    const mcpError = handleToolError(error, "get-live-match-score", {
      teamName: args.teamName,
      language: args.language,
    });
    return formatErrorResponse(mcpError);
  }
}

// Export tool definitions for MCP server registration
export const tools = [
  {
    name: toolDescriptions.getSchedule.name,
    description: toolDescriptions.getSchedule.description,
    inputSchema: zodToJsonSchema(GetScheduleInputSchema),
    handler: getScheduleTool,
  },
  {
    name: toolDescriptions.getLiveMatches.name,
    description: toolDescriptions.getLiveMatches.description,
    inputSchema: zodToJsonSchema(GetLiveMatchesInputSchema),
    handler: getLiveMatchesTool,
  },
  {
    name: toolDescriptions.getLeagues.name,
    description: toolDescriptions.getLeagues.description,
    inputSchema: zodToJsonSchema(GetLeaguesInputSchema),
    handler: getLeaguesTool,
  },
  {
    name: toolDescriptions.getEventDetails.name,
    description: toolDescriptions.getEventDetails.description,
    inputSchema: zodToJsonSchema(GetEventDetailsInputSchema),
    handler: getEventDetailsTool,
  },
  {
    name: toolDescriptions.getMatchVods.name,
    description: toolDescriptions.getMatchVods.description,
    inputSchema: zodToJsonSchema(GetMatchVODsInputSchema),
    handler: getMatchVODsTool,
  },
  {
    name: toolDescriptions.getUpcomingMatches.name,
    description: toolDescriptions.getUpcomingMatches.description,
    inputSchema: zodToJsonSchema(GetUpcomingMatchesInputSchema),
    handler: getUpcomingMatchesTool,
  },
  {
    name: toolDescriptions.getLiveMatchScore.name,
    description: toolDescriptions.getLiveMatchScore.description,
    inputSchema: zodToJsonSchema(GetLiveMatchScoreInputSchema),
    handler: getLiveMatchScoreTool,
  },
] as const;
