<template>
  <div class="relative flex-1 max-w-md items-center">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <SearchIcon />
    </div>
    <input
      v-model="model"
      type="text"
      placeholder="Search contacts..."
      :disabled="disabled"
      :class="[
        'font-sans w-full pl-10 pr-4 py-2 border-0 bg-gray-200 dark:bg-slate-900 rounded-md focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
        disabled && 'opacity-50 cursor-not-allowed'
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import SearchIcon from '@/components/icons/SearchIcon.vue'

interface Props {
  modelValue: string
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const model = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})
</script>