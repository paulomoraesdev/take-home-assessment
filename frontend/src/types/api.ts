// Generic API response wrapper
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success?: boolean
}

// Paginated response structure  
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasContacts?: boolean // Optional field when includeStats=true
    totalExistingContacts?: number // Optional field when includeStats=true - includes active and archived (not deleted)
  }
}

// API error structure
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, unknown>
}

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// Request configuration
export interface RequestConfig {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: any
  params?: Record<string, string | number | boolean>
}