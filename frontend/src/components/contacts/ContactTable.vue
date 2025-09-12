<template>
  <div class="space-y-6">
    <!-- Tabs -->
    <ContactTableTabs
      :active-tab="activeTab"
      :disabled="contentLoading"
      @change="handleTabChange"
    />

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <ContactTableSearchBar v-model="searchQuery" :disabled="contentLoading" />
      <ContactTableSortControls
        v-model:field="sortField"
        :direction="sortDirection"
        :disabled="contentLoading"
        @toggle-direction="toggleSortDirection"
      />
    </div>

    <!-- Responsive Contact Grid -->
    <ContactGrid
      :contacts="contacts"
      :content-loading="contentLoading"
      :search-query="contactsStore.search"
      :has-no-search-results="hasNoSearchResults"
      @archive="handleArchive"
      @restore="handleRestore"
      @delete="handleDelete"
    />

    <!-- Pagination -->
    <ContactTablePagination
      v-if="!loading && hasSearchResults"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total="total"
      :per-page="perPage"
      :disabled="contentLoading"
      @previous="handlePreviousPage"
      @next="handleNextPage"
      @goto="handleGotoPage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import ContactGrid from './ContactGrid.vue'
import ContactTablePagination from './ContactTablePagination.vue'
import ContactTableTabs from './ContactTableTabs.vue'
import ContactTableSearchBar from './ContactTableSearchBar.vue'
import ContactTableSortControls from './ContactTableSortControls.vue'
import { useContactTableFilters } from '@/composables/useContactTableFilters'
import type { Contact } from '@/types'

const contactsStore = useContactsStore()

const {
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
} = useContactTableFilters()

// Computed properties from store
const contacts = computed(() => contactsStore.contacts)
const loading = computed(() => contactsStore.loading)

// Additional computed properties
const hasSearchResults = computed(() => contacts.value.length > 0)
const isSearching = computed(() => contactsStore.search.length > 0) // Use actual search value, not input
const hasNoSearchResults = computed(() => isSearching.value && !hasSearchResults.value && !contentLoading.value)

// Event handlers
const handleArchive = (contact: Contact) => {
  contactsStore.archiveContact(contact.id)
}

const handleRestore = (contact: Contact) => {
  contactsStore.restoreContact(contact.id)
}

const handleDelete = (contact: Contact) => {
  if (confirm(`Are you sure you want to permanently delete ${contact.name}?`)) {
    contactsStore.deleteContact(contact.id)
  }
}
</script>