import { type FastifyRequest, type FastifyReply } from 'fastify';
import { ContactService } from '../services/ContactService.js';
import { createContactSchema, updateContactSchema } from '../validations/contact.schema.js';
import { validate } from '../utils/validate.js';

/**
 * Controller responsible for handling HTTP requests related to Contacts.
 *
 * It orchestrates request validation, delegates business logic
 * to the service layer, and formats HTTP responses.
 *
 * @class ContactController
 */
export class ContactController {
  private service: ContactService;

  /**
   * Initialize controller with service.
   *
   * By default, instantiates a new service, but a custom
   * one can be injected (useful for testing or mocking).
   *
   * @constructor
   * @param {ContactService} [service] - Optional service instance
   */
  constructor(service?: ContactService) {
    this.service = service || new ContactService();
  }

  /**
   * Handle GET /contacts → List contacts (active or archived).
   *
   * Supports pagination and optional name search.
   *
   * @async
   * @method index
   * @param {FastifyRequest} request - The incoming HTTP request
   * @param {FastifyReply} reply - The HTTP reply object
   * @returns {Promise<FastifyReply>} Paginated list of contacts
   */
  async index(request: FastifyRequest, reply: FastifyReply) {
    const { page = 1, limit = 10, archived, s } = request.query as {
      page?: string;
      limit?: string;
      archived?: string;
      s?: string;
    };

    // Parse archived: only undefined or 'false' becomes false, everything else becomes true
    const isArchived = archived !== undefined && archived !== 'false';

    const result = await this.service.getAll(Number(page), Number(limit), isArchived, s);
    return reply.send(result);
  }

  /**
   * Handle GET /contacts/:id → Retrieve a specific contact.
   *
   * Throws a NotFound error if the contact does not exist
   * or has been soft deleted.
   *
   * @async
   * @method show
   * @param {FastifyRequest} request - The incoming HTTP request
   * @param {FastifyReply} reply - The HTTP reply object
   * @returns {Promise<FastifyReply>} Contact details
   */
  async show(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await this.service.getById(id);

    if (!result.data?.id || result.data?.deletedAt) throw new Error('NotFound');

    return reply.send({ data: result });
  }

  /**
   * Handle POST /contacts → Create a new contact.
   *
   * Validates payload, processes profile picture upload,
   * and delegates creation to the service.
   *
   * @async
   * @method store
   * @param {FastifyRequest} request - The incoming HTTP request
   * @param {FastifyReply} reply - The HTTP reply object
   * @returns {Promise<FastifyReply>} The created contact
   */
  async store(request: FastifyRequest, reply: FastifyReply) {
    const data = validate(createContactSchema, request.body);
    const contact = await this.service.create(data);
    return reply.status(201).send({ data: contact });
  }

  /**
   * Handle PUT /contacts/:id → Update an existing contact.
   *
   * Validates payload and delegates update to the service.
   *
   * @async
   * @method update
   * @param {FastifyRequest} request - The incoming HTTP request
   * @param {FastifyReply} reply - The HTTP reply object
   * @returns {Promise<FastifyReply>} The updated contact
   */
  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = validate(updateContactSchema, request.body);

    const contact = await this.service.update(id, data);
    return reply.send({ data: contact });
  }

  /**
   * Handle DELETE /contacts/:id → Soft delete a contact.
   *
   * Marks a contact as deleted by setting `deletedAt`.
   *
   * @async
   * @method destroy
   * @param {FastifyRequest} request - The incoming HTTP request
   * @param {FastifyReply} reply - The HTTP reply object
   * @returns {Promise<FastifyReply>} The updated contact with `deletedAt` set
   */
  async destroy(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const contact = await this.service.delete(id);
    return reply.status(200).send({ data: contact });
  }
}
