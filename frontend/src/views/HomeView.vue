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
      <!-- Empty state when no contacts exist -->
      <ContactEmptyState v-if="!hasContacts" />
      
      <!-- Contact table when contacts exist -->
      <ContactTable v-else />
    </AppContent>
    
    <!-- 
      Children route to deal with Modals
    -->
    <RouterView />
  </AppContainer>
</template>
