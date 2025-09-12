<template>
  <div class="border-b border-gray-200 dark:border-slate-600">
    <nav class="-mb-px flex space-x-8">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="$emit('change', tab.key)"
        :disabled="disabled"
        :class="[
          'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
          activeTab === tab.key
            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500 cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed'
        ]"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { ContactTab } from '@/types'

interface Props {
  activeTab: ContactTab
  disabled?: boolean
}

defineProps<Props>()

defineEmits<{ change: [tab: ContactTab] }>()

const tabs = [
  { key: 'active', label: 'Active Contacts' },
  { key: 'archived', label: 'Archived' }
] as const
</script>