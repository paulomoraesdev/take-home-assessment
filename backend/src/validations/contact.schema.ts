import { z } from 'zod';

const validationErrorMessages = {
  name: "Name is required",
  image: "Image is required and must be a valid base64 string",
  lastContactAt: "Invalid date format",
};

/**
 * Schema for creating a new contact.
 *
 * Fields:
 * - `name`: required, non-empty string
 * - `profilePicture`: required, base64 image string (png/jpeg/jpg), max 200KB
 * - `lastContactAt`: required, valid ISO date string
 *
 * @constant
 * @type {z.ZodObject}
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
 *
 * All fields are optional:
 * - `name`: non-empty string if provided
 * - `profilePicture`: base64 image string (png/jpeg/jpg), max 200KB
 * - `lastContactAt`: valid ISO date string if provided
 * - `archived`: boolean, true = archive, false = unarchive
 *
 * @constant
 * @type {z.ZodObject}
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
  archived: z.boolean().optional(),
});

/**
 * TypeScript type inferred from {@link createContactSchema}.
 *
 * @typedef {Object} CreateContactDTO
 * @property {string} name - Contact name
 * @property {string} profilePicture - Base64-encoded image string
 * @property {string} lastContactAt - ISO date string
 */
export type CreateContactDTO = z.infer<typeof createContactSchema>;

/**
 * TypeScript type inferred from {@link updateContactSchema}.
 *
 * @typedef {Object} UpdateContactDTO
 * @property {string} [name] - Optional updated contact name
 * @property {string} [profilePicture] - Optional base64-encoded image string
 * @property {string} [lastContactAt] - Optional ISO date string
 * @property {boolean} [archived] - Optional archive flag (true = archive, false = unarchive)
 */
export type UpdateContactDTO = z.infer<typeof updateContactSchema>;
