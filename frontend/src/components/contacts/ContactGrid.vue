<template>
  <div 
    class="contact-grid-container bg-white dark:bg-slate-800 shadow rounded-lg overflow-x-hidden"
    role="table"
    :aria-label="`Contact list showing ${contacts.length} contacts`"
  >
    <!-- Desktop Header (hidden on mobile) -->
    <div 
      class="contact-grid-header hidden md:grid md:grid-cols-4 bg-gray-50 dark:bg-slate-700 px-6 py-3 border-b border-gray-200 dark:border-slate-600"
      role="row"
    >
      <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" role="columnheader">
        Photo
      </div>
      <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" role="columnheader">
        Name
      </div>
      <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" role="columnheader">
        Last Contact
      </div>
      <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right" role="columnheader">
        Actions
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="contentLoading" class="flex justify-center py-12">
      <Spinner />
    </div>

    <!-- No Results -->
    <div 
      v-else-if="hasNoSearchResults" 
      class="px-6 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div class="text-gray-500 dark:text-gray-400">
        <p class="text-lg font-medium">No results found</p>
        <p class="text-sm">No contacts found for "{{ searchQuery }}"</p>
      </div>
    </div>

    <!-- Contact Rows -->
    <div v-else class="divide-y divide-gray-200 dark:divide-slate-600">
      <ContactGridRow
        v-for="contact in contacts"
        :key="contact.id"
        :contact="contact"
        @archive="$emit('archive', contact)"
        @restore="$emit('restore', contact)"
        @delete="$emit('delete', contact)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactGridRow from './ContactGridRow.vue'
import Spinner from '@/components/ui/Spinner.vue'
import type { Contact } from '@/types'

interface Props {
  contacts: Contact[]
  contentLoading: boolean
  searchQuery: string
  hasNoSearchResults: boolean
}

interface Emits {
  archive: [contact: Contact]
  restore: [contact: Contact]
  delete: [contact: Contact]
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
/* Ensure grid container maintains proper structure */
.contact-grid-container {
  /* Base container styles already applied via classes */
}

.contact-grid-header {
  /* Grid template for desktop header */
  grid-template-columns: 60px 1fr 200px 120px;
  align-items: center;
}

/* Responsive adjustments */
@media (min-width: 768px) and (max-width: 1023px) {
  .contact-grid-header {
    grid-template-columns: 50px 1fr 160px 100px;
  }
}
</style>