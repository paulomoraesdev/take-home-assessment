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
        ref="contactFormRef"
        @submit="handleSubmit"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useContactsStore } from '@/stores/contacts'
import Modal from '@/components/ui/Modal.vue'
import ContactForm from '@/components/forms/ContactForm.vue'
import type { ContactFormData } from '@/types'

const router = useRouter()
const contactsStore = useContactsStore()
const contactFormRef = ref<InstanceType<typeof ContactForm> | null>(null)

const handleClose = () => {
  router.push('/')
}

const handleSubmit = async (formData: Partial<ContactFormData>) => {
  // Ensure required fields are present for creation
  const completeFormData: ContactFormData = {
    name: formData.name || '',
    profilePicture: formData.profilePicture,
    lastContactAt: formData.lastContactAt || new Date()
  }
  
  const success = await contactsStore.createContact(completeFormData)
  
  if (success) {
    // Instead of closing modal, clear the form for new entry
    if (contactFormRef.value) {
      contactFormRef.value.clearForm()
    }
  }
}
</script>