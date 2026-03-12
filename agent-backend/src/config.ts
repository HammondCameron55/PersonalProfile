import 'dotenv/config';

export const config = {
  port: process.env.AGENT_PORT ? Number(process.env.AGENT_PORT) : 4000,
  googleApiKey: process.env.GOOGLE_API_KEY ?? '',
  tavilyApiKey: process.env.TAVILY_API_KEY ?? '',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  allowedOrigins: (process.env.CORS_ALLOWED_ORIGINS ?? '').split(',').filter(Boolean),
  maxRequestBodySizeBytes: 8 * 1024 * 1024
};

export function assertConfig() {
  const missing: string[] = [];
  if (!config.googleApiKey) missing.push('GOOGLE_API_KEY');
  if (!config.tavilyApiKey) missing.push('TAVILY_API_KEY');

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables for agent-backend: ${missing.join(', ')}`
    );
  }
}

