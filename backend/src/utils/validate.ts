import * as z from 'zod';

/**
 * Validate request payload using a Zod schema.
 * Throws a custom error if validation fails.
 *
 * @param schema - Zod schema to validate against
 * @param data - Payload to validate
 * @returns Validated and parsed data
 */
export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const error = new Error('ValidationError') as any;
    error.statusCode = 422;
    error.details = result.error.issues;
    throw error;
  }
  return result.data;
}
