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
  prompts,
  getPromptByName,
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
    prompts: prompts.map((prompt) => ({
      name: prompt.name,
      description: prompt.description,
    })),
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name } = request.params;

  try {
    const prompt = getPromptByName(name);
    if (!prompt) {
      throw new Error(`Prompt ${name} not found`);
    }

    return {
      description: `League of Legends esports prompt: ${name}`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: prompt.content,
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
    `💬 Available prompts: ${prompts.map((p) => p.name).join(", ")}`
  );
}

// Execute main function
main().catch((error) => {
  console.error("💥 Server error:", error);
  process.exit(1);
});
