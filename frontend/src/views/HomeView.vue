<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useContactsStore } from '@/stores/contacts'
import AppContainer from '@/components/layout/AppContainer.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppContent from '@/components/layout/AppContent.vue'
import Button from '@/components/ui/Button.vue'
import ContactEmptyState from '@/components/contacts/ContactEmptyState.vue'
import ContactTable from '@/components/contacts/ContactTable.vue'

const contactsStore = useContactsStore()

const hasContacts = computed(() => contactsStore.hasContacts)
const loading = computed(() => contactsStore.loading)

onMounted(() => {
  // Initial fetch to determine if we have contacts
  contactsStore.fetchContacts()
})
</script>

<template>
  <AppContainer>
    <AppHeader>
      <h1 
        class="font-questrial font-bold text-5xl text-slate-900 dark:text-gray-100"
      >
        Contacts
      </h1>
      <RouterLink to="/contact">
        <Button aria-label="Add new contact">
          + Add Contact
        </Button>
      </RouterLink>
    </AppHeader>
    
    <AppContent>
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-16">
        <svg class="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <!-- Empty state when no contacts exist -->
      <ContactEmptyState v-else-if="!hasContacts" />
      
      <!-- Contact table when contacts exist -->
      <ContactTable v-else />
    </AppContent>
    
    <!-- 
      Children route to deal with Modals
    -->
    <RouterView />
  </AppContainer>
</template>
