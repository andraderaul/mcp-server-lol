# API Reference

## 🛠️ Available Tools

### `get-schedule`

Get comprehensive League of Legends esports schedule with match details and timing information.

**Purpose**: Retrieve upcoming and scheduled LoL esports matches across different leagues and regions.

**Parameters**:

- `language` (optional): Language code for the schedule response (default: `en-US`)
- `leagueId` (optional): League ID to filter the schedule by

**Response**: Match titles with team information, precise match timing and dates, tournament/league context, match status and format details

**Best used for**: Planning viewing schedules, finding upcoming matches for specific leagues, checking tournament brackets and progression, getting localized date/time information

---

### `get-live-matches`

Get currently live League of Legends esports matches with real-time status.

**Purpose**: Find out which LoL esports matches are happening RIGHT NOW.

**Parameters**:

- `language` (optional): Language code for the live matches response (default: `en-US`)

**Response**: Currently broadcasting matches, league and tournament information, teams currently playing, live match context (playoffs, regular season, etc.)

**Best used for**: Finding live matches to watch immediately, checking if your favorite teams are playing now, getting current esports activity overview, discovering ongoing tournaments

---

### `get-leagues`

Get comprehensive list of League of Legends esports leagues and tournaments worldwide.

**Purpose**: Discover all available LoL esports leagues, their regions, and current status.

**Parameters**:

- `language` (optional): Language code for the leagues response (default: `en-US`)
- `region` (optional): Filter leagues by specific region (e.g., "AMERICAS", "EMEA", "ASIA")

**Response**: League names and official abbreviations, regional categorization (AMERICAS, EMEA, ASIA), league priority and status information, complete tournament ecosystem overview

**Best used for**: Exploring global LoL esports landscape, finding leagues by region, understanding tournament hierarchy, getting valid league IDs for other tools

---

### `get-event-details`

Get in-depth information about a specific League of Legends esports match or event.

**Purpose**: Deep dive into match details including teams, games, results, and available content.

**Parameters**:

- `eventId` (required): Unique identifier of the esports event (e.g., "110947234567890123" or "lck-2025-spring-finals")
- `language` (optional): Language code for the event details response (default: `en-US`)

**Response**: Complete team information and match results, individual game breakdowns and status, VOD availability for each game, tournament context and format details, win/loss records and series information

**Best used for**: Analyzing specific match outcomes, finding detailed game-by-game results, checking VOD availability before watching, understanding Best-of-X series progress

---

### `get-match-vods`

Get available VODs (Video on Demand) for a specific League of Legends esports match.

**Purpose**: Find all available video replays and broadcasts for a completed match.

**Parameters**:

- `eventId` (required): Unique identifier of the esports event to get VODs for
- `language` (optional): Language code for the VODs response (default: `en-US`)

**Response**: VOD providers and platforms, language-specific broadcasts, duration and timing information, direct access parameters for video content

**Best used for**: Finding match replays to watch later, locating multilingual broadcast options, checking VOD availability before event details, getting specific video access information

---

### `get-upcoming-matches`

Get the next upcoming League of Legends esports matches with customizable limit.

**Purpose**: Preview upcoming LoL esports matches in chronological order.

**Parameters**:

- `language` (optional): Language code for the upcoming matches response (default: `en-US`)
- `limit` (optional): Maximum number of upcoming matches to return (default: 10, max: 50)

**Response**: Next matches ordered by start time, teams and league information, scheduled timing details, tournament context for each match

**Best used for**: Planning your esports viewing schedule, getting a quick preview of upcoming action, finding the next important matches, setting viewing reminders

---

### `get-live-match-score`

Get real-time score and status for a live League of Legends esports match involving a specific team.

**Purpose**: Track live match progress and current score for matches involving your favorite teams.

**Parameters**:

- `teamName` (required): Name of the team to get score for
- `language` (optional): Language code for the live match score response (default: `en-US`)

**Response**: Current match score and series status, match title and context, event ID for detailed information, real-time competition status

**Best used for**: Following your favorite team's live performance, getting quick score updates during matches, checking series progression (Best-of-3, Best-of-5), monitoring ongoing competitive matches

## 🌍 Supported Languages

All tools support internationalization with the following language codes:

| Code    | Language            | Code    | Language              |
| ------- | ------------------- | ------- | --------------------- |
| `en-US` | English (US)        | `ru-RU` | Russian               |
| `es-ES` | Spanish (Spain)     | `tr-TR` | Turkish               |
| `fr-FR` | French (France)     | `ja-JP` | Japanese              |
| `de-DE` | German              | `ko-KR` | Korean                |
| `it-IT` | Italian             | `zh-CN` | Chinese (Simplified)  |
| `pt-BR` | Portuguese (Brazil) | `zh-TW` | Chinese (Traditional) |

## 🔗 Tool Combinations

### Common Workflows

**Live Match Monitoring**:

```
get-live-matches → get-live-match-score → get-event-details
```

**Tournament Planning**:

```
get-leagues → get-schedule → get-upcoming-matches
```

**Match Analysis**:

```
get-event-details → get-match-vods
```

**Team Following**:

```
get-live-match-score → get-upcoming-matches (filtered)
```
