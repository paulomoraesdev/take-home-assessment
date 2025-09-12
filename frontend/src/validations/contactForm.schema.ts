import { z } from 'zod'

/**
 * Frontend validation schema for contact forms
 * Based on backend schemas but adapted for client-side validation
 */

const validationErrorMessages = {
  name: "Name is required",
  image: "Image is required and must be a valid base64 string", 
  lastContactAt: "Invalid date format",
}

/**
 * Base schema for contact form validation
 * Matches backend createContactSchema validation rules
 */
const baseContactFormSchema = z.object({
  name: z.string().min(1, validationErrorMessages.name),
  profilePicture: z
    .string()
    .regex(
      /^data:image\/(png|jpeg|jpg);base64,/,
      validationErrorMessages.image
    )
    .refine((val) => {
      try {
        const base64Data = val.split(',')[1]
        if (!base64Data) return false
        
        // Calculate size of base64 data (approximate)
        const sizeInBytes = (base64Data.length * 3) / 4
        return sizeInBytes <= 200 * 1024 // 200 KB
      } catch {
        return false
      }
    }, "Image must be <= 200KB"),
  lastContactAt: z.date({ message: validationErrorMessages.lastContactAt })
})

/**
 * Schema for creating a new contact
 * All fields are required
 */
export const createContactFormSchema = baseContactFormSchema

/**
 * Schema for updating an existing contact
 * All fields are optional (partial update)
 * Matches backend updateContactSchema behavior
 */
export const updateContactFormSchema = z.object({
  name: z.string().min(1, validationErrorMessages.name).optional(),
  profilePicture: z
    .string()
    .regex(/^data:image\/(png|jpeg|jpg);base64,/, validationErrorMessages.image)
    .refine((val) => {
      try {
        const base64Data = val.split(',')[1]
        if (!base64Data) return false
        
        const sizeInBytes = (base64Data.length * 3) / 4
        return sizeInBytes <= 200 * 1024
      } catch {
        return false
      }
    }, "Image must be <= 200KB")
    .optional(),
  lastContactAt: z.date({ message: validationErrorMessages.lastContactAt }).optional()
})

/**
 * Type definitions
 */
export type CreateContactFormData = z.infer<typeof createContactFormSchema>
export type UpdateContactFormData = z.infer<typeof updateContactFormSchema>

/**
 * Validation helper functions
 */
export const validateCreateContactForm = (data: unknown) => {
  return createContactFormSchema.safeParse(data)
}

export const validateUpdateContactForm = (data: unknown) => {
  return updateContactFormSchema.safeParse(data)
}