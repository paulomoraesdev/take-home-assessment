<template>
  <div 
    class="absolute inset-0 bg-red-500/90 flex items-center justify-center z-10 transition-all duration-200 ease-in-out overflow-hidden"
    role="dialog"
    aria-modal="true"
    :aria-label="isDeleting ? `Deleting ${contactName}...` : `Confirm deletion of ${contactName}`"
  >
    <div class="text-center text-white px-2">
      <!-- Loading state -->
      <div v-if="isDeleting" class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mb-2"></div>
        <span class="font-questrial text-xs">
          Deleting "{{ contactName }}"...
        </span>
      </div>
      
      <!-- Confirmation state -->
      <div v-else>
        <span class="font-questrial text-xs p-0 m-0">
          Are you sure you want to permanently delete "{{ contactName }}"?
        </span>
        <div class="flex gap-1 justify-center">
          <button 
            @click="$emit('cancel')"
            class="px-3 py-1.5 cursor-pointer text-white rounded text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            type="button"
          >
            Cancel
          </button>
          <button 
            @click="$emit('confirm')"
            class="px-3 py-1.5 cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  contactName: string
  isDeleting?: boolean
}

interface Emits {
  cancel: []
  confirm: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>