import type { RequestConfig, ApiError } from '@/types'

/**
 * HTTP Client with automatic Bearer token authentication
 * 
 * Provides a clean, type-safe abstraction over the native fetch API with
 * automatic authentication, error handling, and request/response processing.
 * Follows REST conventions and integrates seamlessly with the backend API.
 * 
 * Features:
 * - Automatic Bearer token authentication
 * - Consistent error handling and parsing
 * - TypeScript generics for response typing
 * - Query parameter serialization
 * - JSON request/response handling
 * 
 * @class HttpClient
 */
class HttpClient {
  private baseUrl: string
  private token: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    this.token = import.meta.env.VITE_API_TOKEN
    
    if (!this.token) {
      throw new Error('API token is required. Please set VITE_API_TOKEN in your .env file')
    }
  }

  /**
   * Build query string from parameters
   */
  private buildQueryString(params?: Record<string, string | number | boolean>): string {
    if (!params) return ''
    
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    
    const queryString = searchParams.toString()
    return queryString ? `?${queryString}` : ''
  }

  /**
   * Build request headers with authentication
   */
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
      ...customHeaders
    }
  }

  /**
   * Handle API errors consistently
   */
  private async handleError(response: Response): Promise<never> {
    let errorData: ApiError
    
    try {
      errorData = await response.json()
    } catch {
      errorData = {
        message: `HTTP ${response.status}: ${response.statusText}`,
        code: String(response.status)
      }
    }

    throw new Error(errorData.message || 'An unexpected error occurred')
  }

  /**
   * Parse response with proper error handling
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      await this.handleError(response)
    }

    try {
      return await response.json()
    } catch (error) {
      throw new Error('Failed to parse response as JSON')
    }
  }

  /**
   * Generic HTTP request method with automatic authentication and error handling
   * 
   * Core method that handles all HTTP communication. Automatically includes
   * Bearer token authentication, processes query parameters, handles JSON
   * serialization, and provides consistent error handling.
   * 
   * @async
   * @template T - Expected response type
   * @param {string} endpoint - API endpoint path (e.g., '/contacts', '/users/123')
   * @param {RequestConfig} [config={}] - Request configuration options
   * @param {HttpMethod} [config.method='GET'] - HTTP method
   * @param {Record<string, string>} [config.headers] - Additional headers
   * @param {any} [config.body] - Request body (will be JSON stringified)
   * @param {Record<string, string | number | boolean>} [config.params] - Query parameters
   * @returns {Promise<T>} Promise resolving to typed response data
   * @throws {Error} When request fails, authentication is invalid, or response parsing fails
   */
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers: customHeaders,
      body,
      params
    } = config

    const url = `${this.baseUrl}${endpoint}${this.buildQueryString(params)}`
    const headers = this.buildHeaders(customHeaders)

    const requestOptions: RequestInit = {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) })
    }

    try {
      const response = await fetch(url, requestOptions)
      return await this.parseResponse<T>(response)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network request failed')
    }
  }

  /**
   * HTTP GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  /**
   * HTTP POST request
   */
  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body })
  }

  /**
   * HTTP PUT request
   */
  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body })
  }

  /**
   * HTTP DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

/**
 * Singleton instance of HttpClient for application-wide use
 * 
 * Pre-configured with base URL and authentication token from environment variables.
 * Ready to use for all API communication throughout the application.
 */
export const httpClient = new HttpClient()