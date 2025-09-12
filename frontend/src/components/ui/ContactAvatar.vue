<template>
  <div class="relative">
    <!-- Profile Image (when available and not errored) -->
    <img
      v-if="contact.profilePicture && avatarState !== 'error'"
      :src="contact.profilePicture"
      :alt="`Profile picture of ${contact.name}`"
      :class="avatarClasses"
      @load="handleImageLoad"
      @error="handleImageError"
    />
    
    <!-- Fallback: Initial Letter Avatar -->
    <div
      v-else
      :class="[avatarClasses, avatarColor, 'text-white font-semibold flex items-center justify-center select-none']"
      :aria-label="`${firstLetter} avatar for ${contact.name}`"
      role="img"
    >
      {{ firstLetter }}
    </div>
    
    <!-- Loading State -->
    <div
      v-if="contact.profilePicture && avatarState === 'loading'"
      :class="[avatarClasses, 'absolute inset-0 bg-gray-200 dark:bg-slate-600 animate-pulse rounded-full']"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Contact } from '@/types'

interface Props {
  contact: Pick<Contact, 'name' | 'profilePicture'>
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  class: ''
})

// Avatar state management
const avatarState = ref<'loading' | 'loaded' | 'error'>('loading')

// Size classes mapping
const sizeClasses = {
  sm: 'h-10 w-10 text-sm',     // Desktop grid
  md: 'h-12 w-12 text-base',   // Mobile card  
  lg: 'h-16 w-16 text-lg'      // Profile pages (future use)
}

// Combined avatar classes
const avatarClasses = computed(() => {
  return `${sizeClasses[props.size]} rounded-full object-cover ${props.class}`.trim()
})

// Get first letter of contact name
const firstLetter = computed(() => {
  if (!props.contact.name) return '?'
  return props.contact.name.charAt(0).toUpperCase()
})

// Consistent color system based on first letter
const AVATAR_COLORS = [
  'bg-blue-500',      // A, G, M, S, Y
  'bg-green-500',     // B, H, N, T, Z  
  'bg-purple-500',    // C, I, O, U
  'bg-red-500',       // D, J, P, V
  'bg-yellow-500',    // E, K, Q, W
  'bg-indigo-500',    // F, L, R, X
]

const avatarColor = computed(() => {
  if (!props.contact.name) return 'bg-gray-500'
  
  const firstChar = props.contact.name.charAt(0).toUpperCase()
  const charCode = firstChar.charCodeAt(0)
  
  // Map A-Z (65-90) to color indices
  const colorIndex = (charCode - 65) % AVATAR_COLORS.length
  return AVATAR_COLORS[Math.max(0, colorIndex)] || 'bg-gray-500'
})

// Event handlers
const handleImageLoad = () => {
  avatarState.value = 'loaded'
}

const handleImageError = () => {
  avatarState.value = 'error'
}

// Initialize state
if (props.contact.profilePicture) {
  avatarState.value = 'loading'
} else {
  avatarState.value = 'error' // Force fallback when no image
}
</script>

<style scoped>
/* Ensure smooth transitions between states */
.avatar-transition {
  transition: opacity 150ms ease-in-out;
}

/* Prevent text selection on initials */
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>