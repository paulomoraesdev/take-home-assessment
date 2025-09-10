import 'dotenv/config'

/**
 * Application configuration values.
 *
 * This file is responsible for loading environment variables using `dotenv`
 * 
 * @property {number} port - Port number where the API will run. Defaults to 3000.
 * @property {string} apiToken - Fixed API token used for authenticating requests.
 * @property {string} corsOrigin - Allowed CORS origin(s). Defaults to '*'.
 */
export const config = {
  port: Number(process.env.API_PORT) || 3000,
  apiToken: process.env.API_TOKEN || 'default-token',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  supabaseUrl: process.env.SUPABASE_PROJECT_URL || '',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  supabaseBucket: process.env.SUPABASE_BUCKET || ''
};
