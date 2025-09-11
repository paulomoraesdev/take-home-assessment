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
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter contact name"
          />
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter email address"
          />
        </div>
        
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter phone number"
          />
        </div>
      </form>
    </div>
    
    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button 
          type="button" 
          @click="handleClose"
          class="bg-red-500 text-red-800 dark:text-gray-50"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          @click="handleSubmit"
        >
          Save
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useContactsStore } from '@/stores/contacts'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import type { ContactFormData } from '@/types'

const router = useRouter()
const contactsStore = useContactsStore()

const form = reactive<ContactFormData>({
  name: '',
  profilePicture: '',
  lastContactAt: new Date()
})

const handleClose = () => {
  router.push('/')
}

const handleSubmit = async () => {
  const success = await contactsStore.createContact(form)
  if (success) {
    handleClose()
  }
}
</script>