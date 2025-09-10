<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppContainer from '@/components/AppContainer.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppContent from '@/components/AppContent.vue'
import Button from '@/components/ui/Button.vue'
</script>

<template>
  <AppContainer>
    <AppHeader>
      <h1 class="font-questrial font-bold text-5xl">Contacts</h1>
      <RouterLink to="/contact">
        <Button aria-label="Add new contact">
          + Add Contact
        </Button>
      </RouterLink>
    </AppHeader>
    
    <AppContent>
      <!-- Contact list/table will go here -->
      <p>Contact list will be displayed here</p>
    </AppContent>
    
    <!-- Modal routes will be rendered here -->
    <RouterView />
  </AppContainer>
</template>
