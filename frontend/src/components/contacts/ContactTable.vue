<template>
  <div class="space-y-6">
    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-slate-600">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="handleTabChange('active')"
          :disabled="contentLoading"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'active'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500',
            contentLoading && 'opacity-50 cursor-not-allowed'
          ]"
        >
          Active Contacts
        </button>
        <button
          @click="handleTabChange('archived')"
          :disabled="contentLoading"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'archived'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500',
            contentLoading && 'opacity-50 cursor-not-allowed'
          ]"
        >
          Archived
        </button>
      </nav>
    </div>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <!-- Search -->
      <div class="relative flex-1 max-w-md items-center">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search contacts..."
          :disabled="contentLoading"
          :class="[
            'font-sans w-full pl-10 pr-4 py-2 border-0 bg-gray-200 dark:bg-slate-900 rounded-md focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
            contentLoading && 'opacity-50 cursor-not-allowed'
          ]"
        />
      </div>

      <!-- Sort -->
      <div class="flex items-center gap-2">
        <label for="sort" class="text-sm font-questrial font-medium text-gray-700 dark:text-gray-300">
          Sort by:
        </label>
        <select
          id="sort"
          v-model="sortField"
          :disabled="contentLoading"
          :class="[
            'border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            contentLoading && 'opacity-50 cursor-not-allowed'
          ]"
        >
          <option value="name">Name</option>
          <option value="lastContactAt">Last Contact</option>
        </select>
        <button
          @click="toggleSortDirection"
          :disabled="contentLoading"
          :class="[
            'p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500',
            contentLoading && 'opacity-50 cursor-not-allowed'
          ]"
          :title="sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'"
        >
          <svg v-if="sortDirection === 'asc'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
        </button>
      </div>
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
import { computed, watch } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import ContactTableRow from './ContactTableRow.vue'
import ContactTablePagination from './ContactTablePagination.vue'
import Spinner from '@/components/ui/Spinner.vue'
import type { Contact, ContactTab } from '@/types'

const contactsStore = useContactsStore()

// Computed properties from store
const contacts = computed(() => contactsStore.contacts)
const loading = computed(() => contactsStore.loading)
const contentLoading = computed(() => contactsStore.contentLoading)
const total = computed(() => contactsStore.total)
const currentPage = computed(() => contactsStore.currentPage)
const totalPages = computed(() => contactsStore.totalPages)
const perPage = computed(() => contactsStore.perPage)
const activeTab = computed(() => contactsStore.activeTab)
const searchQuery = computed({
  get: () => contactsStore.searchQuery,
  set: (value) => {
    if (contentLoading.value) return
    
    // If search is being cleared, call clearSearch for immediate reset
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
    if (!contentLoading.value) {
      contactsStore.updateSortField(value)
    }
  }
})
const sortDirection = computed(() => contactsStore.sortDirection)

// Additional computed properties
const activeCount = computed(() => contactsStore.activeCount)
const archivedCount = computed(() => contactsStore.archivedCount)
const hasSearchResults = computed(() => contacts.value.length > 0)
const isSearching = computed(() => contactsStore.search.length > 0) // Use actual search value, not input
const hasNoSearchResults = computed(() => isSearching.value && !hasSearchResults.value && !contentLoading.value)

// Event handlers
const handleTabChange = (tab: ContactTab) => {
  if (!contentLoading.value) {
    contactsStore.setActiveTab(tab)
  }
}

const toggleSortDirection = () => {
  if (!contentLoading.value) {
    contactsStore.toggleSortDirection()
  }
}

const handlePreviousPage = () => {
  if (!contentLoading.value) {
    contactsStore.previousPage()
  }
}

const handleNextPage = () => {
  if (!contentLoading.value) {
    contactsStore.nextPage()
  }
}

const handleGotoPage = (page: number) => {
  if (!contentLoading.value) {
    contactsStore.goToPage(page)
  }
}

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

// Watch for changes that should trigger data fetch
// Don't watch searchQuery anymore since it's handled by debounce in store
watch([activeTab, sortField, sortDirection, currentPage], () => {
  contactsStore.fetchContacts()
})
</script>