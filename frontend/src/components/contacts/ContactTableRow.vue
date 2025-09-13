<template>
  <tr class="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-600 relative">
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
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex items-center justify-end gap-3">
      <!-- Active contacts: Edit + Archive -->
      <template v-if="!contact.archivedAt">
        <RouterLink
          :to="`/contact/${contact.id}`"
          class="cursor-pointer hover:opacity-60"
          title="Edit contact"
        >
          <EditIcon />
        </RouterLink>
        <button
          @click="$emit('archive', contact)"
          class="cursor-pointer hover:opacity-60"
          title="Archive contact"
        >
          <ArchiveIcon />
        </button>
      </template>
      
      <!-- Archived contacts: Restore + Delete -->
      <template v-else>
        <button
          @click="$emit('restore', contact)"
          class="cursor-pointer hover:opacity-60"
          title="Restore contact"
        >
          <RestoreIcon />
        </button>
        <button
          @click="showDeleteConfirm = true"
          class="cursor-pointer hover:opacity-60"
          title="Delete permanently"
        >
          <TrashIcon />
        </button>
      </template>
    </td>

    <!-- Delete Confirmation Overlay -->
    <ContactDeleteConfirmationOverlay
      v-if="showDeleteConfirm"
      :contact-name="contact.name"
      :is-deleting="isDeleting"
      @cancel="handleCancel"
      @confirm="handleDeleteConfirm"
    />
  </tr>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { Contact } from '@/types'

import EditIcon from '@/components/icons/EditIcon.vue'
import ArchiveIcon from '@/components/icons/ArchiveIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import RestoreIcon from '@/components/icons/RestoreIcon.vue'
import ContactDeleteConfirmationOverlay from './ContactDeleteConfirmationOverlay.vue'
import { formatDateToMonthDayYear } from '@/utils/dateFormat'

interface Props {
  contact: Contact
}

interface Emits {
  archive: [contact: Contact]
  restore: [contact: Contact]
  delete: [contact: Contact]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State for delete confirmation overlay
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)

const handleCancel = () => {
  if (!isDeleting.value) {
    showDeleteConfirm.value = false
  }
}

const handleDeleteConfirm = async () => {
  isDeleting.value = true
  try {
    emit('delete', props.contact)
    // The overlay will be hidden when the contact is removed from the list
    // If there's an error, it will be handled by the parent component
  } catch (error) {
    // On error, hide the overlay and reset states
    isDeleting.value = false
    showDeleteConfirm.value = false
  }
}

const formatDate = (date: Date): string => {
  return formatDateToMonthDayYear(date)
}
</script>