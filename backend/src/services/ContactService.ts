import type { Contact, Prisma } from '@prisma/client';
import { ContactRepository } from '../repositories/ContactRepository.js';
import type { CreateContactDTO, UpdateContactDTO } from '../validations/contact.schema.js';
import { uploadFile, deleteFile } from '../libs/storage.js';

/**
 * Service layer responsible for business logic related to Contacts.
 *
 * This class sits between controllers and the repository,
 * handling transformations, validations, and file uploads.
 *
 * @class ContactService
 */
export class ContactService {
  private repository: ContactRepository;

  /**
   * Initialize service with repository.
   *
   * By default, instantiates a new repository, but a custom
   * one can be injected (useful for testing or mocking).
   *
   * @constructor
   * @param {ContactRepository} [repository] - Optional repository instance
   */
  constructor(repository?: ContactRepository) {
    this.repository = repository || new ContactRepository();
  }

  /**
   * Retrieve paginated contacts (active or archived).
   *
   * - Active contacts: `archived = false` → `archivedAt = null`
   * - Archived contacts: `archived = true` → `archivedAt >= 30 days ago`
   * - Deleted contacts are always excluded
   *
   * @async
   * @method getAll
   * @param {number} [page=1] - Current page
   * @param {number} [limit=10] - Page size
   * @param {boolean} [archived=false] - Whether to list archived instead of active contacts
   * @param {string} [search] - Search term to filter contacts by name (case-insensitive, partial match)
   * @param {string} [sortBy] - Field to sort by (name, lastContactAt, createdAt, updatedAt)
   * @param {string} [sortOrder] - Sort direction (asc, desc)
   * @returns {Promise<{ data: Contact[], meta: { total: number, page: number, limit: number, totalPages: number } }>}
   * A paginated response with contacts and metadata
   */
  async getAll(
      page = 1,
      limit = 10,
      archived = false,
      search?: string,
      sortBy = 'createdAt',
      sortOrder: 'asc' | 'desc' = 'desc',
      isStatusIncluded = false
    ) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filter: Prisma.ContactWhereInput = { 
      archivedAt: archived ? { not: null, gte: thirtyDaysAgo } : null, 
      deletedAt: null,
      ...( search ? { name : { contains: search, mode: 'insensitive' } } : {} )
    };

    // Build orderBy object based on sortBy and sortOrder
    const validSortFields = ['name', 'lastContactAt', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderBy: Prisma.ContactOrderByWithRelationInput = { [sortField]: sortOrder };

    const [data, total] = await Promise.all([
      this.repository.getAll(page, limit, filter, orderBy),
      this.repository.count(filter)
    ]);

    let totalExistingContacts: number | null = null;
    if (isStatusIncluded) {
      // Get precise count of existing contacts (not deleted - includes both active and archived)
      totalExistingContacts = await this.repository.count({ deletedAt: null });
    }

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        ...(isStatusIncluded && totalExistingContacts !== null && { 
          hasContacts: totalExistingContacts > 0,
          totalExistingContacts 
        })
      },
    };
  }

  /**
   * Retrieve a single contact by UUID.
   *
   * @async
   * @method getById
   * @param {string} id - Contact UUID
   * @returns {Promise<{ data: Contact | null }>} The matching contact or null if not found
   */
  async getById(id: string): Promise<{ data: Contact | null }> {
    const contact: Contact | null = await this.repository.getById(id);
    return { data: contact };
  }

  /**
   * Create a new contact.
   *
   * Transforms `profilePicture` from base64 into a file upload
   * and persists its URL in the database.
   *
   * @async
   * @method create
   * @param {CreateContactDTO} data - Validated contact payload
   * @returns {Promise<Contact>} The newly created contact
   */
  async create(data: CreateContactDTO): Promise<Contact> {
    const base64Data = data.profilePicture.split(",")[1]!;
    const buffer = Buffer.from(base64Data, "base64");

    const profilePicture = await uploadFile(buffer, `contact-${Date.now()}.png`, "image/png");

    const { profilePicture: _, ...rest } = data;

    return this.repository.create({
      ...rest,
      profilePicture,
    });
  }

  /**
   * Update an existing contact.
   *
   * If `profilePicture` is provided, replaces the old file
   * and deletes it from storage.
   *
   * @async
   * @method update
   * @param {string} id - Contact UUID
   * @param {UpdateContactDTO} data - Fields to update
   * @returns {Promise<Contact>} The updated contact
   */
  async update(id: string, data: UpdateContactDTO): Promise<Contact> {
    const updateData: UpdateContactDTO = {
      ...data,
    };

    if (data.profilePicture) {
      const existing = await this.repository.getById(id);
      const oldPicture = existing?.profilePicture;

      const base64Data = data.profilePicture.split(",")[1]!;
      const buffer = Buffer.from(base64Data, "base64");

      updateData.profilePicture = await uploadFile(
        buffer,
        `contact-${Date.now()}.png`,
        "image/png"
      );

      if (oldPicture) {
        const oldPath = oldPicture.split("/").pop();
        if (oldPath) {
          await deleteFile(oldPath).catch(() => {}); // Silent fail
        }
      }
    }

    return this.repository.update(id, updateData);
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
    return this.repository.delete(id);
  }
}
