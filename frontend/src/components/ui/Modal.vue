<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="handleOverlayClick"
      >
        <!-- Overlay/Backdrop -->
        <div class="absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>
        
        <!-- Modal Content -->
        <div 
          class="
            relative
            bg-white
            rounded-lg
            shadow-xl
            max-w-xl
            w-full
            mx-4
            max-h-[90vh]
            overflow-y-auto
          "
          role="dialog" 
          aria-modal="true"
          :aria-labelledby="ariaLabelledby"
          :aria-describedby="ariaDescribedby"
        >
          <!-- Header -->
          <div v-if="$slots.header" class="px-6 py-4">
            <slot name="header"></slot>
          </div>
          
          <!-- Body -->
          <div class="px-6 py-4">
            <slot></slot>
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 py-4">
            <slot name="footer"></slot>
          </div>
          
          <!-- Close Button -->
          <button
            v-if="showCloseButton"
            @click="$emit('close')"
            class="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
            aria-label="Close modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

interface Props {
  show?: boolean
  closeOnOverlay?: boolean
  showCloseButton?: boolean
  ariaLabelledby?: string
  ariaDescribedby?: string
}

interface Emits {
  close: []
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  closeOnOverlay: true,
  showCloseButton: true,
  ariaLabelledby: undefined,
  ariaDescribedby: undefined
})

const emit = defineEmits<Emits>()

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    emit('close')
  }
}

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    emit('close')
  }
}

watch(() => props.show, (newShow) => {
  if (newShow) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>