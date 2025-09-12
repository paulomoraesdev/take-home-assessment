<template>
  <!-- Horizontal Layout (Desktop) -->
  <div v-if="layout === 'horizontal'" class="flex items-center gap-3">
    <!-- Active contacts: Edit + Archive -->
    <template v-if="!contact.archivedAt">
      <RouterLink
        :to="`/contact/${contact.id}`"
        class="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        :aria-label="`Edit ${contact.name}`"
        title="Edit contact"
      >
        <EditIcon />
      </RouterLink>
      <button
        @click="$emit('archive', contact)"
        class="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
        :aria-label="`Archive ${contact.name}`"
        title="Archive contact"
      >
        <ArchiveIcon />
      </button>
    </template>
    
    <!-- Archived contacts: Restore + Delete -->
    <template v-else>
      <button
        @click="$emit('restore', contact)"
        class="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
        :aria-label="`Restore ${contact.name}`"
        title="Restore contact"
      >
        <RestoreIcon />
      </button>
      <button
        @click="$emit('delete', contact)"
        class="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        :aria-label="`Delete ${contact.name} permanently`"
        title="Delete permanently"
      >
        <TrashIcon />
      </button>
    </template>
  </div>

  <!-- Vertical Layout (Mobile - Dropdown) -->
  <div v-else-if="layout === 'vertical'" class="relative">
    <button
      @click="toggleDropdown"
      ref="dropdownButton"
      id="actions-menu"
      class="inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      :aria-label="`Actions for ${contact.name}`"
      :aria-expanded="isDropdownOpen"
      aria-haspopup="menu"
    >
      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isDropdownOpen"
      class="absolute right-0 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
      :class="shouldDropUp ? 'bottom-full mb-2' : 'top-full mt-2'"
      role="menu"
      aria-labelledby="actions-menu"
    >
      <div class="py-1">
        <!-- Active contacts menu -->
        <template v-if="!contact.archivedAt">
          <RouterLink
            :to="`/contact/${contact.id}`"
            class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            role="menuitem"
            @click="closeDropdown"
          >
            <EditIcon class="mr-3" />
            Edit Contact
          </RouterLink>
          <button
            @click="handleArchive"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            role="menuitem"
          >
            <ArchiveIcon class="mr-3" />
            Archive Contact
          </button>
        </template>
        
        <!-- Archived contacts menu -->
        <template v-else>
          <button
            @click="handleRestore"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            role="menuitem"
          >
            <RestoreIcon class="mr-3" />
            Restore Contact
          </button>
          <button
            @click="handleDelete"
            class="flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            role="menuitem"
          >
            <TrashIcon class="mr-3" />
            Delete Permanently
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import type { Contact } from '@/types'

import EditIcon from '@/components/icons/EditIcon.vue'
import ArchiveIcon from '@/components/icons/ArchiveIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import RestoreIcon from '@/components/icons/RestoreIcon.vue'

interface Props {
  contact: Contact
  layout: 'horizontal' | 'vertical'
}

interface Emits {
  archive: [contact: Contact]
  restore: [contact: Contact]
  delete: [contact: Contact]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Dropdown state
const isDropdownOpen = ref(false)
const dropdownButton = ref<HTMLButtonElement>()

// Check if dropdown should open upwards to avoid viewport overflow
const shouldDropUp = computed(() => {
  if (!dropdownButton.value) return false
  
  const rect = dropdownButton.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const dropdownHeight = 150 // Approximate dropdown height
  
  // If there's not enough space below, drop up
  return (rect.bottom + dropdownHeight) > (viewportHeight - 20)
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

// Action handlers for dropdown
const handleArchive = () => {
  emit('archive', props.contact)
  closeDropdown()
}

const handleRestore = () => {
  emit('restore', props.contact)
  closeDropdown()
}

const handleDelete = () => {
  emit('delete', props.contact)
  closeDropdown()
}

// Click outside to close dropdown
const handleClickOutside = (event: Event) => {
  if (dropdownButton.value && !dropdownButton.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// Escape key to close dropdown
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  if (props.layout === 'vertical') {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
  }
})

onUnmounted(() => {
  if (props.layout === 'vertical') {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscapeKey)
  }
})
</script>