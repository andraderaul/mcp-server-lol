/**
 * MCP Server Error Handling System
 *
 * Provides structured error handling with helpful messages and troubleshooting tips
 * for the League of Legends Esports MCP Server.
 */

export enum ErrorCode {
  // Tool execution errors
  TOOL_NOT_FOUND = "TOOL_NOT_FOUND",
  TOOL_EXECUTION_FAILED = "TOOL_EXECUTION_FAILED",
  INVALID_INPUT = "INVALID_INPUT",

  // API errors
  API_REQUEST_FAILED = "API_REQUEST_FAILED",
  API_TIMEOUT = "API_TIMEOUT",
  API_RATE_LIMITED = "API_RATE_LIMITED",

  // Data errors
  EVENT_NOT_FOUND = "EVENT_NOT_FOUND",
  NO_DATA_AVAILABLE = "NO_DATA_AVAILABLE",
  INVALID_EVENT_ID = "INVALID_EVENT_ID",

  // Cache errors
  CACHE_ERROR = "CACHE_ERROR",

  // General errors
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface ErrorContext {
  toolName?: string;
  eventId?: string;
  teamName?: string;
  language?: string;
  originalError?: Error;
  requestId?: string;
}

export class MCPError extends Error {
  public readonly code: ErrorCode;
  public readonly context: ErrorContext;
  public readonly troubleshooting: string[];
  public readonly isRetryable: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    context: ErrorContext = {},
    troubleshooting: string[] = [],
    isRetryable = false
  ) {
    super(message);
    this.name = "MCPError";
    this.code = code;
    this.context = context;
    this.troubleshooting = troubleshooting;
    this.isRetryable = isRetryable;
  }

  toUserFriendlyMessage(): string {
    const emoji = this.getErrorEmoji();
    const tips =
      this.troubleshooting.length > 0
        ? `\n\n💡 **Troubleshooting tips:**\n${this.troubleshooting
            .map((tip) => `   • ${tip}`)
            .join("\n")}`
        : "";

    return `${emoji} **Error**: ${this.message}${tips}`;
  }

  private getErrorEmoji(): string {
    switch (this.code) {
      case ErrorCode.TOOL_NOT_FOUND:
        return "🔧";
      case ErrorCode.EVENT_NOT_FOUND:
      case ErrorCode.NO_DATA_AVAILABLE:
        return "📭";
      case ErrorCode.API_REQUEST_FAILED:
      case ErrorCode.API_TIMEOUT:
        return "🌐";
      case ErrorCode.INVALID_INPUT:
      case ErrorCode.INVALID_EVENT_ID:
        return "⚠️";
      case ErrorCode.API_RATE_LIMITED:
        return "⏱️";
      default:
        return "❌";
    }
  }
}

/**
 * Factory functions for creating specific error types
 */
export namespace ErrorFactory {
  export function toolNotFound(toolName: string): MCPError {
    return new MCPError(
      ErrorCode.TOOL_NOT_FOUND,
      `Tool "${toolName}" not found`,
      { toolName },
      [
        "Check if the tool name is spelled correctly",
        "Use get-tools command to see available tools",
        "Verify the MCP server is properly configured",
      ]
    );
  }

  export function eventNotFound(eventId: string, toolName?: string): MCPError {
    return new MCPError(
      ErrorCode.EVENT_NOT_FOUND,
      `Event "${eventId}" not found`,
      { eventId, toolName },
      [
        "Verify the event ID format is correct",
        "Use get-schedule tool to find valid event IDs",
        "Event might be too old or not yet available",
        "Try with a recently completed or upcoming match",
        `Event ID examples: "110947234567890123" or "lck-2025-spring-finals"`,
      ]
    );
  }

  export function invalidEventId(eventId: string, toolName?: string): MCPError {
    return new MCPError(
      ErrorCode.INVALID_EVENT_ID,
      `Invalid event ID format: "${eventId}"`,
      { eventId, toolName },
      [
        'Event IDs should be numeric (e.g., "110947234567890123") or string-based (e.g., "lck-2025-spring-finals")',
        "Use get-schedule tool to find valid event IDs",
        "Check the API documentation for supported formats",
      ]
    );
  }

  export function apiRequestFailed(
    originalError: Error,
    toolName?: string
  ): MCPError {
    return new MCPError(
      ErrorCode.API_REQUEST_FAILED,
      `API request failed: ${originalError.message}`,
      { originalError, toolName },
      [
        "Check your internet connection",
        "Verify the LoL Esports API is operational",
        "Try again in a few moments",
        "Contact support if the issue persists",
      ],
      true // Retryable
    );
  }

  export function apiTimeout(toolName?: string): MCPError {
    return new MCPError(
      ErrorCode.API_TIMEOUT,
      "API request timed out",
      { toolName },
      [
        "The LoL Esports API is responding slowly",
        "Try again in a few moments",
        "Check your internet connection",
        "Consider using a different time period if applicable",
      ],
      true // Retryable
    );
  }

  export function rateLimited(toolName?: string): MCPError {
    return new MCPError(
      ErrorCode.API_RATE_LIMITED,
      "API rate limit exceeded",
      { toolName },
      [
        "Wait a few minutes before making another request",
        "The LoL Esports API has usage limits",
        "Consider reducing the frequency of requests",
      ],
      true // Retryable
    );
  }

  export function noDataAvailable(
    dataType: string,
    toolName?: string
  ): MCPError {
    return new MCPError(
      ErrorCode.NO_DATA_AVAILABLE,
      `No ${dataType} available`,
      { toolName },
      [
        `There might not be any ${dataType} at this time`,
        "Try checking at a different time",
        "Verify your search parameters",
        "Use other tools to explore available content",
      ]
    );
  }

  export function invalidInput(
    parameter: string,
    value: unknown,
    toolName?: string
  ): MCPError {
    return new MCPError(
      ErrorCode.INVALID_INPUT,
      `Invalid input for parameter "${parameter}": ${value}`,
      { toolName },
      [
        `Check the expected format for parameter "${parameter}"`,
        "Refer to the tool's input schema for valid values",
        "Use the tool's description for usage examples",
      ]
    );
  }

  export function toolExecutionFailed(
    originalError: Error,
    toolName: string
  ): MCPError {
    // Try to map common errors to more specific error types
    if (originalError.message.includes("timeout")) {
      return ErrorFactory.apiTimeout(toolName);
    }

    if (
      originalError.message.includes("rate limit") ||
      originalError.message.includes("429")
    ) {
      return ErrorFactory.rateLimited(toolName);
    }

    if (
      originalError.message.includes("not found") ||
      originalError.message.includes("404")
    ) {
      return new MCPError(
        ErrorCode.NO_DATA_AVAILABLE,
        originalError.message,
        { originalError, toolName },
        [
          "The requested data might not be available",
          "Check if the parameters are correct",
          "Try with different search criteria",
        ]
      );
    }

    return new MCPError(
      ErrorCode.TOOL_EXECUTION_FAILED,
      `Tool execution failed: ${originalError.message}`,
      { originalError, toolName },
      [
        "Check if all required parameters are provided",
        "Verify the input values are in the correct format",
        "Try again with different parameters",
        "Report this issue if it persists",
      ]
    );
  }

  export function unknownError(
    originalError: Error,
    context: ErrorContext = {}
  ): MCPError {
    return new MCPError(
      ErrorCode.UNKNOWN_ERROR,
      `An unexpected error occurred: ${originalError.message}`,
      { ...context, originalError },
      [
        "This is an unexpected error",
        "Try again in a few moments",
        "Check if all inputs are valid",
        "Report this issue with the error details",
      ]
    );
  }
}

/**
 * Helper function to handle errors consistently across tools
 */
export function handleToolError(
  error: unknown,
  toolName: string,
  context: ErrorContext = {}
): MCPError {
  if (error instanceof MCPError) {
    return error;
  }

  if (error instanceof Error) {
    return ErrorFactory.toolExecutionFailed(error, toolName);
  }

  return ErrorFactory.unknownError(new Error(String(error)), {
    ...context,
    toolName,
  });
}

/**
 * Helper function to format error response for MCP tools
 */
export function formatErrorResponse(error: MCPError) {
  return {
    content: [
      {
        type: "text" as const,
        text: error.toUserFriendlyMessage(),
      },
    ],
    isError: true,
  };
}
