import { Prisma, PrismaClient, type Contact } from '@prisma/client';
import type { CreateContactDTO, UpdateContactDTO } from '../validations/contact.schema.js';

/**
 * Repository layer responsible for database operations on Contacts.
 *
 * This class isolates persistence logic using Prisma and ensures
 * a single responsibility for all database interactions.
 *
 * @class ContactRepository
 */
export class ContactRepository {
  private prisma: PrismaClient;

  /**
   * Initialize repository with Prisma client.
   *
   * By default, instantiates a new PrismaClient, but a custom
   * client can be injected (useful for testing or dependency management).
   *
   * @constructor
   * @param {PrismaClient} [prismaClient] - Optional Prisma client instance
   */
  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  /**
   * Retrieve paginated contacts with dynamic filters.
   *
   * Defaults to listing active contacts (not archived, not deleted).
   * Offset-based pagination is used for simplicity.
   *
   * @async
   * @method getAll
   * @param {number} page - Current page (defaults to 1)
   * @param {number} limit - Page size (defaults to 10)
   * @param {Prisma.ContactWhereInput} [filter] - Dynamic filter criteria
   * @returns {Promise<Contact[]>} List of contacts matching the criteria
   */
  async getAll(
    page: number,
    limit: number,
    filter: Prisma.ContactWhereInput = { archivedAt: null, deletedAt: null }
  ): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      where: filter,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieve a single contact by UUID.
   *
   * @async
   * @method getById
   * @param {string} id - Contact UUID
   * @returns {Promise<Contact|null>} The matching contact or null if not found
   */
  async getById(id: string): Promise<Contact | null> {
    return this.prisma.contact.findUnique({ where: { id } });
  }

  /**
   * Count total contacts with an optional filter.
   *
   * Defaults to counting active contacts (not archived, not deleted).
   *
   * @async
   * @method count
   * @param {Prisma.ContactWhereInput} [filter] - Dynamic filter criteria
   * @returns {Promise<number>} Total number of contacts matching the filter
   */
  async count(filter: Prisma.ContactWhereInput = { archivedAt: null, deletedAt: null }): Promise<number> {
    return this.prisma.contact.count({ where: filter });
  }

  /**
   * Create a new contact.
   *
   * @async
   * @method create
   * @param {CreateContactDTO} data - Validated contact payload
   * @returns {Promise<Contact>} The newly created contact
   */
  async create(data: CreateContactDTO): Promise<Contact> {
    return this.prisma.contact.create({ data });
  }

  /**
   * Update an existing contact with partial data.
   *
   * Special case:
   * - `archived = true` → sets `archivedAt` to now
   * - `archived = false` → clears `archivedAt`
   *
   * @async
   * @method update
   * @param {string} id - Contact UUID
   * @param {UpdateContactDTO} data - Fields to update
   * @returns {Promise<Contact>} The updated contact
   */
  async update(id: string, data: UpdateContactDTO): Promise<Contact> {
    const { archived, name, profilePicture, lastContactAt } = data;

    const updateData: Prisma.ContactUpdateInput = {
      ...(name !== undefined && { name }),
      ...(profilePicture !== undefined && { profilePicture }),
      ...(lastContactAt !== undefined && { lastContactAt }),
      ...(archived === true && { archivedAt: new Date() }),
      ...(archived === false && { archivedAt: null }),
    };

    return this.prisma.contact.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Mark a contact as deleted (soft delete).
   *
   * Instead of removing the record, sets `deletedAt` to now.
   *
   * @async
   * @method delete
   * @param {string} id - Contact UUID
   * @returns {Promise<Contact>} The updated contact with `deletedAt` set
   */
  async delete(id: string): Promise<Contact> {
    return this.prisma.contact.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
