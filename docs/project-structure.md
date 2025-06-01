# Project Structure & Tech Stack

## 📁 Project Structure

```
mcp-server-lol/
├── src/                          # Source code
│   ├── index.ts                  # Main MCP server entry point
│   ├── core/                     # Base configurations and utilities
│   │   ├── config.ts             # Environment variables management
│   │   └── http-client.ts        # Custom HTTP client with timeout handling
│   ├── domains/                  # Feature-specific modules (DDD approach)
│   │   └── live/                 # League of Legends API domain
│   │       ├── tools.ts          # MCP tools definitions
│   │       ├── service.ts        # Business logic and API calls
│   │       ├── types.ts          # TypeScript type definitions
│   │       └── index.ts          # Domain exports
│   └── examples/                 # Usage examples and integration guides
├── docs/                         # Documentation
│   ├── features.md               # Detailed feature descriptions
│   ├── api-reference.md          # Complete API documentation
│   ├── project-structure.md      # This file
│   ├── examples/                 # Usage examples and guides
│   └── architecture/             # Architectural decisions and patterns
├── dist/                         # Compiled JavaScript output
├── node_modules/                 # Dependencies
├── .cursor/                      # Cursor IDE configuration
│   └── mcp.json                  # MCP server configuration
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── biome.json                    # Code quality configuration
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore patterns
├── LICENSE                       # GPL-3.0 license
└── README.md                     # Quick start guide
```

## 🏗️ Architecture Principles

### Domain-Driven Design (DDD)

The project follows DDD principles with clear domain boundaries:

- **`core/`** - Shared infrastructure and cross-cutting concerns
- **`domains/live/`** - League of Legends esports domain logic
- Each domain is self-contained with its own types, services, and tools

### Model Context Protocol (MCP)

Implements the MCP standard for AI agent integration:

- **Tools** - Executable functions for data retrieval
- **Prompts** - Context templates for AI assistants
- **Resources** - Static data and configuration

### Separation of Concerns

Clear layering with distinct responsibilities:

- **Tools Layer** (`tools.ts`) - MCP interface definitions
- **Service Layer** (`service.ts`) - Business logic and external API calls
- **Types Layer** (`types.ts`) - Data contracts and validation
- **Configuration** (`config.ts`) - Environment and settings management

## 🌐 Tech Stack

### Runtime & Language

- **Node.js** - JavaScript runtime with ESM module support
- **TypeScript** - Type-safe JavaScript with strict configuration
- **ES Modules (ESM)** - Modern module system for better tree-shaking

### MCP Framework

- **@modelcontextprotocol/sdk** - Official MCP SDK for server implementation
- **Standard MCP Interface** - Tools, prompts, and resources

### Data Validation & Schema

- **Zod** - Runtime type validation and schema definition
- **zod-to-json-schema** - Automatic JSON schema generation for MCP tools

### Code Quality & Development

- **Biome** - Fast linter and formatter (replaces ESLint + Prettier)
- **TypeScript Compiler** - Build system with watch mode for development

### Environment & Configuration

- **dotenv** - Environment variable management
- **Structured Configuration** - Type-safe configuration with validation

### HTTP & External APIs

- **Fetch API** - Native HTTP client for external API calls
- **Custom HTTP Client** - Wrapper with timeout and error handling
- **League of Legends Esports API** - Real-time esports data source

## 🔧 Development Workflow

### Build System

```bash
npm run build      # Compile TypeScript to JavaScript
npm run dev        # Development with watch mode
npm start          # Run compiled server
```

### Code Quality

```bash
npm run lint       # Check code style and potential issues
npm run format     # Format code automatically
npm run check      # Run both lint and format
```

### Quality Gates

- **TypeScript** - Compile-time type checking
- **Biome** - Runtime linting and formatting
- **Zod** - Runtime data validation
- **Git Hooks** - Pre-commit quality checks

## 🚀 Deployment Considerations

### Environment Variables

Required configuration through `.env` file:

- `LOL_API_BASE_URL` - League of Legends API endpoint
- `LOL_API_KEY` - API authentication (if required)
- `HTTP_TIMEOUT` - Request timeout configuration

### Distribution

- **ESM Build** - Modern JavaScript modules
- **Node.js Target** - Compatible with Node.js 18+
- **Cursor Integration** - Ready for MCP client configuration

### Security

- **Environment Isolation** - Sensitive data in environment variables
- **Input Validation** - All inputs validated with Zod schemas
- **HTTP Timeouts** - Protection against hanging requests
- **No Hardcoded Secrets** - All credentials externalized

## 📊 Performance Characteristics

### Lightweight Runtime

- **Minimal Dependencies** - Only essential packages included
- **Fast Startup** - Optimized for quick MCP server initialization
- **Memory Efficient** - Stateless design with minimal memory footprint

### Scalability Patterns

- **Stateless Design** - No server-side session management
- **External API Delegation** - Leverages external services for data
- **Caching Ready** - Architecture supports future caching layers
