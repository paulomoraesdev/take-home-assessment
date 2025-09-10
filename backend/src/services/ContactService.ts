import type { Contact, Prisma } from '@prisma/client';
import { ContactRepository } from '../repositories/ContactRepository.js';
import type { CreateContactDTO, UpdateContactDTO } from '../validations/contact.schema.js';

/**
 * Service layer responsible for business logic related to Contacts.
 *
 * This class depends on ContactRepository for database operations.
 * By default it instantiates a repository, but a custom one can be injected
 * (useful for testing or mocking).
 */
export class ContactService {
  private repository: ContactRepository;

  constructor(repository?: ContactRepository) {
    this.repository = repository || new ContactRepository();
  }

  /**
   * Retrieve paginated contacts (active or archived).
   *
   * - Active contacts: `archived = false` → `archivedAt = null`
   * - Archived contacts: `archived = true` → `archivedAt IS NOT NULL and bigger than 30 days ago`
   * - Deleted contacts are always excluded (`deletedAt = null`)
   *
   * @async
   * @function getAll
   * @param {number} [page=1] - Current page (for pagination)
   * @param {number} [limit=10] - Number of records per page
   * @param {boolean} [archived=false] - Whether to list archived contacts instead of active ones
   * @param {string} [search] - Search term to filter contacts by name (case insensitive, partial match)
   * @returns {Promise<{ data: Contact[], meta: { total: number, page: number, limit: number, totalPages: number } }>}
   * A paginated response containing contacts and metadata
   */
  async getAll(page = 1, limit = 10, archived = false, search?: string) {
    // Calculate the date 30 days ago from today
    // Did this to ensure archived contacts are only those archived within the last 30 days, to avoid showing archived 
    // contacts that weren't hit by cron job yet.
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filter: Prisma.ContactWhereInput = { 
      archivedAt: archived ? { not: null, gte: thirtyDaysAgo } : null, 
      deletedAt: null,
      ...( search ? { name : { contains: search, mode: 'insensitive' } } : {} )
    }

    const [data, total] = await Promise.all([
      this.repository.getAll(page, limit, filter),
      this.repository.count(filter),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieve a contact by its unique identifier.
   *
   * @async
   * @function getById
   * @param {string} id - Contact UUID
   * @returns {Promise<{ data: Contact | null }>} The matching contact or null if not found
   */
  async getById(id: string): Promise<{ data: Contact | null }> {
    const contact: Contact | null = await this.repository.getById(id);

    return {
      data: contact,
    };
  }

  /**
   * Create a new contact.
   *
   * @param {CreateContactDTO} data - Contact payload
   * @returns {Promise<Contact>} The newly created contact
   */
  async create(data: CreateContactDTO): Promise<Contact> {
    return this.repository.create(data);
  }

  /**
   * Update an existing contact.
   *
   * @param {string} id - Contact UUID
   * @param {UpdateContactDTO} data - Fields to update
   * @returns {Promise<Contact>} The updated contact
   */
  async update(id: string, data: UpdateContactDTO): Promise<Contact> {
    return this.repository.update(id, data);
  }

  /**
   * Mark a contact as deleted (soft delete).
   *
   * @param {string} id - Contact UUID
   * @returns {Promise<Contact>} The updated contact with deletedAt set
   */
  async delete(id: string): Promise<Contact> {
    return this.repository.delete(id);
  }
}
