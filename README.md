# MCP Server League of Legends

MCP (Model Context Protocol) server to access League of Legends esports data in real-time. Provides information about live matches, schedules, leagues, event details, and VODs through a standardized interface.

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
| `get-live-match-score` | Live team scores       | `teamName`, `language`            |

### Supported Languages

`en-US`, `es-ES`, `fr-FR`, `de-DE`, `it-IT`, `pt-BR`, `ru-RU`, `tr-TR`, `ja-JP`, `ko-KR`, `zh-CN`, `zh-TW`

## 📚 Documentation

For detailed information about features, architecture, and advanced usage:

- **[Features & Functionality](docs/features.md)** - Detailed feature descriptions and prompt templates
- **[API Reference](docs/api-reference.md)** - Complete documentation of all tools and parameters
- **[Project Structure](docs/project-structure.md)** - Architecture, tech stack, and development workflow

## 🔧 NPM Scripts

| Script           | Description                      |
| ---------------- | -------------------------------- |
| `npm run build`  | Compile TypeScript to JavaScript |
| `npm run dev`    | Development with watch mode      |
| `npm start`      | Run the compiled server          |
| `npm run lint`   | Run code linting                 |
| `npm run format` | Format code with Biome           |
| `npm run check`  | Complete lint + format           |

## 🔒 Security

- All sensitive configurations are loaded via environment variables
- `.env` file included in `.gitignore`
- Mandatory validation of critical variables
- Configurable timeouts for HTTP requests

## 📄 License

GPL-3.0 - see the [LICENSE](LICENSE) file for details.
