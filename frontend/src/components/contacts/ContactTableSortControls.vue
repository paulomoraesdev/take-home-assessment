<template>
  <div class="flex items-center gap-2">
    <label for="sort" class="text-sm font-questrial font-medium text-gray-700 dark:text-gray-300">
      Sort by:
    </label>
    <select
      id="sort"
      v-model="fieldModel"
      :disabled="disabled"
      :class="[
        'border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        disabled && 'opacity-50 cursor-not-allowed'
      ]"
    >
      <option value="name">Name</option>
      <option value="lastContactAt">Last Contact</option>
    </select>
    <button
      @click="$emit('toggle-direction')"
      :disabled="disabled"
      :class="[
        'p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500',
        disabled && 'opacity-50 cursor-not-allowed'
      ]"
      :title="direction === 'asc' ? 'Sort descending' : 'Sort ascending'"
    >
      <svg v-if="direction === 'asc'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
      <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SortField, SortDirection } from '@/stores/contacts'

interface Props {
  field: SortField
  direction: SortDirection
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:field': [value: SortField]; 'toggle-direction': [] }>()

const fieldModel = computed({
  get: () => props.field,
  set: (value: SortField) => emit('update:field', value)
})
</script>