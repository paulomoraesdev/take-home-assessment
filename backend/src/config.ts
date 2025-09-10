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
  uploadSetting: {
    fieldNameSize: 100,         // Max field name size in bytes
    fieldSize: 100,             // Max field value size in bytes
    fields: 10,                 // Max number of non-file fields
    fileSize: 5 * 1024 * 1024,  // For multipart forms, the max file size in bytes
    files: 1,                   // Max number of file fields
    headerPairs: 2000,          // Max number of header key=>value pairs
    parts: 1000                 // For multipart forms, the max number of parts (fields + files)
  }
};
