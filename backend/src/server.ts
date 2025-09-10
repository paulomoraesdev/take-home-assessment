import { buildApp } from './app.js';
import { config } from './config.js';

/**
 * Application entrypoint.
 *
 * This script is responsible for:
 * - Building the Fastify application instance using {@link buildApp}
 * - Starting the HTTP server on the configured port
 * - Logging server startup information
 * - Handling fatal startup errors gracefully
 *
 * @async
 * @function start
 * @returns {Promise<void>} Resolves when the server is successfully running
 */
async function start(): Promise<void> {
  const app = await buildApp();

  try {
    await app.listen({ port: config.port });
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
