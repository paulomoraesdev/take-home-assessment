import { type FastifyInstance } from 'fastify';
import { contactsRoutes } from './_contacts.js';

/**
 * Register all application routes.
 *
 * This function centralizes route registration for the API
 *
 * @async
 * @function registerRoutes
 * @param {FastifyInstance} app - The Fastify application instance
 * @returns {Promise<void>} Resolves when routes are successfully registered
 */
export async function registerRoutes(app: FastifyInstance): Promise<void> {
  
  // health check route
  app.get('/', async () => {
    return { status: 'ok', message: 'API is healthy 🚀' };
  });

  // register contact routes with /contacts prefix
  app.register(contactsRoutes, { prefix: '/contacts' });
}
