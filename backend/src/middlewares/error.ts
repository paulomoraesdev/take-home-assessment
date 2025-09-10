import type { FastifyReply, FastifyError, FastifyRequest } from 'fastify';

/**
 * Global error handling middleware.
 *
 * This middleware centralizes the handling of application errors
 * and ensures consistent response formatting across the API.
 * 
 * In a real life application, where we have more entities, erros and cases, 
 * we could use custom error classes with Strategy Pattern to keep this middleware clean.
 *
 * Error categories:
 * - NOT FOUND (404): Triggered when a requested resource cannot be located.
 *   Expected to be thrown as `new Error('NotFound')`.
 *
 * - VALIDATION (422): Triggered when request payload validation fails.
 *   Expected to be thrown as `new Error('ValidationError')` with `details`.
 *
 * - GENERAL ERRORS (500): Default fallback for unhandled errors.
 *
 * @function errorHandlerMiddleware
 * @param {FastifyError & { statusCode?: number; details?: unknown }} error - The error thrown during request handling
 * @param {FastifyRequest} request - The incoming Fastify request
 * @param {FastifyReply} reply - The Fastify reply instance
 * @returns {FastifyReply} Standardized JSON error response
 */
export function errorHandlerMiddleware(
  error: FastifyError & { statusCode?: number; details?: unknown },
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  // NOT FOUND ERRORS (404)
  if (error.message === 'NotFound') {
    return reply.status(error.statusCode || 404).send({
      error: 'Record not found',
    });
  }

  // VALIDATION ERRORS (422)
  if (error.message === 'ValidationError') {
    return reply.status(error.statusCode || 422).send({
      error: 'Validation failed',
      details: error.details,
    });
  }

  // GENERAL ERRORS (500)
  return reply.status(error.statusCode || 500).send({
    error: 'Internal Server Error',
    message: error.message,
  });
}
