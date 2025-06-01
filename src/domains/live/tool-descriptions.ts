/**
 * Rich tool descriptions for League of Legends Esports MCP Server
 *
 * These descriptions provide detailed information about each tool's functionality,
 * use cases, and expected outputs to help users and AI assistants utilize them effectively.
 */

export const toolDescriptions = {
  getSchedule: {
    name: "get-schedule",
    description: `Get comprehensive League of Legends esports schedule with match details and timing information.

🎯 **Purpose**: Retrieve upcoming and scheduled LoL esports matches across different leagues and regions.

📋 **What you get**:
- Match titles with team information
- Precise match timing and dates
- Tournament/league context
- Match status and format details

🔧 **Best used for**:
- Planning viewing schedules
- Finding upcoming matches for specific leagues
- Checking tournament brackets and progression
- Getting localized date/time information

💡 **Pro tip**: Use the leagueId parameter to filter results for specific tournaments like LCK, LEC, or LCS.`,

    examples: [
      "Show me today's LCK matches",
      "What LoL tournaments are happening this week?",
      "Get the schedule for LEC playoffs",
    ],
  },

  getLiveMatches: {
    name: "get-live-matches",
    description: `Get currently live League of Legends esports matches with real-time status.

🎯 **Purpose**: Find out which LoL esports matches are happening RIGHT NOW.

📋 **What you get**:
- Currently broadcasting matches
- League and tournament information
- Teams currently playing
- Live match context (playoffs, regular season, etc.)

🔧 **Best used for**:
- Finding live matches to watch immediately
- Checking if your favorite teams are playing now
- Getting current esports activity overview
- Discovering ongoing tournaments

💡 **Pro tip**: Returns empty if no matches are live - perfect for "what can I watch now?" queries.`,

    examples: [
      "Are there any LoL matches live right now?",
      "What esports is currently streaming?",
      "Show me live LoL tournaments",
    ],
  },

  getLeagues: {
    name: "get-leagues",
    description: `Get comprehensive list of League of Legends esports leagues and tournaments worldwide.

🎯 **Purpose**: Discover all available LoL esports leagues, their regions, and current status.

📋 **What you get**:
- League names and official abbreviations
- Regional categorization (AMERICAS, EMEA, ASIA)
- League priority and status information
- Complete tournament ecosystem overview

🔧 **Best used for**:
- Exploring global LoL esports landscape
- Finding leagues by region
- Understanding tournament hierarchy
- Getting valid league IDs for other tools

💡 **Pro tip**: Use the region parameter to focus on specific geographical areas like "AMERICAS" for LCS/LLA.`,

    examples: [
      "What LoL leagues are available in Europe?",
      "Show me all Asian LoL tournaments",
      "List all major League of Legends championships",
    ],
  },

  getEventDetails: {
    name: "get-event-details",
    description: `Get in-depth information about a specific League of Legends esports match or event.

🎯 **Purpose**: Deep dive into match details including teams, games, results, and available content.

📋 **What you get**:
- Complete team information and match results
- Individual game breakdowns and status
- VOD availability for each game
- Tournament context and format details
- Win/loss records and series information

🔧 **Best used for**:
- Analyzing specific match outcomes
- Finding detailed game-by-game results
- Checking VOD availability before watching
- Understanding Best-of-X series progress

💡 **Pro tip**: Event IDs can be found using get-schedule tool. Supports both numeric and string-based IDs.`,

    examples: [
      "Get details for the LCK finals match",
      "Show me game-by-game results for event 110947234567890123",
      "What happened in the T1 vs GenG series?",
    ],
  },

  getMatchVods: {
    name: "get-match-vods",
    description: `Get available VODs (Video on Demand) for a specific League of Legends esports match.

🎯 **Purpose**: Find all available video replays and broadcasts for a completed match.

📋 **What you get**:
- VOD providers and platforms
- Language-specific broadcasts
- Duration and timing information
- Direct access parameters for video content

🔧 **Best used for**:
- Finding match replays to watch later
- Locating multilingual broadcast options
- Checking VOD availability before event details
- Getting specific video access information

💡 **Pro tip**: Some matches may have multiple VODs in different languages or from different broadcast perspectives.`,

    examples: [
      "Find VODs for the latest Worlds finals",
      "Get replay videos for event lck-2025-spring-finals",
      "Show me available match recordings",
    ],
  },

  getUpcomingMatches: {
    name: "get-upcoming-matches",
    description: `Get the next upcoming League of Legends esports matches with customizable limit.

🎯 **Purpose**: Preview upcoming LoL esports matches in chronological order.

📋 **What you get**:
- Next matches ordered by start time
- Teams and league information
- Scheduled timing details
- Tournament context for each match

🔧 **Best used for**:
- Planning your esports viewing schedule
- Getting a quick preview of upcoming action
- Finding the next important matches
- Setting viewing reminders

💡 **Pro tip**: Use the limit parameter to control how many upcoming matches you want to see (1-50).`,

    examples: [
      "What are the next 5 LoL matches?",
      "Show me upcoming matches this weekend",
      "When is the next important LoL tournament match?",
    ],
  },

  getLiveMatchScore: {
    name: "get-live-match-score",
    description: `Get real-time score and status for a live League of Legends esports match involving a specific team.

🎯 **Purpose**: Track live match progress and current score for matches involving your favorite teams.

📋 **What you get**:
- Current match score and series status
- Match title and context
- Event ID for detailed information
- Real-time competition status

🔧 **Best used for**:
- Following your favorite team's live performance
- Getting quick score updates during matches
- Checking series progression (Best-of-3, Best-of-5)
- Monitoring ongoing competitive matches

💡 **Pro tip**: Provide team names like "T1", "G2", "Cloud9" to get their current live match status.`,

    examples: [
      "What's the current score for T1's match?",
      "How is GenG doing in their live game?",
      "Get live score for Cloud9",
    ],
  },
} as const;

/**
 * Helper function to get tool description by name
 */
export function getToolDescription(toolName: string) {
  const descriptions = Object.values(toolDescriptions);
  return descriptions.find((desc) => desc.name === toolName);
}

/**
 * Helper function to get all tool names
 */
export function getAllToolNames(): string[] {
  return Object.values(toolDescriptions).map((desc) => desc.name);
}
