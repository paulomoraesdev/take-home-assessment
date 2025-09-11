<template>
  <button 
    v-bind="$attrs"
    :class="buttonClasses"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  small?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  small: false,
  loading: false
})

const buttonClasses = computed(() => [
  'bg-blue-500',
  'text-white',
  'rounded-4xl',
  'transition-all',
  'hover:scale-[1.05]',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-blue-400',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
  'disabled:hover:bg-blue-500',
  'duration-100',
  'cursor-pointer',
  'font-questrial',
  props.small ? 'px-3 py-1.5' : 'px-6 py-3',
  props.loading && 'opacity-75 cursor-wait'
])

defineOptions({
  inheritAttrs: false
})
</script>