<template>
  <button 
    v-bind="$attrs"
    class="
      bg-blue-500
      text-white
      px-4
      py-2
      rounded
      hover:bg-blue-600
      focus:outline-none
      focus:ring-2
      focus:ring-blue-400
      disabled:opacity-50
      disabled:cursor-not-allowed
      disabled:hover:bg-blue-500
      transition-colors
      duration-200
    "
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>