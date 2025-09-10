import { z } from 'zod';

const validationErrorMessages = {
  name: "Name is required",
  image: "Image is required and must be a valid base64 string",
  lastContactAt: "Invalid date format",
};

/**
 * Schema for creating a new contact.
 *
 * - name: required, non-empty string
 * - profile_picture: required, must be a valid Base64 image (<= 200KB)
 * - lastContactAt: required, must be a valid ISO date string
 */
export const createContactSchema = z.object({
  name: z.string().min(1, validationErrorMessages.name),
  profilePicture: z
    .string()
    .regex(
      /^data:image\/(png|jpeg|jpg);base64,/,
      validationErrorMessages.image
    )
    .refine((val) => {
      const base64Data = val.split(',')[1]!;
      const sizeInBytes = Buffer.from(base64Data, 'base64').length;
      return sizeInBytes <= 200 * 1024; // 200 KB
    }, "Image must be <= 200KB"),
  lastContactAt: z.string().datetime(validationErrorMessages.lastContactAt),
});

/**
 * Schema for updating an existing contact.
 * All fields are optional — only provided fields will be updated.
 */
export const updateContactSchema = z.object({
  name: z.string().min(1, validationErrorMessages.name).optional(),
  profilePicture: z
    .string()
    .regex(/^data:image\/(png|jpeg|jpg);base64,/, validationErrorMessages.image)
    .refine((val) => {
      const parts = val.split(',');
      const base64Data = parts[1] ?? "";
      const sizeInBytes = Buffer.from(base64Data, 'base64').length;
      return sizeInBytes <= 200 * 1024;
    }, "Image must be <= 200KB")
    .optional(),
  lastContactAt: z.string().datetime(validationErrorMessages.lastContactAt).optional(),
  archived: z.boolean().optional(), // true = archive, false = unarchive
});

// Type for TypeScript usage
export type CreateContactDTO = z.infer<typeof createContactSchema>;
export type UpdateContactDTO = z.infer<typeof updateContactSchema>;
