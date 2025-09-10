/**
 * Represents an uploaded file from the client.
 */
export interface UploadedFile {
  buffer: Buffer;        // File content
  filename: string;      // Original filename
  mimetype: string;      // MIME type (e.g. "image/png")
}
