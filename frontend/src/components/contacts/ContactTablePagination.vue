<template>
  <div class="py-3 flex items-center justify-between">
    <!-- Mobile pagination -->
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        @click="$emit('previous')"
        :disabled="currentPage <= 1 || disabled"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        @click="$emit('next')"
        :disabled="currentPage >= totalPages || disabled"
        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
    
    <!-- Desktop pagination -->
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <!-- Results info -->
      <div>
        <p class="text-lg text-gray-700 dark:text-gray-300 font-questrial">
          Showing
          <span class="font-bold">{{ startItem }}</span>
          to
          <span class="font-bold">{{ endItem }}</span>
          of
          <span class="font-bold">{{ total }}</span>
          results
        </p>
      </div>
      
      <!-- Page navigation -->
      <div>
        <nav class="relative z-0 inline-flex gap-2" aria-label="Pagination">
          <!-- Previous button -->
          <Pill
            variant="navigation"
            position="first"
            :disabled="currentPage <= 1 || disabled"
            @click="$emit('previous')"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </Pill>
          
          <!-- Page numbers -->
          <template v-for="page in visiblePages" :key="page">
            <Pill
              v-if="page !== '...'"
              :variant="page === currentPage ? 'active' : 'default'"
              position="middle"
              :disabled="disabled"
              :label="page"
              @click="$emit('goto', Number(page))"
            />
            <Pill
              v-else
              variant="default"
              position="middle"
              :static="true"
              label="..."
            />
          </template>
          
          <!-- Next button -->
          <Pill
            variant="navigation"
            position="last"
            :disabled="currentPage >= totalPages || disabled"
            @click="$emit('next')"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </Pill>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Pill from '@/components/ui/Pill.vue'

interface Props {
  currentPage: number
  totalPages: number
  total: number
  perPage: number
  disabled?: boolean
}

interface Emits {
  previous: []
  next: []
  goto: [page: number]
}

const props = defineProps<Props>()
defineEmits<Emits>()

const startItem = computed(() => {
  return (props.currentPage - 1) * props.perPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.perPage, props.total)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = props.totalPages
  const current = props.currentPage
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})
</script>