<template>
  <button
    v-if="!static"
    :disabled="disabled"
    :class="pillClasses"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
  <span
    v-else
    :class="pillClasses"
  >
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type PillVariant = 'default' | 'active' | 'navigation'
type PillPosition = 'first' | 'middle' | 'last' | 'single'

interface Props {
  variant?: PillVariant
  position?: PillPosition
  disabled?: boolean
  static?: boolean // For non-clickable items like "..."
  label?: string | number
}

interface Emits {
  click: []
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  position: 'middle',
  disabled: false,
  static: false
})

const emit = defineEmits<Emits>()

const pillClasses = computed(() => {
  const baseClasses = 'relative inline-flex items-center rounded-full justify-center h-10 w-10'
  
  // Position-specific classes (for rounded corners)
  const positionClasses = {
    first: 'px-2 py-2',
    middle: 'px-4 py-2',
    last: 'px-2 py-2',
    single: 'px-4 py-2 rounded-md'
  }
  
  // Variant-specific classes
  const variantClasses = {
    default: props.static
      ? 'bg-gray-200 dark:bg-slate-900'
      : 'bg-slate-800 text-gray-50 cursor-pointer dark:bg-slate-300 dark:text-slate-800',
    active: 'z-10 bg-blue-500 text-white',
    navigation: 'bg-slate-800 text-gray-50 cursor-pointer dark:bg-slate-300 dark:text-slate-800'
  }
  
  // Disabled classes
  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return [
    baseClasses,
    positionClasses[props.position],
    variantClasses[props.variant],
    disabledClasses
  ].filter(Boolean).join(' ')
})

const handleClick = () => {
  if (!props.disabled && !props.static) {
    emit('click')
  }
}
</script>