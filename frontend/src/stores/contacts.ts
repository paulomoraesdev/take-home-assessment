import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { contactRepository } from '@/repositories/ContactRepository'
import type { Contact, ContactFormData, ContactsQueryParams } from '@/types'

type SortField = 'name' | 'lastContactAt' | 'createdAt'
type SortDirection = 'asc' | 'desc'
type ContactTab = 'active' | 'archived'

// Export types for use in components
export type { SortField, SortDirection, ContactTab }

/**
 * Contacts management store with CRUD operations, table state, and modal state
 * 
 * Provides centralized state management for contacts including:
 * - Contact data and CRUD operations
 * - Table UI state (pagination, sorting, search, tabs)
 * - Modal state for contact editing
 * - Optimistic updates for better UX
 * 
 * Organized in logical sections for maintainability and performance.
 */
export const useContactsStore = defineStore('contacts', () => {
  // ===== CONTACT DATA STATE =====
  const contacts = ref<Contact[]>([])
  const loading = ref(false) // General loading for initial table load
  const contentLoading = ref(false) // Loading for table content (search, filter, pagination)
  const error = ref<string | null>(null)
  
  // ===== TABLE UI STATE =====
  // Pagination
  const currentPage = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const totalPages = ref(0)
  
  // Search & Filters
  const search = ref('')
  const searchInput = ref('') // Immediate input value for display
  const searchTimeout = ref<number | null>(null)
  const activeTab = ref<ContactTab>('active')
  
  // Sorting
  const sortField = ref<SortField>('name')
  const sortDirection = ref<SortDirection>('asc')
  
  // ===== MODAL STATE =====
  const currentContact = ref<Contact | null>(null)
  const modalLoading = ref(false)
  const isModalOpen = ref(false)

  // ===== COMPUTED VALUES =====
  // Contact data computed
  const hasContacts = computed(() => total.value > 0)
  const activeContacts = computed(() => contacts.value.filter(c => !c.archivedAt))
  const archivedContacts = computed(() => contacts.value.filter(c => c.archivedAt))
  const displayedContacts = computed(() => 
    activeTab.value === 'active' ? activeContacts.value : archivedContacts.value
  )
  const activeCount = computed(() => activeContacts.value.length)
  const archivedCount = computed(() => archivedContacts.value.length)
  
  // Search computed
  const searchQuery = computed({
    get: () => searchInput.value,
    set: (value: string) => {
      searchInput.value = value
      debouncedSearch()
    }
  })
  
  // Additional table computed
  const perPage = computed(() => limit.value)
  
  // Table UI computed
  const hasMorePages = computed(() => currentPage.value < totalPages.value)
  const isFirstPage = computed(() => currentPage.value === 1)
  const isLastPage = computed(() => currentPage.value >= totalPages.value)
  const showArchived = computed(() => activeTab.value === 'archived')
  
  // Modal computed
  const hasCurrentContact = computed(() => currentContact.value !== null)
  const isEditMode = computed(() => isModalOpen.value && hasCurrentContact.value)
  const isCreateMode = computed(() => isModalOpen.value && !hasCurrentContact.value)

  // ===== UTILITY FUNCTIONS =====
  /**
   * Debounced search function
   * 
   * Implements 1-second delay before triggering search. Clears previous timeout
   * when new input arrives. Resets to page 1 on search and clears listing when search is empty.
   */
  function debouncedSearch() {
    // Clear existing timeout
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }
    
    // Set new timeout for 1 second
    searchTimeout.value = setTimeout(() => {
      const trimmedInput = searchInput.value.trim()
      
      // If search changed, update search value and reset page
      if (search.value !== trimmedInput) {
        search.value = trimmedInput
        currentPage.value = 1
        
        // Trigger search with content loading
        fetchContacts()
      }
    }, 1000) as any
  }

  /**
   * Transform date strings to Date objects
   * 
   * Converts API response date strings to proper Date objects for frontend use.
   * Handles null values appropriately for optional date fields.
   * 
   * @param {any} contact - Contact object with potential string dates
   * @returns {Contact} Contact with proper Date objects
   */
  function transformContactDates(contact: any): Contact {
    return {
      ...contact,
      lastContactAt: contact.lastContactAt ? new Date(contact.lastContactAt) : new Date(),
      archivedAt: contact.archivedAt ? new Date(contact.archivedAt) : null,
      deletedAt: contact.deletedAt ? new Date(contact.deletedAt) : null,
      createdAt: contact.createdAt ? new Date(contact.createdAt) : new Date(),
      updatedAt: contact.updatedAt ? new Date(contact.updatedAt) : new Date(),
    }
  }

  // ===== ACTIONS =====
  /**
   * Fetch contacts from the API with optional parameters
   * 
   * Loads contacts with pagination, search, and filtering. Updates the store
   * state with fetched data and pagination metadata. Handles loading and error states.
   * 
   * @async
   * @param {ContactsQueryParams} [params] - Optional query parameters to override defaults
   * @param {number} [params.page] - Page number to fetch
   * @param {number} [params.limit] - Number of items per page
   * @param {boolean} [params.archived] - Include archived contacts
   * @param {string} [params.s] - Search query string
   * @param {boolean} [isInitialLoad=false] - Whether this is the initial table load
   * @returns {Promise<void>} Promise that resolves when contacts are loaded
   */
  async function fetchContacts(params?: ContactsQueryParams, isInitialLoad = false) {
    if (isInitialLoad) {
      loading.value = true
    } else {
      contentLoading.value = true
    }
    error.value = null
    
    try {
      const queryParams = {
        page: currentPage.value,
        limit: limit.value,
        archived: showArchived.value,
        s: search.value || undefined,
        // TODO: Add sorting parameters when backend supports it
        // sortField: sortField.value,
        // sortOrder: sortOrder.value,
        ...params
      }
      
      const response = await contactRepository.getAll(queryParams)

      contacts.value = response.data.map(transformContactDates)
      currentPage.value = response.meta.page
      limit.value = response.meta.limit
      total.value = response.meta.total
      totalPages.value = response.meta.totalPages
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch contacts'
      console.error('Error fetching contacts:', err)
    } finally {
      loading.value = false
      contentLoading.value = false
    }
  }

  async function getContactById(id: string): Promise<Contact | null> {
    try {
      const response = await contactRepository.getById(id)
      return response.data ? transformContactDates(response.data) : null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch contact'
      console.error('Error fetching contact:', err)
      return null
    }
  }

  /**
   * Create a new contact
   * 
   * Validates and creates a new contact record. Updates local state if successful
   * and the current page is the first page. Handles loading and error states.
   * 
   * @async
   * @param {ContactFormData} data - Contact information to create
   * @param {string} data.name - Full name of the contact (required)
   * @param {string} [data.profilePicture] - URL or path to profile image
   * @param {Date} [data.lastContactAt] - Last contact interaction date
   * @returns {Promise<Contact | null>} Created contact or null if creation failed
   */
  async function createContact(data: ContactFormData): Promise<Contact | null> {
    loading.value = true
    error.value = null
    
    try {
      const response = await contactRepository.create(data)
      const createdContact = transformContactDates(response.data)
      
      // Add to local state if we're on the first page
      if (currentPage.value === 1) {
        contacts.value.unshift(createdContact)
        total.value += 1
      }
      
      return createdContact
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create contact'
      console.error('Error creating contact:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateContact(id: string, data: Partial<ContactFormData>): Promise<Contact | null> {
    loading.value = true
    error.value = null
    
    try {
      const response = await contactRepository.update(id, data)
      const updatedContact = transformContactDates(response.data)
      
      // Update local state
      const index = contacts.value.findIndex(contact => contact.id === id)
      if (index !== -1) {
        contacts.value[index] = updatedContact
      }
      
      return updatedContact
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update contact'
      console.error('Error updating contact:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteContact(id: string): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      await contactRepository.delete(id)
      
      // Remove from local state
      const index = contacts.value.findIndex(contact => contact.id === id)
      if (index !== -1) {
        contacts.value.splice(index, 1)
        total.value -= 1
      }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete contact'
      console.error('Error deleting contact:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Archive a contact
   * 
   * @param {string} id - Contact ID to archive
   * @returns {Promise<boolean>} Success status
   */
  async function archiveContact(id: string): Promise<boolean> {
    try {
      await contactRepository.archive(id)
      
      // Update local state
      const index = contacts.value.findIndex(contact => contact.id === id)
      if (index !== -1) {
        contacts.value[index] = {
          ...contacts.value[index],
          archivedAt: new Date()
        }
      }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to archive contact'
      console.error('Error archiving contact:', err)
      return false
    }
  }

  /**
   * Restore an archived contact
   * 
   * @param {string} id - Contact ID to restore
   * @returns {Promise<boolean>} Success status
   */
  async function restoreContact(id: string): Promise<boolean> {
    try {
      await contactRepository.restore(id)
      
      // Update local state
      const index = contacts.value.findIndex(contact => contact.id === id)
      if (index !== -1) {
        contacts.value[index] = {
          ...contacts.value[index],
          archivedAt: null
        }
      }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to restore contact'
      console.error('Error restoring contact:', err)
      return false
    }
  }

  /**
   * Update the search query with debounce
   */
  function updateSearchQuery(query: string) {
    searchQuery.value = query
  }

  /**
   * Clear search immediately (no debounce)
   */
  function clearSearch() {
    // Clear timeout to prevent delayed search
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
      searchTimeout.value = null
    }
    
    // Clear both input and search values
    searchInput.value = ''
    search.value = ''
    currentPage.value = 1
    
    // Trigger immediate fetch to reset listing
    fetchContacts()
  }

  /**
   * Update sort field and reset pagination
   */
  function updateSortField(field: SortField) {
    sortField.value = field
    currentPage.value = 1
  }

  /**
   * Toggle sort direction
   */
  function toggleSortDirection() {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    currentPage.value = 1
  }

  // ===== TABLE UI ACTIONS =====
  /**
   * Set active tab and reset pagination
   * 
   * Switches between active and archived contacts view. Automatically
   * resets pagination to first page when changing tabs.
   * 
   * @param {ContactTab} tab - Tab to activate ('active' or 'archived')
   */
  function setActiveTab(tab: ContactTab) {
    activeTab.value = tab
    currentPage.value = 1
  }

  /**
   * Set table sorting and refresh data
   * 
   * Updates sort field and direction, then refreshes the contact list.
   * Currently handles sorting client-side until backend support is added.
   * 
   * @param {SortField} field - Field to sort by
   * @param {SortDirection} direction - Sort direction ('asc' or 'desc')
   */
  async function setSorting(field: SortField, direction: SortDirection) {
    if (contentLoading.value) return
    sortField.value = field
    sortDirection.value = direction
    currentPage.value = 1
    await fetchContacts()
  }

  // ===== MODAL ACTIONS =====
  /**
   * Open modal for creating a new contact
   * 
   * Sets modal to create mode by clearing current contact
   * and opening the modal.
   */
  function openCreateModal() {
    currentContact.value = null
    isModalOpen.value = true
  }

  /**
   * Open modal for editing an existing contact
   * 
   * Loads the contact data and sets modal to edit mode.
   * If contact is not found locally, fetches from API.
   * 
   * @async
   * @param {string} contactId - UUID of the contact to edit
   */
  async function openEditModal(contactId: string) {
    modalLoading.value = true
    
    // Try to find contact in local state first
    let contact = contacts.value.find(c => c.id === contactId)
    
    // If not found locally, fetch from API
    if (!contact) {
      contact = await getContactById(contactId)
    }
    
    currentContact.value = contact || null
    isModalOpen.value = true
    modalLoading.value = false
  }

  /**
   * Close modal and clear current contact
   * 
   * Resets modal state and clears any selected contact.
   */
  function closeModal() {
    currentContact.value = null
    isModalOpen.value = false
    modalLoading.value = false
  }

  /**
   * Update the current contact in edit modal
   * 
   * Updates the contact being edited and refreshes the local state.
   * 
   * @async
   * @param {Partial<ContactFormData>} data - Updated contact data
   * @returns {Promise<boolean>} Success status
   */
  async function updateCurrentContact(data: Partial<ContactFormData>): Promise<boolean> {
    if (!currentContact.value) return false
    
    const updated = await updateContact(currentContact.value.id, data)
    if (updated) {
      currentContact.value = updated
      return true
    }
    return false
  }

  // ===== PAGINATION ACTIONS =====
  function nextPage() {
    if (hasMorePages.value && !contentLoading.value) {
      currentPage.value += 1
      fetchContacts()
    }
  }

  function previousPage() {
    if (!isFirstPage.value && !contentLoading.value) {
      currentPage.value -= 1
      fetchContacts()
    }
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value && !contentLoading.value) {
      currentPage.value = page
      fetchContacts()
    }
  }

  // ===== UTILITY ACTIONS =====
  function clearError() {
    error.value = null
  }

  return {
    // ===== CONTACT DATA =====
    contacts,
    loading,
    contentLoading,
    error,
    
    // ===== TABLE STATE =====
    currentPage,
    limit,
    total,
    totalPages,
    search,
    activeTab,
    sortField,
    sortDirection,
    searchQuery,
    perPage,
    
    // ===== MODAL STATE =====
    currentContact,
    modalLoading,
    isModalOpen,
    
    // ===== COMPUTED VALUES =====
    // Data computed
    hasContacts,
    activeContacts,
    archivedContacts,
    displayedContacts,
    activeCount,
    archivedCount,
    
    // Table computed
    hasMorePages,
    isFirstPage,
    isLastPage,
    showArchived,
    
    // Modal computed
    hasCurrentContact,
    isEditMode,
    isCreateMode,
    
    // ===== CRUD ACTIONS =====
    fetchContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    
    // ===== TABLE UI ACTIONS =====
    updateSearchQuery,
    clearSearch,
    updateSortField,
    toggleSortDirection,
    setActiveTab,
    setSorting,
    archiveContact,
    restoreContact,
    
    // ===== MODAL ACTIONS =====
    openCreateModal,
    openEditModal,
    closeModal,
    updateCurrentContact,
    
    // ===== PAGINATION ACTIONS =====
    nextPage,
    previousPage,
    goToPage,
    
    // ===== UTILITY ACTIONS =====
    clearError
  }
})
