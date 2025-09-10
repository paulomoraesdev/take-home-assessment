<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import AppContainer from '@/components/AppContainer.vue'
import AppHeader    from '@/components/AppHeader.vue'
import Button       from '@/components/ui/Button.vue'


</script>

<template>
  <AppContainer>
    <AppHeader>
      <h1>Contacts</h1>
      <Button 
        @click="handleSave"
        :disabled="loading"
        aria-label="Save data"
      >
        Save
      </Button>
    </AppHeader>
    <RouterView />
  </AppContainer>
</template>
