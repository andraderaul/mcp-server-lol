# MCP Components Deep Dive

This guide explains the three core components of our MCP server architecture: **Prompts**, **Resources**, and **Tools**. Understanding these distinctions is crucial for building effective MCP servers.

## 🔧 Component Distinctions

### 🤖 Prompts

- **Interface**: Template-based system prompts
- **Format**: Natural language instructions with examples and guidelines
- **Use Case**: Guide AI assistants on how to use tools effectively and provide context
- **Consumption**: AI reads prompts to understand context, best practices, and usage patterns

### 📊 Resources

- **Interface**: URI-based access (`lol://leagues/all`)
- **Format**: Structured JSON with metadata
- **Use Case**: Quick reference data that AI can access directly without interaction
- **Consumption**: Bulk data access for immediate reference

### 🛠️ Tools

- **Interface**: Function-based with parameters (`get-live-match-score(teamName)`)
- **Format**: Formatted text for conversational responses
- **Use Case**: Parameterized actions based on user input
- **Consumption**: Interactive responses for user queries

## 📋 Component Comparison

| Aspect             | Prompts            | Resources         | Tools                   |
| ------------------ | ------------------ | ----------------- | ----------------------- |
| **Access Pattern** | Template injection | URI access        | Function calls          |
| **Data Format**    | Natural language   | Structured JSON   | Formatted text          |
| **Interaction**    | Static guidance    | Direct reference  | Parameterized           |
| **Caching**        | Not applicable     | ✅ Cached         | ✅ Cached               |
| **User Input**     | No                 | No                | Yes                     |
| **AI Consumption** | Context & guidance | Quick data lookup | Conversational response |

## 🎯 When to Use Each Component

### Use **Prompts** when:

- ✅ Providing AI guidance on tool usage
- ✅ Setting context and best practices
- ✅ Defining response patterns and engagement techniques
- ✅ Handling error scenarios and troubleshooting
- ✅ Specifying domain-specific knowledge

**Example**: Teaching the AI how to handle "What's happening in LoL esports right now?" queries.

### Use **Resources** when:

- ✅ Providing quick reference data
- ✅ Sharing structured information that rarely changes
- ✅ Offering bulk data access
- ✅ Supporting dashboard-like overviews
- ✅ Enabling fast data lookups without parameters

**Example**: AI quickly checking current esports status without making function calls.

### Use **Tools** when:

- ✅ User needs specific, parameterized information
- ✅ Dynamic queries based on user input
- ✅ Conversational responses are required
- ✅ Real-time or filtered data is needed
- ✅ Interactive assistance is the goal

**Example**: User asks "When does T1 play next?" - requires team parameter and conversational response.

## 🏗️ Architecture Patterns

### Complementary Design

Our architecture uses all three components together:

```
User Query: "What's happening in LoL esports right now?"

1. AI reads PROMPTS → Understands how to handle this query
2. AI checks RESOURCES → Gets quick status overview
3. AI calls TOOLS → Gets detailed live match information
4. AI provides comprehensive response
```

### Cache Strategy

Both Resources and Tools use caching because:

- **Performance**: Reduces API call latency
- **Rate Limiting**: Protects against external API limits
- **Reliability**: Enables temporary offline functionality
- **Consistency**: Ensures data coherence between components

**Note**: The distinction isn't "cached vs real-time" but rather "interface pattern and data format".

## 💡 Best Practices

### Prompt Design

```typescript
// ✅ Good: Specific, actionable guidance
{
  name: "lol-live-matches",
  description: "Specialized prompt for handling live match queries",
  content: `When users ask about live LoL matches, follow this approach:
  1. Check current live status using get-live-matches
  2. If matches are live: Provide league, teams, and tournament context
  3. If no live matches: Suggest checking upcoming matches`
}

// ❌ Avoid: Vague, generic instructions
{
  name: "general-help",
  content: "Help users with League of Legends questions"
}
```

### Resource Design

```typescript
// ✅ Good: Structured data with metadata
{
  data: leagues.map(league => ({
    id: league.id,
    name: league.name,
    region: league.region
  })),
  totalCount: leagues.length,
  lastUpdated: new Date().toISOString()
}

// ❌ Avoid: Raw data dumps
leagues
```

### Tool Design

```typescript
// ✅ Good: Conversational, formatted response
return {
  content: [
    {
      type: "text",
      text: `🔴 Live Matches:\n\n${liveText}`,
    },
  ],
};

// ❌ Avoid: Raw JSON responses
return { matches: liveMatches };
```

## 🚀 Industry Comparison

This architecture pattern is used by major platforms:

- **OpenAI GPTs**: Actions (Tools) + Knowledge (Resources) + Instructions (Prompts)
- **Microsoft Graph**: Custom URI schemes + Function calls + Documentation
- **Slack Apps**: Slash commands + App home data + Bot guidelines
- **GitHub Apps**: Webhooks + REST APIs + Bot instructions

## 🎯 Key Takeaways

1. **Each component serves a distinct purpose** - don't try to force one to do another's job
2. **They work together synergistically** - design them as a cohesive system
3. **Cache strategy is shared** - both Resources and Tools benefit from caching
4. **Type safety throughout** - use Zod schemas and TypeScript for reliability
5. **User experience matters** - format responses appropriately for each interface

## 📚 Further Reading

- [Usage Scenarios](../examples/usage-scenarios.md) - See these components in action
- [Caching Strategy](./caching.md) - Deep dive into our cache patterns
- [Error Handling](../best-practices/error-handling.md) - Robust error management across components
