#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
// Import domain tools
import {
  tools as liveTools,
  resources,
  getResourceContent,
  promptTemplates,
} from "./domains/live/index.js";
import {
  ErrorFactory,
  handleToolError,
  formatErrorResponse,
} from "./core/errors/mcp-errors.js";

// Create and configure server
const server = new Server(
  {
    name: "lol-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: liveTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: resources.map((resource) => ({
      uri: resource.uri,
      name: resource.name,
      description: resource.description,
      mimeType: resource.mimeType,
    })),
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    const content = await getResourceContent(uri);

    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(content, null, 2),
        },
      ],
    };
  } catch (error) {
    const mcpError = handleToolError(error, "read-resource");
    return formatErrorResponse(mcpError);
  }
});

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "lol-esports-system",
        description:
          "System prompt for League of Legends esports assistant with tool usage guidelines",
      },
      {
        name: "lol-live-matches",
        description:
          "Specialized prompt for handling live match queries and real-time updates",
      },
      {
        name: "lol-schedule",
        description:
          "Prompt for schedule-related queries and tournament planning",
      },
      {
        name: "lol-leagues",
        description: "Prompt for league exploration and tournament discovery",
      },
      {
        name: "lol-match-analysis",
        description: "Prompt for detailed match analysis and VOD information",
      },
      {
        name: "lol-troubleshooting",
        description:
          "Prompt for handling errors and providing alternative solutions",
      },
      {
        name: "lol-user-engagement",
        description: "Prompt for enhancing user experience and engagement",
      },
      {
        name: "lol-quick-start",
        description: "Quick start guide for new users exploring LoL esports",
      },
      {
        name: "lol-team-tracking",
        description: "Guide for helping users follow specific teams",
      },
      {
        name: "lol-brackets-playoffs",
        description:
          "Information about tournament formats and playoff structures",
      },
      {
        name: "lol-regional-comparison",
        description:
          "Comparison of different regional leagues and their characteristics",
      },
      {
        name: "lol-practical-examples",
        description: "Practical examples of effective tool usage combinations",
      },
      {
        name: "lol-advanced-usage",
        description: "Advanced patterns for power users and complex queries",
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name } = request.params;

  try {
    let promptContent: string;

    switch (name) {
      case "lol-esports-system":
        promptContent = promptTemplates.systemPrompt;
        break;
      case "lol-live-matches":
        promptContent = promptTemplates.liveMatchesPrompt;
        break;
      case "lol-schedule":
        promptContent = promptTemplates.schedulePrompt;
        break;
      case "lol-leagues":
        promptContent = promptTemplates.leagueExplorationPrompt;
        break;
      case "lol-match-analysis":
        promptContent = promptTemplates.matchAnalysisPrompt;
        break;
      case "lol-troubleshooting":
        promptContent = promptTemplates.troubleshootingPrompt;
        break;
      case "lol-user-engagement":
        promptContent = promptTemplates.userEngagementPrompt;
        break;
      case "lol-quick-start":
        promptContent = promptTemplates.quickStartPrompt;
        break;
      case "lol-team-tracking":
        promptContent = promptTemplates.teamTrackingPrompt;
        break;
      case "lol-brackets-playoffs":
        promptContent = promptTemplates.bracketAndPlayoffsPrompt;
        break;
      case "lol-regional-comparison":
        promptContent = promptTemplates.regionalComparisonPrompt;
        break;
      case "lol-practical-examples":
        promptContent = promptTemplates.practicalExamplesPrompt;
        break;
      case "lol-advanced-usage":
        promptContent = promptTemplates.advancedUsagePrompt;
        break;
      default:
        throw new Error(`Prompt ${name} not found`);
    }

    return {
      description: `League of Legends esports prompt: ${name}`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: promptContent,
          },
        },
      ],
    };
  } catch (error) {
    const mcpError = handleToolError(error, "get-prompt");
    return formatErrorResponse(mcpError);
  }
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const tool = liveTools.find((t) => t.name === name);
  if (!tool) {
    const error = ErrorFactory.toolNotFound(name);
    return formatErrorResponse(error);
  }

  try {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return await tool.handler(args || ({} as any));
  } catch (error) {
    const mcpError = handleToolError(error, name);
    return formatErrorResponse(mcpError);
  }
});

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("🚀 LoL MCP Server running on stdio!");
  console.error(
    `📋 Available tools: ${liveTools.map((t) => t.name).join(", ")}`
  );
  console.error(
    `📚 Available resources: ${resources.map((r) => r.uri).join(", ")}`
  );
  console.error(
    "💬 Available prompts: lol-esports-system, lol-live-matches, lol-schedule, lol-leagues, lol-match-analysis, lol-troubleshooting, lol-user-engagement"
  );
}

// Execute main function
main().catch((error) => {
  console.error("💥 Server error:", error);
  process.exit(1);
});
