import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors'

import { config } from './config.js';
import { authMiddleware } from './middlewares/auth.js';
import { registerRoutes } from './routes/index.js';
import { errorHandlerMiddleware } from './middlewares/error.js';

/**
 * Build and configure the Fastify application.
 *
 * This function is responsible for:
 * - Initializing the Fastify instance
 * - Setting up CORS policies
 * - Registering authentication middleware
 * - Registering all application routes
 *
 * @async
 * @function buildApp
 * @returns {Promise<FastifyInstance>} The configured Fastify application instance
 */
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  // Setting up CORS policies
  await app.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With']
  })

  // Registering authentication middleware (applies to all routes)
  app.addHook('preHandler', authMiddleware);

  // Registering error handling middleware
  app.setErrorHandler(errorHandlerMiddleware);

  // Registering routes
  await registerRoutes(app);

  return app;
}
