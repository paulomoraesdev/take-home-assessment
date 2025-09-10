import { type FastifyRequest, type FastifyReply } from 'fastify';
import { ContactService } from '../services/ContactService.js';
import { createContactSchema, updateContactSchema } from '../validations/contact.schema.js';
import { validate } from '../utils/validate.js';

/**
 * Controller responsible for handling HTTP requests related to Contacts.
 * Orchestrates validation, service calls, and response formatting.
 */
export class ContactController {
  private service: ContactService;

  constructor(service?: ContactService) {
    this.service = service || new ContactService();
  }

  /** GET /contacts → List contacts (active or archived) */
  async index(request: FastifyRequest, reply: FastifyReply) {
    const { page = 1, limit = 10, archived = false, s } = request.query as {
      page?: string;
      limit?: string;
      archived?: boolean;
      s?: string;
    };

    const result = await this.service.getAll(Number(page), Number(limit), archived, s);
    return reply.send(result);
  }

  /** GET /contacts/:id → Retrieve a specific contact */
  async show(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await this.service.getById(id);

    if (!result.data?.id || result.data?.deletedAt) throw new Error('NotFound');

    return reply.send({ data: result });
  }

  /** POST /contacts → Create a new contact */
  async store(request: FastifyRequest, reply: FastifyReply) {
    const data = validate(createContactSchema, request.body);
    const contact = await this.service.create(data);
    return reply.status(201).send({ data: contact });
  }

  /** PUT /contacts/:id → Update an existing contact */
  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = validate(updateContactSchema, request.body);

    const contact = await this.service.update(id, data);
    return reply.send({ data: contact });
  }

  /** DELETE /contacts/:id → Soft delete (mark as deleted) */
  async destroy(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const contact = await this.service.delete(id);
    return reply.status(200).send({ data: contact });
  }
}
