<template>
  <Modal 
    :show="true" 
    @close="handleClose"
    aria-labelledby="contact-edit-title"
    aria-describedby="contact-edit-description"
  >
    <template #header>
      <ModalTitle 
        id="contact-edit-title" 
        title="Edit Contact" 
      />
    </template>
    
    <div id="contact-edit-description">
      <div v-if="loading" class="flex justify-center py-8">
        <ModalSpinner />
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
import ModalTitle from '@/components/ui/ModalTitle.vue'
import ContactForm from '@/components/forms/ContactForm.vue'
import ModalSpinner from '@/components/ui/ModalSpinner.vue'
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

const handleSubmit = async (formData: Partial<ContactFormData>) => {
  if (!contact.value) return
  
  try {
    const updatedContact = await contactsStore.updateContact(contact.value.id, formData)
    if (updatedContact) {
      // Update the local contact ref with the updated data
      contact.value = updatedContact
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