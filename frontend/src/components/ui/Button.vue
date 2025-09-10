<template>
  <button 
    v-bind="$attrs"
    class="
      bg-blue-500
      text-white
      px-6
      py-3
      rounded-4xl
      transition-all
      hover:scale-[1.05]
      focus:outline-none
      focus:ring-2
      focus:ring-blue-400
      disabled:opacity-50
      disabled:cursor-not-allowed
      disabled:hover:bg-blue-500
      duration-100
      cursor-pointer
      font-questrial
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