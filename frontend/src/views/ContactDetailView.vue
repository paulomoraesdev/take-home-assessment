<template>
  <Modal 
    :show="true" 
    @close="handleClose"
    aria-labelledby="contact-edit-title"
    aria-describedby="contact-edit-description"
  >
    <template #header>
      <h2 id="contact-edit-title" class="text-xl font-semibold text-gray-900">
        Edit Contact
      </h2>
    </template>
    
    <div id="contact-edit-description">
      <div v-if="loading" class="flex justify-center py-8">
        <svg class="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <ContactForm 
        v-else-if="contact"
        :contact="contact"
        @submit="handleSubmit"
      />
      
      <div v-else class="text-center py-8">
        <p class="text-gray-500">Contact not found</p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useContactsStore } from '@/stores/contacts'
import Modal from '@/components/ui/Modal.vue'
import ContactForm from '@/components/forms/ContactForm.vue'
import type { Contact, ContactFormData } from '@/types'

const router = useRouter()
const route = useRoute()
const contactsStore = useContactsStore()

const loading = ref(true)
const contact = ref<Contact | null>(null)

const loadContact = async () => {
  loading.value = true
  
  try {
    const contactId = route.params.id as string
    
    // First try to find contact in store (cached data)
    const cachedContact = contactsStore.contacts.find(c => c.id === contactId)
    
    if (cachedContact) {
      // Use cached data
      contact.value = cachedContact
      loading.value = false
    } else {
      // Fetch from API if not in cache (direct access via URL)
      contact.value = await contactsStore.getContactById(contactId)
      loading.value = false
    }
  } catch (error) {
    console.error('Error loading contact:', error)
    loading.value = false
  }
}

const handleSubmit = async (formData: ContactFormData) => {
  if (!contact.value) return
  
  try {
    const success = await contactsStore.updateContact(contact.value.id, formData)
    if (success) {
      setTimeout(() => {
        handleClose()
      }, 1000)
      return { success: true }
    } else {
      return { success: false, error: 'Failed to update contact' }
    }
  } catch (error) {
    console.error('Error in handleSubmit:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

const handleClose = () => {
  router.push('/')
}

onMounted(() => {
  loadContact()
})
</script>