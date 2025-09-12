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

    <!-- Table -->
    <div class="bg-white dark:bg-slate-800 shadow overflow-hidden rounded-lg">
      <table class="w-full divide-y divide-gray-200 dark:divide-slate-600">
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
          <!-- Content loading state -->
          <tr v-if="contentLoading">
            <td colspan="4" class="px-6 py-12 text-center">
              <div class="flex justify-center">
                <Spinner />
              </div>
            </td>
          </tr>
          
          <!-- No results for search -->
          <tr v-else-if="hasNoSearchResults">
            <td colspan="4" class="px-6 py-12 text-center">
              <div class="text-gray-500 dark:text-gray-400">
                <p class="text-lg font-medium">No results found</p>
                <p class="text-sm">No contacts found for "{{ contactsStore.search }}"</p>
              </div>
            </td>
          </tr>
          
          <!-- Contact rows -->
          <ContactTableRow
            v-else
            v-for="contact in contacts"
            :key="contact.id"
            :contact="contact"
            @archive="handleArchive"
            @restore="handleRestore"
            @delete="handleDelete"
          />
        </tbody>
      </table>
    </div>

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
import ContactTableRow from './ContactTableRow.vue'
import ContactTablePagination from './ContactTablePagination.vue'
import ContactTableTabs from './ContactTableTabs.vue'
import ContactTableSearchBar from './ContactTableSearchBar.vue'
import ContactTableSortControls from './ContactTableSortControls.vue'
import Spinner from '@/components/ui/Spinner.vue'
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