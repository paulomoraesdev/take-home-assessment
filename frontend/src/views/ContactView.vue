<template>
  <Modal 
    :show="true" 
    @close="handleClose"
    aria-labelledby="contact-title"
    aria-describedby="contact-description"
  >
    <template #header>
      <h2 id="contact-title" class="text-xl font-semibold text-gray-900">
        Add New Contact
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
          class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          @click="handleSubmit"
          class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
        >
          Save Contact
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  phone: ''
})

const handleClose = () => {
  router.push('/')
}

const handleSubmit = () => {
  // TODO: Implement contact save logic
  console.log('Saving contact:', form)
  handleClose()
}
</script>