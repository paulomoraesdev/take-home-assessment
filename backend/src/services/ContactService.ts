import type { Contact, Prisma } from '@prisma/client';
import { ContactRepository } from '../repositories/ContactRepository.js';
import type { CreateContactDTO, UpdateContactDTO } from '../validations/contact.schema.js';
import { uploadFile, deleteFile } from '../libs/storage.js';

export class ContactService {
  private repository: ContactRepository;

  constructor(repository?: ContactRepository) {
    this.repository = repository || new ContactRepository();
  }

  async getAll(page = 1, limit = 10, archived = false, search?: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filter: Prisma.ContactWhereInput = { 
      archivedAt: archived ? { not: null, gte: thirtyDaysAgo } : null, 
      deletedAt: null,
      ...( search ? { name : { contains: search, mode: 'insensitive' } } : {} )
    };

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

  async getById(id: string): Promise<{ data: Contact | null }> {
    const contact: Contact | null = await this.repository.getById(id);
    return { data: contact };
  }

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

  async update(id: string, data: UpdateContactDTO): Promise<Contact> {
    const updateData: UpdateContactDTO = {
      ...data,
    };

    if (data.profilePicture) {
      const existing = await this.repository.getById(id);

      if (existing?.profilePicture) {
        const oldPath = existing.profilePicture.split("/").pop();
        if (oldPath) {
          await deleteFile(oldPath);
        }
      }

      const base64Data = data.profilePicture.split(",")[1]!;
      const buffer = Buffer.from(base64Data, "base64");

      updateData.profilePicture = await uploadFile(
        buffer,
        `contact-${Date.now()}.png`,
        "image/png"
      );
    }

    return this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<Contact> {
    return this.repository.delete(id);
  }
}
