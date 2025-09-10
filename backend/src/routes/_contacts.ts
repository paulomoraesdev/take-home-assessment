import { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { createContactSchema } from '../validations/contact.schema.js';
import { ContactController } from '../controllers/ContactController.js';

/**
 * Register all routes related to contact management.
 *
 * Endpoints:
 * - GET    /contacts           → List all contacts (with pagination, search and sorting)
 * - GET    /contacts/:uuid     → Retrieve a specific contact by its UUID
 * - POST   /contacts           → Create a new contact
 * - PUT    /contacts/:uuid     → Update an existing contact
 * - DELETE /contacts/:uuid     → Soft delete a contact (archive)
 *
 * @async
 * @function contactsRoutes
 * @param {FastifyInstance} app - The Fastify application instance
 * @returns {Promise<void>} Resolves when routes are registered
*/
export async function contactsRoutes(app: FastifyInstance): Promise<void> {
  const controller = new ContactController();

  app.get('/', controller.index.bind(controller));          // List all contacts
  app.get('/:id', controller.show.bind(controller));        // Retrieve a specific contact
  app.post('/', controller.store.bind(controller));         // Create a new contact
  app.put('/:id', controller.update.bind(controller));      // Update an existing contact
  app.delete('/:id', controller.destroy.bind(controller));  // Soft delete (archive) a contact
}
