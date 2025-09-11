import { httpClient } from '@/lib/http-client'
import type { 
  Contact, 
  ContactFormData, 
  ContactsQueryParams, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types'

/**
 * Repository for Contact API operations
 * 
 * Provides a clean abstraction layer over HTTP communication with the backend
 * contacts service. Follows the Repository pattern to decouple data access
 * logic from business logic, mirroring the backend ContactController endpoints.
 * 
 * @class ContactRepository
 */
export class ContactRepository {
  private readonly basePath = '/contacts'

  /**
   * Retrieve paginated list of contacts with optional filtering and search
   * 
   * Supports pagination, search by name, and filtering by archived status.
   * Mirrors the backend GET /contacts endpoint functionality.
   * 
   * @async
   * @method getAll
   * @param {ContactsQueryParams} [params] - Query parameters for filtering and pagination
   * @param {number} [params.page=1] - Page number for pagination
   * @param {number} [params.limit=10] - Number of items per page
   * @param {boolean} [params.archived=false] - Include archived contacts in results
   * @param {string} [params.s] - Search query string to filter by contact name
   * @returns {Promise<PaginatedResponse<Contact>>} Paginated list of contacts with metadata
   * @throws {Error} When API request fails or authentication token is invalid
   */
  async getAll(params?: ContactsQueryParams): Promise<PaginatedResponse<Contact>> {
    return httpClient.get<PaginatedResponse<Contact>>(this.basePath, params as Record<string, string | number | boolean>)
  }

  /**
   * Retrieve a specific contact by its unique identifier
   * 
   * Fetches detailed information for a single contact. Returns an error
   * if the contact doesn't exist or has been soft deleted.
   * 
   * @async
   * @method getById
   * @param {string} id - Unique UUID identifier of the contact
   * @returns {Promise<ApiResponse<Contact>>} Contact details wrapped in API response
   * @throws {Error} When contact is not found, deleted, or API request fails
   */
  async getById(id: string): Promise<ApiResponse<Contact>> {
    return httpClient.get<ApiResponse<Contact>>(`${this.basePath}/${id}`)
  }

  /**
   * Create a new contact in the system
   * 
   * Validates the contact data and creates a new contact record.
   * The backend will generate a unique UUID and set creation timestamps.
   * 
   * @async
   * @method create
   * @param {ContactFormData} data - Contact information to create
   * @param {string} data.name - Full name of the contact (required)
   * @param {string} [data.profilePicture] - URL or path to profile image
   * @param {Date} [data.lastContactAt] - Last contact interaction date
   * @returns {Promise<ApiResponse<Contact>>} Created contact with generated fields
   * @throws {Error} When validation fails or API request fails
   */
  async create(data: ContactFormData): Promise<ApiResponse<Contact>> {
    return httpClient.post<ApiResponse<Contact>>(this.basePath, data)
  }

  /**
   * Update an existing contact's information
   * 
   * Partially updates contact data. Only provided fields will be modified,
   * other fields remain unchanged. Updates the `updatedAt` timestamp automatically.
   * 
   * @async
   * @method update
   * @param {string} id - Unique UUID identifier of the contact to update
   * @param {Partial<ContactFormData>} data - Fields to update (partial update supported)
   * @returns {Promise<ApiResponse<Contact>>} Updated contact with new values
   * @throws {Error} When contact is not found, validation fails, or API request fails
   */
  async update(id: string, data: Partial<ContactFormData>): Promise<ApiResponse<Contact>> {
    return httpClient.put<ApiResponse<Contact>>(`${this.basePath}/${id}`, data)
  }

  /**
   * Soft delete a contact (archive)
   * 
   * Marks a contact as deleted by setting the `deletedAt` timestamp.
   * This is a soft delete operation - the record remains in the database
   * but is excluded from normal queries.
   * 
   * @async
   * @method delete
   * @param {string} id - Unique UUID identifier of the contact to delete
   * @returns {Promise<ApiResponse<Contact>>} Contact record with `deletedAt` timestamp set
   * @throws {Error} When contact is not found or API request fails
   */
  async delete(id: string): Promise<ApiResponse<Contact>> {
    return httpClient.delete<ApiResponse<Contact>>(`${this.basePath}/${id}`)
  }
}

/**
 * Singleton instance of ContactRepository for application-wide use
 */
export const contactRepository = new ContactRepository()