<template>
  <div class="space-y-6">
    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-slate-600">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="handleTabChange('active')"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'active'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'
          ]"
        >
          Active Contacts
          <span
            v-if="activeCount !== undefined"
            class="ml-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 py-0.5 px-2.5 rounded-full text-xs"
          >
            {{ activeCount }}
          </span>
        </button>
        <button
          @click="handleTabChange('archived')"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'archived'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'
          ]"
        >
          Archived
          <span
            v-if="archivedCount !== undefined"
            class="ml-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 py-0.5 px-2.5 rounded-full text-xs"
          >
            {{ archivedCount }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <!-- Search -->
      <div class="relative flex-1 max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search contacts..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      <!-- Sort -->
      <div class="flex items-center gap-2">
        <label for="sort" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort by:
        </label>
        <select
          id="sort"
          v-model="sortField"
          class="border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="name">Name</option>
          <option value="lastContactAt">Last Contact</option>
        </select>
        <button
          @click="toggleSortDirection"
          class="p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
        <ContactTableHeader />
        
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
          <!-- Loading state -->
          <tr v-if="loading">
            <td colspan="4" class="px-6 py-12 text-center">
              <div class="flex justify-center">
                <svg class="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </td>
          </tr>
          
          <!-- No results for search -->
          <tr v-else-if="isSearching && !hasSearchResults && !loading">
            <td colspan="4" class="px-6 py-12 text-center">
              <div class="text-gray-500 dark:text-gray-400">
                <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8c2.321 0 4.438.74 6.156 2H21l-3.5-3.5" />
                </svg>
                <p class="text-lg font-medium">No results found</p>
                <p class="text-sm">No contacts found for "{{ searchQuery }}"</p>
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
      @previous="handlePreviousPage"
      @next="handleNextPage"
      @goto="handleGotoPage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import ContactTableHeader from './ContactTableHeader.vue'
import ContactTableRow from './ContactTableRow.vue'
import ContactTablePagination from './ContactTablePagination.vue'
import type { Contact, ContactTab } from '@/types'

const contactsStore = useContactsStore()

// Computed properties from store
const contacts = computed(() => contactsStore.contacts)
const loading = computed(() => contactsStore.loading)
const total = computed(() => contactsStore.total)
const currentPage = computed(() => contactsStore.currentPage)
const totalPages = computed(() => contactsStore.totalPages)
const perPage = computed(() => contactsStore.perPage)
const activeTab = computed(() => contactsStore.activeTab)
const searchQuery = computed({
  get: () => contactsStore.searchQuery,
  set: (value) => contactsStore.updateSearchQuery(value)
})
const sortField = computed({
  get: () => contactsStore.sortField,
  set: (value) => contactsStore.updateSortField(value)
})
const sortDirection = computed(() => contactsStore.sortDirection)

// Additional computed properties
const activeCount = computed(() => contactsStore.activeCount)
const archivedCount = computed(() => contactsStore.archivedCount)
const hasSearchResults = computed(() => contacts.value.length > 0)
const isSearching = computed(() => searchQuery.value.length > 0)

// Event handlers
const handleTabChange = (tab: ContactTab) => {
  contactsStore.setActiveTab(tab)
}

const toggleSortDirection = () => {
  contactsStore.toggleSortDirection()
}

const handlePreviousPage = () => {
  contactsStore.previousPage()
}

const handleNextPage = () => {
  contactsStore.nextPage()
}

const handleGotoPage = (page: number) => {
  contactsStore.goToPage(page)
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
watch([activeTab, searchQuery, sortField, sortDirection, currentPage], () => {
  contactsStore.fetchContacts()
}, { immediate: true })
</script>