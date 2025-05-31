#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
// Import domain tools
import { tools as liveTools } from "./domains/live/index.js";

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

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const tool = liveTools.find((t) => t.name === name);
  if (!tool) {
    throw new Error(`Tool ${name} not found`);
  }

  try {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return await tool.handler(args || ({} as any));
  } catch (error) {
    throw new Error(`Error executing tool ${name}: ${error}`);
  }
});

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("🚀 LoL MCP Server running on stdio!");
  console.error(
    `📋 Available tools: ${liveTools.map((t) => t.name).join(", ")}`
  );
}

// Execute main function
main().catch((error) => {
  console.error("💥 Server error:", error);
  process.exit(1);
});
