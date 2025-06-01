# Features & Functionality

## 🎯 Core Features

### **🔴 Live Matches**

Monitor League of Legends esports games happening right now with real-time updates.

### **📅 Schedule Management**

View upcoming matches and events across all leagues and regions.

### **🏆 League Explorer**

Explore all available leagues organized by region (AMERICAS, EMEA, ASIA).

### **📊 Event Details**

Get comprehensive information about specific matches including teams, results, and match history.

### **📺 VOD Access**

Access recordings of finished matches with multiple language options.

### **⏭️ Upcoming Matches**

Get a customizable list of future games with scheduling details.

## 🎯 Intelligent Prompt Templates

This MCP server includes context-aware prompt templates that help AI assistants provide better responses about League of Legends esports:

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

## 🌍 Multi-Language Support

All tools support multiple languages for international esports coverage:

**Supported Languages**: `en-US`, `es-ES`, `fr-FR`, `de-DE`, `it-IT`, `pt-BR`, `ru-RU`, `tr-TR`, `ja-JP`, `ko-KR`, `zh-CN`, `zh-TW`

## 🛠️ Tool Integration Patterns

### Real-time Monitoring

```
get-live-matches → get-live-match-score → get-event-details
```

### Tournament Planning

```
get-leagues → get-schedule → get-upcoming-matches
```

### Match Analysis

```
get-event-details → get-match-vods → detailed analysis
```
