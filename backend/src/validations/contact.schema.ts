import { z } from 'zod';

const validationErrorMessages = {
  name: "Name is required",
  imageUrl: "Invalid image URL",
  lastContactAt: "Invalid date format",
}

/**
 * Schema for creating a new contact.
 *
 * - name: required, non-empty string
 * - imageUrl: required, must be a valid URL
 * - lastContactAt: required, must be a valid ISO date string
 */
export const createContactSchema = z.object({
  name: z.string().min(1, validationErrorMessages.name),
  imageUrl: z.string().url(validationErrorMessages.imageUrl),
  lastContactAt: z.string().datetime(validationErrorMessages.lastContactAt),
});

/**
 * Schema for updating an existing contact.
 * All fields are optional — only provided fields will be updated.
 */
export const updateContactSchema = z.object({
  name: z.string().min(1, validationErrorMessages.name).optional(),
  imageUrl: z.string().url(validationErrorMessages.imageUrl).optional(),
  lastContactAt: z.string().datetime(validationErrorMessages.lastContactAt).optional(),
  archived: z.boolean().optional(), // true = archive, false = unarchive
});

// Type for TypeScript usage
export type CreateContactDTO = z.infer<typeof createContactSchema>;
export type UpdateContactDTO = z.infer<typeof updateContactSchema>;
