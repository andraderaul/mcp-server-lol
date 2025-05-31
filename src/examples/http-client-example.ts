import { type ApiResponse, HttpClient, createHttpClient } from '../core/http-client.js';

// Example API response types
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

async function httpClientExamples(): Promise<void> {
  console.log('🌐 HTTP Client Examples\n');

  // Example 1: Basic usage without API key
  console.log('1. Basic HTTP Client (no API key)');
  const basicClient = createHttpClient({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
  });

  try {
    const users = await basicClient.get<User[]>('/users');
    console.log(`✅ Fetched ${users.length} users`);
    console.log(`First user: ${users[0]?.name}\n`);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
  }

  // Example 2: Client with API key
  console.log('2. HTTP Client with API Key');
  const apiClient = new HttpClient({
    baseURL: 'https://api.example.com',
    apiKey: 'your-secret-api-key-here',
    timeout: 10000,
    headers: {
      'User-Agent': 'MCP-Server-LOL/1.0.0',
    },
  });

  console.log(`✅ Client configured with base URL: ${apiClient.getBaseURL()}\n`);

  // Example 3: Custom headers per request
  console.log('3. Custom headers per request');
  try {
    const posts = await basicClient.get<Post[]>('/posts', {
      headers: {
        'X-Custom-Header': 'custom-value',
      },
      timeout: 3000,
    });
    console.log(`✅ Fetched ${posts.length} posts with custom headers\n`);
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
  }

  // Example 4: Updating API key dynamically
  console.log('4. Dynamic API key management');
  apiClient.setApiKey('new-api-key-123');
  console.log('✅ API key updated');

  apiClient.removeApiKey();
  console.log('✅ API key removed\n');

  // Example 5: Error handling
  console.log('5. Error handling example');
  try {
    await basicClient.get('/nonexistent-endpoint');
  } catch (error) {
    console.log(
      `✅ Caught expected error: ${error instanceof Error ? error.message : 'Unknown error'}\n`
    );
  }

  // Example 6: Using with typed API responses
  console.log('6. Typed API responses');
  try {
    // Simulate a structured API response
    const apiResponse = await basicClient.get<ApiResponse<User>>('/users/1');
    console.log('✅ Typed response received (simulated)\n');
  } catch (error) {
    // Expected to fail with jsonplaceholder as it doesn't return ApiResponse format
    console.log('✅ Handled API response format difference\n');
  }

  console.log('🎉 HTTP Client examples completed!');
}

// Export the example function
export { httpClientExamples };

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  httpClientExamples().catch(console.error);
}
