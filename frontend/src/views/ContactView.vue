<template>
  <Modal 
    :show="true" 
    @close="handleClose"
    aria-labelledby="contact-title"
    aria-describedby="contact-description"
  >
    <template #header>
      <h2 id="contact-title" class="text-xl font-semibold text-gray-900">
        Create a new contact
      </h2>
    </template>
    
    <div id="contact-description">
      <ContactForm 
        @submit="handleSubmit"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useContactsStore } from '@/stores/contacts'
import Modal from '@/components/ui/Modal.vue'
import ContactForm from '@/components/forms/ContactForm.vue'
import type { ContactFormData } from '@/types'

const router = useRouter()
const contactsStore = useContactsStore()

const handleClose = () => {
  router.push('/')
}

const handleSubmit = async (formData: ContactFormData) => {
  const success = await contactsStore.createContact(formData)
  
  if (success) {
    setTimeout(() => {
      handleClose()
    }, 1000)
  }
}
</script>