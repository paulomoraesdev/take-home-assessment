import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';
import { randomUUID } from 'crypto';

/**
 * Supabase Storage helper.
 *
 * This module provides functions to handle file uploads and deletions
 * in the Supabase Storage service. It abstracts away the low-level
 * details of `@supabase/supabase-js` and exposes a clean interface
 * for the rest of the application.
 *
 * @module Storage
 */

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

/**
 * Upload a file buffer to Supabase Storage and return its public URL.
 *
 * @async
 * @function uploadFile
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} filename - The original filename (used for extension)
 * @param {string} mimetype - The MIME type of the file (e.g., "image/png")
 * @returns {Promise<string>} Public URL of the uploaded file
 * @throws {Error} If the upload fails
 */
export async function uploadFile(
  fileBuffer: Buffer,
  filename: string,
  mimetype: string
): Promise<string> {
  const uniqueName = `${randomUUID()}-${filename}`;

  const { error } = await supabase.storage
    .from(config.supabaseBucket)
    .upload(uniqueName, fileBuffer, { contentType: mimetype });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(config.supabaseBucket)
    .getPublicUrl(uniqueName);

  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage.
 *
 * @async
 * @function deleteFile
 * @param {string} path - Path (filename) of the file to delete
 * @returns {Promise<void>}
 * @throws {Error} If the deletion fails
 */
export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(config.supabaseBucket)
    .remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}
