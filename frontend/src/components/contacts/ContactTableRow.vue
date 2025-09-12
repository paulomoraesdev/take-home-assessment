<template>
  <tr class="max-w-full bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
    <!-- Photo -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="h-10 w-10">
        <img
          v-if="contact.profilePicture"
          :src="contact.profilePicture"
          :alt="contact.name"
          class="h-10 w-10 rounded-full object-cover"
        />
        <div
          v-else
          class="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center"
        >
          <svg
            class="h-5 w-5 text-gray-400 dark:text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>
    </td>
    
    <!-- Name -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
        {{ contact.name }}
      </div>
    </td>
    
    <!-- Last Contact Date -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ formatDate(contact.lastContactAt) }}
      </div>
    </td>
    
    <!-- Actions -->
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
      <!-- Active contacts: Edit + Archive -->
      <template v-if="!contact.archivedAt">
        <RouterLink
          :to="`/contact/${contact.id}`"
          class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          title="Edit contact"
        >
          <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </RouterLink>
        <button
          @click="$emit('archive', contact)"
          class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
          title="Archive contact"
        >
          <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8l4 4 4-4m6-3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14z" />
          </svg>
        </button>
      </template>
      
      <!-- Archived contacts: Restore + Delete -->
      <template v-else>
        <button
          @click="$emit('restore', contact)"
          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
          title="Restore contact"
        >
          <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          @click="$emit('delete', contact)"
          class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          title="Delete permanently"
        >
          <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </template>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Contact } from '@/types'

interface Props {
  contact: Contact
}

interface Emits {
  archive: [contact: Contact]
  restore: [contact: Contact]
  delete: [contact: Contact]
}

defineProps<Props>()
defineEmits<Emits>()

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit', 
    year: 'numeric'
  }).format(new Date(date))
}
</script>