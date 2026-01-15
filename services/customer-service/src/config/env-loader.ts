import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Determines which environment files to load based on NODE_ENV and APP_ENV
 * Priority: .env.{APP_ENV} > .env.{NODE_ENV} > .env
 * Also loads .env.local for local overrides (gitignored)
 */
export function getEnvFilePaths(): string[] {
  const envFiles: string[] = [];
  const rootPath = process.cwd();

  // Get environment from APP_ENV or NODE_ENV
  const appEnv = process.env.APP_ENV || process.env.NODE_ENV || 'development';

  // Base .env file (always loaded first)
  const baseEnvPath = resolve(rootPath, '.env');
  if (existsSync(baseEnvPath)) {
    envFiles.push('.env');
  }

  // Environment-specific .env file (e.g., .env.dev, .env.qa, .env.production)
  const envSpecificPath = resolve(rootPath, `.env.${appEnv}`);
  if (existsSync(envSpecificPath)) {
    envFiles.push(`.env.${appEnv}`);
  }

  // Local overrides (gitignored, highest priority)
  const localEnvPath = resolve(rootPath, '.env.local');
  if (existsSync(localEnvPath)) {
    envFiles.push('.env.local');
  }

  // Environment-specific local overrides (e.g., .env.dev.local)
  const envLocalPath = resolve(rootPath, `.env.${appEnv}.local`);
  if (existsSync(envLocalPath)) {
    envFiles.push(`.env.${appEnv}.local`);
  }

  return envFiles;
}

