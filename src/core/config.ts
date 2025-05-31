import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface AppConfig {
  lol: {
    apiBaseUrl: string;
    apiKey: string;
  };
  http: {
    timeout: number;
  };
}

// Validate required environment variables
function validateEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}

// Export configuration object
export const config: AppConfig = {
  lol: {
    apiBaseUrl: validateEnvVar('LOL_API_BASE_URL', process.env.LOL_API_BASE_URL),
    apiKey: validateEnvVar('LOL_API_KEY', process.env.LOL_API_KEY),
  },
  http: {
    timeout: Number.parseInt(process.env.HTTP_TIMEOUT || '10000', 10),
  },
};

// Export individual config sections for convenience
export const { lol: lolConfig, http: httpConfig } = config;
