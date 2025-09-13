<template>
  <div class="relative">
    <!-- Desktop Grid Layout -->
    <div 
      class="contact-grid-row hidden md:grid md:grid-cols-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
      role="row"
      :aria-label="`Contact: ${contact.name}`"
    >
    <!-- Photo -->
    <div class="flex items-center" role="cell" aria-label="Profile picture">
      <div class="h-10 w-10">
        <img
          v-if="contact.profilePicture"
          :src="contact.profilePicture"
          :alt="`${contact.name} profile picture`"
          class="h-10 w-10 rounded-full object-cover"
        />
        <div
          v-else
          class="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center"
          :aria-label="`Default profile picture for ${contact.name}`"
        >
          <svg
            class="h-5 w-5 text-gray-400 dark:text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
    </div>
    
    <!-- Name -->
    <div class="flex items-center" role="cell" :aria-label="`Name: ${contact.name}`">
      <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
        {{ contact.name }}
      </div>
    </div>
    
    <!-- Last Contact Date -->
    <div class="flex items-center" role="cell" :aria-label="`Last contact: ${formatDate(contact.lastContactAt)}`">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ formatDate(contact.lastContactAt) }}
      </div>
    </div>
    
    <!-- Actions -->
    <div class="flex items-center justify-end gap-3" role="cell" aria-label="Actions">
      <ContactRowActions
        :contact="contact"
        layout="horizontal"
        @archive="$emit('archive', $event)"
        @restore="$emit('restore', $event)"
        @delete="showDeleteConfirm = true"
      />
    </div>
    </div>

    <!-- Mobile Card Layout -->
  <div 
    class="contact-card md:hidden p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
    role="row"
    :aria-label="`Contact card: ${contact.name}`"
  >
    <!-- Header: Photo + Name + Actions -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <!-- Photo -->
        <div class="h-12 w-12" role="cell" aria-label="Profile picture">
          <img
            v-if="contact.profilePicture"
            :src="contact.profilePicture"
            :alt="`${contact.name} profile picture`"
            class="h-12 w-12 rounded-full object-cover"
          />
          <div
            v-else
            class="h-12 w-12 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center"
            :aria-label="`Default profile picture for ${contact.name}`"
          >
            <svg
              class="h-6 w-6 text-gray-400 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
        
        <!-- Name -->
        <div role="cell" :aria-label="`Name: ${contact.name}`">
          <div class="text-base font-medium text-gray-900 dark:text-gray-100">
            {{ contact.name }}
          </div>
        </div>
      </div>

      <!-- Mobile Actions -->
      <div role="cell" aria-label="Actions">
        <ContactRowActions
          :contact="contact"
          layout="vertical"
          @archive="$emit('archive', $event)"
          @restore="$emit('restore', $event)"
          @delete="showDeleteConfirm = true"
        />
      </div>
    </div>

    <!-- Footer: Last Contact Date -->
    <div class="flex items-center" role="cell" :aria-label="`Last contact: ${formatDate(contact.lastContactAt)}`">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        <span class="font-medium">Last contact:</span> {{ formatDate(contact.lastContactAt) }}
      </div>
    </div>
  </div>

    <!-- Delete Confirmation Overlay -->
    <ContactDeleteConfirmationOverlay
      v-if="showDeleteConfirm"
      :contact-name="contact.name"
      :is-deleting="isDeleting"
      @cancel="handleCancel"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { Contact } from '@/types'
import { formatDateToMonthDayYear } from '@/utils/dateFormat'
import ContactRowActions from './ContactRowActions.vue'
import ContactDeleteConfirmationOverlay from './ContactDeleteConfirmationOverlay.vue'

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

<style scoped>
/* Desktop Grid Layout */
.contact-grid-row {
  grid-template-columns: 60px 1fr 200px 120px;
  align-items: center;
}

/* Tablet adjustments */
@media (min-width: 768px) and (max-width: 1023px) {
  .contact-grid-row {
    grid-template-columns: 50px 1fr 160px 100px;
  }
}

/* Mobile Card improvements */
.contact-card {
  /* Card-like appearance on mobile */
  background: inherit;
  border-radius: 0;
}

/* Focus states for accessibility */
.contact-grid-row:focus-within,
.contact-card:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth transitions */
.contact-grid-row,
.contact-card {
  transition: background-color 150ms ease-in-out;
}
</style>