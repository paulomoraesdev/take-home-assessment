import { Prisma, PrismaClient, type Contact } from '@prisma/client';
import type { CreateContactDTO, UpdateContactDTO } from '../validations/contact.schema.js';

/**
 * Repository layer responsible for database operations on Contacts.
 *
 * By default it instantiates PrismaClient, but a custom client can be injected
 * (useful for testing or dependency management).
 */
export class ContactRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  /**
   * Retrieve all active contacts (not archived, not deleted).
   *
   * Chose to use offset-based instead of cursor-based pagination for simplicity,
   *
   * @async
   * @function getAll
   * @param {number} page - Current page (defaults to 1)
   * @param {number} limit - Page size (defaults to 10)
   * @param {Prisma.ContactWhereInput} filter - Dynamic filter for the query
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
   * Retrieve a contact by its unique identifier.
   *
   * @async
   * @function getById
   * @param {string} id - Contact UUID
   * @returns {Promise<Contact|null>} The matching contact or null if not found
   */
  async getById(id: string): Promise<Contact | null> {
    return this.prisma.contact.findUnique({ where: { id } });
  }

  /**
   * Count all contacts.
   *
   * @async
   * @function count
   * @param {Prisma.ContactWhereInput} filter - Dynamic filter for the query
   * @returns {Promise<number>} A list of active contacts ordered by creation date
   */
  async count(filter: Prisma.ContactWhereInput = { archivedAt: null, deletedAt: null }): Promise<number> {
    return this.prisma.contact.count({ where: filter });
  }

  /**
   * Create a new contact.
   *
   * @param {CreateContactDTO} data - Contact payload
   * @returns {Promise<Contact>} The newly created contact
   */
  async create(data: CreateContactDTO): Promise<Contact> {
    return this.prisma.contact.create({ data });
  }

  /**
   * Update an existing contact.
   *
   * @param {string} id - Contact UUID
   * @param {UpdateContactDTO} data - Fields to update
   * @returns {Promise<Contact>} The updated contact
   */
  async update(id: string, data: UpdateContactDTO): Promise<Contact> {
    const { archived, name, profilePicture, lastContactAt } = data;

    const updateData: Prisma.ContactUpdateInput = {};

    if (name !== undefined) {
      updateData.name = name;
    }
    if (profilePicture !== undefined) {
      updateData.profilePicture = profilePicture;
    }
    if (lastContactAt !== undefined) {
      updateData.lastContactAt = lastContactAt;
    }
    if (archived === true) {
      updateData.archivedAt = new Date();
    } else if (archived === false) {
      updateData.archivedAt = null;
    }

    return this.prisma.contact.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Mark a contact as deleted (soft delete).
   *
   * @param {string} id - Contact UUID
   * @returns {Promise<Contact>} The updated contact with deletedAt set
   */
  async delete(id: string): Promise<Contact> {
    return this.prisma.contact.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
