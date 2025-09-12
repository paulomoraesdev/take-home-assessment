import { computed, watch } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import type { ContactTab } from '@/types'

export function useContactTableFilters() {
  const contactsStore = useContactsStore()

  const activeTab = computed(() => contactsStore.activeTab)
  const searchQuery = computed({
    get: () => contactsStore.searchQuery,
    set: (value: string) => {
      if (contactsStore.contentLoading) return
      if (!value || value.trim() === '') {
        contactsStore.clearSearch()
      } else {
        contactsStore.updateSearchQuery(value)
      }
    }
  })
  const sortField = computed({
    get: () => contactsStore.sortField,
    set: (value) => {
      if (!contactsStore.contentLoading) {
        contactsStore.updateSortField(value)
      }
    }
  })
  const sortDirection = computed(() => contactsStore.sortDirection)
  const currentPage = computed(() => contactsStore.currentPage)
  const totalPages = computed(() => contactsStore.totalPages)
  const perPage = computed(() => contactsStore.perPage)
  const total = computed(() => contactsStore.total)
  const contentLoading = computed(() => contactsStore.contentLoading)

  const handleTabChange = (tab: ContactTab) => {
    if (!contactsStore.contentLoading) {
      contactsStore.setActiveTab(tab)
    }
  }

  const toggleSortDirection = () => {
    if (!contactsStore.contentLoading) {
      contactsStore.toggleSortDirection()
    }
  }

  const handlePreviousPage = () => {
    if (!contactsStore.contentLoading) {
      contactsStore.previousPage()
    }
  }

  const handleNextPage = () => {
    if (!contactsStore.contentLoading) {
      contactsStore.nextPage()
    }
  }

  const handleGotoPage = (page: number) => {
    if (!contactsStore.contentLoading) {
      contactsStore.goToPage(page)
    }
  }

  watch(
    () => ({
      tab: contactsStore.activeTab,
      search: contactsStore.search,
      sortField: contactsStore.sortField,
      sortDirection: contactsStore.sortDirection,
      page: contactsStore.currentPage
    }),
    () => {
      contactsStore.fetchContacts()
    }
  )

  return {
    activeTab,
    searchQuery,
    sortField,
    sortDirection,
    currentPage,
    totalPages,
    perPage,
    total,
    contentLoading,
    handleTabChange,
    toggleSortDirection,
    handlePreviousPage,
    handleNextPage,
    handleGotoPage
  }
}