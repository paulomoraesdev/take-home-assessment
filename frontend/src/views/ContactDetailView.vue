<template>
  <Modal 
    :show="true" 
    @close="handleClose"
    aria-labelledby="contact-detail-title"
    aria-describedby="contact-detail-description"
  >
    <template #header>
      <h2 id="contact-detail-title" class="text-xl font-semibold text-gray-900">
        {{ isEditing ? 'Edit Contact' : 'Contact Details' }}
      </h2>
    </template>
    
    <div id="contact-detail-description">
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      
      <div v-else-if="contact" class="space-y-4">
        <template v-if="isEditing">
          <form @submit.prevent="handleSave" class="space-y-4">
            <div>
              <label for="edit-name" class="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="edit-name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label for="edit-email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="edit-email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label for="edit-phone" class="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="edit-phone"
                v-model="form.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </template>
        
        <template v-else>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-500">Name</label>
              <p class="text-gray-900">{{ contact.name }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-500">Email</label>
              <p class="text-gray-900">{{ contact.email }}</p>
            </div>
            
            <div v-if="contact.phone">
              <label class="block text-sm font-medium text-gray-500">Phone</label>
              <p class="text-gray-900">{{ contact.phone }}</p>
            </div>
          </div>
        </template>
      </div>
      
      <div v-else class="text-center py-8">
        <p class="text-gray-500">Contact not found</p>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button 
          v-if="isEditing"
          type="button" 
          @click="cancelEdit"
          class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancel
        </Button>
        
        <Button 
          v-if="!isEditing && contact"
          type="button" 
          @click="startEdit"
          class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
        >
          Edit
        </Button>
        
        <Button 
          v-if="isEditing"
          type="submit" 
          @click="handleSave"
          class="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
        >
          Save Changes
        </Button>
        
        <Button 
          type="button" 
          @click="handleClose"
          class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Close
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useContactsStore } from '@/stores/contacts'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import type { Contact, ContactFormData } from '@/types'

const router = useRouter()
const route = useRoute()
const contactsStore = useContactsStore()

const loading = ref(true)
const isEditing = ref(false)
const contact = ref<Contact | null>(null)

const form = reactive<ContactFormData>({
  name: '',
  profilePicture: '',
  lastContactAt: new Date()
})

const loadContact = async () => {
  loading.value = true
  try {
    const contactId = route.params.id as string
    contact.value = await contactsStore.getContactById(contactId)
    resetForm()
  } catch (error) {
    console.error('Error loading contact:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  if (contact.value) {
    form.name = contact.value.name
    form.profilePicture = contact.value.profilePicture
    form.lastContactAt = contact.value.lastContactAt
  }
}

const startEdit = () => {
  isEditing.value = true
  resetForm()
}

const cancelEdit = () => {
  isEditing.value = false
  resetForm()
}

const handleSave = async () => {
  if (!contact.value) return
  
  const updated = await contactsStore.updateContact(contact.value.id, form)
  if (updated) {
    contact.value = updated
    isEditing.value = false
  }
}

const handleClose = () => {
  router.push('/')
}

onMounted(() => {
  loadContact()
})
</script>