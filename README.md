# MCP Server League of Legends

MCP (Model Context Protocol) server to access League of Legends esports data in real-time. Provides information about live matches, schedules, leagues, event details, and VODs through a standardized interface.

## 🎯 Features

- **🔴 Live matches**: Monitor games happening right now
- **📅 Schedule**: View upcoming matches and events
- **🏆 Leagues**: Explore all available leagues by region
- **📊 Event details**: Complete information about specific matches
- **📺 VODs**: Access recordings of finished matches
- **⏭️ Upcoming matches**: List of future games

## 🎯 Prompt Templates

This MCP server includes intelligent prompt templates that help AI assistants provide better responses about League of Legends esports:

### Available Prompts

- **`lol-esports-system`** - Main system prompt with tool usage guidelines
- **`lol-live-matches`** - Specialized for live match queries
- **`lol-schedule`** - For schedule and tournament planning
- **`lol-leagues`** - League exploration and discovery
- **`lol-match-analysis`** - Detailed match analysis and VODs
- **`lol-troubleshooting`** - Error handling and alternatives
- **`lol-user-engagement`** - Enhanced user experience patterns

### How AI Assistants Use Prompts

AI assistants can access these prompts through the MCP protocol to:

- Understand context-specific response patterns
- Learn effective tool combinations
- Provide more engaging and accurate answers
- Handle edge cases and errors gracefully

### Example Usage in AI Assistants

```javascript
// AI assistant can request specific prompt context
const livePrompt = await mcp.getPrompt("lol-live-matches");
// Then combine with live match data for better responses
```

## 🚀 Quick Start

### 1. Installation

```bash
# Clone and install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### 2. Configuration

Edit the `.env` file with your settings:

```bash
# League of Legends eSports API Configuration
LOL_API_BASE_URL=https://esports-api.lolesports.com
LOL_API_KEY=your_api_key_here

# Server Configuration
HTTP_TIMEOUT=10000
```

### 3. Build and Run

```bash
# Build
npm run build

# Run
npm start

# Or development with watch mode
npm run dev
```

## ⚙️ Cursor Configuration

To use this MCP server in Cursor, configure the `.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "league-of-legends": {
      "command": "node",
      "args": ["./dist/index.js"],
      "cwd": "/path/to/your/mcp-server-lol",
      "env": {
        "NODE_ENV": "production",
        "LOL_API_BASE_URL": "https://esports-api.lolesports.com",
        "LOL_API_KEY": ""
      }
    }
  }
}
```

> **Note**: Replace `/path/to/your/mcp-server-lol` with the actual project path on your system.

## 🛠️ Available Tools

| Tool                   | Description            | Parameters                        |
| ---------------------- | ---------------------- | --------------------------------- |
| `get-schedule`         | LoL esports schedule   | `language`, `leagueId` (optional) |
| `get-live-matches`     | Live matches           | `language`                        |
| `get-leagues`          | Available leagues      | `language`, `region` (optional)   |
| `get-event-details`    | Specific event details | `eventId`, `language`             |
| `get-match-vods`       | Match VODs             | `eventId`, `language`             |
| `get-upcoming-matches` | Upcoming matches       | `language`, `limit`               |

### Supported Languages

`en-US`, `es-ES`, `fr-FR`, `de-DE`, `it-IT`, `pt-BR`, `ru-RU`, `tr-TR`, `ja-JP`, `ko-KR`, `zh-CN`, `zh-TW`

## 📁 Project Structure

```
src/
├── index.ts              # Main MCP server
├── core/                 # Base configurations
│   ├── config.ts         # Environment variables management
│   └── http-client.ts    # Custom HTTP client
├── domains/              # Specific functionalities
│   └── live/             # League of Legends API
│       ├── tools.ts      # MCP tools
│       ├── service.ts    # Business logic
│       ├── types.ts      # TypeScript types
│       └── index.ts      # Exports
└── examples/             # Usage examples
```

## 🔧 NPM Scripts

| Script           | Description                      |
| ---------------- | -------------------------------- |
| `npm run build`  | Compile TypeScript to JavaScript |
| `npm run dev`    | Development with watch mode      |
| `npm start`      | Run the compiled server          |
| `npm run lint`   | Run code linting                 |
| `npm run format` | Format code with Biome           |
| `npm run check`  | Complete lint + format           |

## 🌐 Tech Stack

- **Runtime**: Node.js with ESM
- **Language**: TypeScript
- **Protocol**: MCP (Model Context Protocol)
- **Validation**: Zod with JSON schema
- **Code Quality**: Biome (linting + formatting)
- **HTTP Client**: Custom fetch
- **Environment Management**: dotenv

## 🔒 Security

- All sensitive configurations are loaded via environment variables
- `.env` file included in `.gitignore`
- Mandatory validation of critical variables
- Configurable timeouts for HTTP requests

## 📄 License

ISC
