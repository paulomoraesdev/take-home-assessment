<template>
  <h2 
    :id="id" 
    class="text-xl font-semibold text-gray-900 dark:text-gray-100"
  >
    <slot>{{ title }}</slot>
  </h2>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  title?: string
}

withDefaults(defineProps<Props>(), {
  id: undefined,
  title: undefined
})
</script>