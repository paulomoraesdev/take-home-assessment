import type { FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../config.js';

/**
 * Authentication middleware.
 *
 * This middleware validates the presence of a valid API token
 * in the `Authorization` header of each incoming request.
 *
 * Expected format: `Authorization: Bearer <token>`
 *
 * If the token is invalid or missing, the request is rejected
 * with a 401 Unauthorized response.
 * 
 * DISCLAIMER: This is a simplistic auth mechanism with hardcoded token i've implemented, just for preventing 
 * public and free access to the API.
 *
 * @async
 * @function authMiddleware
 * @param {FastifyRequest} request - The incoming Fastify request
 * @param {FastifyReply} reply - The Fastify reply instance
 * @returns {Promise<void>} Sends a 401 response if unauthorized
 */
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers['authorization'];

  if (token !== `Bearer ${config.apiToken}`) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}
