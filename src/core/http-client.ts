interface HttpClientConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

export class HttpClient {
  private baseURL: string;
  private apiKey?: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig) {
    this.baseURL = config.baseURL.endsWith('/') ? config.baseURL.slice(0, -1) : config.baseURL;
    this.apiKey = config.apiKey;
    this.defaultTimeout = config.timeout || 10000; // 10 seconds default
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (this.apiKey) {
      this.defaultHeaders['x-api-key'] = this.apiKey;
    }
  }

  private buildURL(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${cleanEndpoint}`;
  }

  private mergeHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    return {
      ...this.defaultHeaders,
      ...customHeaders,
    };
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit & { timeout?: number }
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = options.timeout || this.defaultTimeout;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }

      return (await response.text()) as unknown as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
      }

      throw new Error('Unknown error occurred during request');
    }
  }

  /**
   * Makes a GET request to the specified endpoint
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(endpoint);
    const headers = this.mergeHeaders(options?.headers);

    return this.makeRequest<T>(url, {
      method: 'GET',
      headers,
      timeout: options?.timeout,
    });
  }

  /**
   * Updates the API key for future requests
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.defaultHeaders['x-api-key'] = apiKey;
  }

  /**
   * Removes the API key from future requests
   */
  removeApiKey(): void {
    this.apiKey = undefined;
    // Create new headers object without x-api-key instead of using delete
    const { 'x-api-key': removed, ...headersWithoutApiKey } = this.defaultHeaders;
    this.defaultHeaders = headersWithoutApiKey;
  }

  /**
   * Gets the current base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Updates the base URL
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  }
}

// Factory function for creating HttpClient instances
export function createHttpClient(config: HttpClientConfig): HttpClient {
  return new HttpClient(config);
}

// Utility type for API responses
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Common error types
export class HttpClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'HttpClientError';
  }
}
