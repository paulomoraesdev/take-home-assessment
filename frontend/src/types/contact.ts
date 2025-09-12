// Contact entity based on Prisma schema
export interface Contact {
  id: string
  name: string
  profilePicture: string
  lastContactAt: Date
  archivedAt: Date | null
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

// Form data for creating/updating contacts
export interface ContactFormData {
  name: string
  profilePicture?: string
  lastContactAt?: Date | string
  archived?: boolean
}

// API query parameters for contact listing
export interface ContactsQueryParams {
  page?: number
  limit?: number
  archived?: boolean
  s?: string // search
  sortBy?: string // field to sort by
  sortOrder?: 'asc' | 'desc' // sort direction
}