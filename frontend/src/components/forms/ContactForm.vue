<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
        Name <span class="text-red-800">*</span>
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
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Profile Picture <span class="text-red-800">*</span>
      </label>
      
      <!-- File input (hidden) -->
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
      />
      
      <!-- Upload/Preview Area -->
      <div class="space-y-3">
        <div v-if="!form.profilePicture" 
             class="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
             @click="triggerFileInput"
        >
          <div class="text-center">
            <svg class="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <p class="text-sm text-gray-500">Click to upload image</p>
            <p class="text-xs text-gray-400">PNG, JPG up to 200KB</p>
          </div>
        </div>
        
        <div v-else class="flex items-center space-x-3">
          <img 
            :src="form.profilePicture" 
            alt="Profile preview" 
            class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div class="flex-1">
            <button
              type="button"
              @click="triggerFileInput"
              class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>
      </div>
      
      <!-- Image Cropper Modal -->
      <ImageCropper
        :show="showCropper"
        :image="selectedImageForCrop"
        @close="closeCropper"
        @crop="handleCroppedImage"
      />
    </div>
    
    <div>
      <label for="lastContactAt" class="block text-sm font-medium text-gray-700 mb-1">
        Last Contact Date <span class="text-red-800">*</span>
      </label>
      <input
        id="lastContactAt"
        v-model="lastContactDateInput"
        type="text"
        required
        placeholder="MM/DD/YYYY"
        pattern="^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    
    <div class="flex justify-end">
      <SaveButton 
        type="submit" 
        :state="saveState"
        :disabled="!isFormValid"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import SaveButton from '@/components/ui/SaveButton.vue'
import ImageCropper from '@/components/ui/ImageCropper.vue'
import { validateCreateContactForm, validateUpdateContactForm } from '@/validations/contactForm.schema'
import type { Contact, ContactFormData } from '@/types'
import type { SaveState } from '@/components/ui/SaveButton.vue'

interface Props {
  contact?: Contact
}

interface Emits {
  submit: [formData: Partial<ContactFormData>]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const contactsStore = useContactsStore()

const form = reactive<ContactFormData>({
  name: '',
  profilePicture: '',
  lastContactAt: new Date()
})

const saveState = ref<SaveState>('idle')
const originalProfilePicture = ref<string>('')
const hasNewImage = ref<boolean>(false)

// Cropper state
const fileInputRef = ref<HTMLInputElement | null>(null)
const showCropper = ref(false)
const selectedImageForCrop = ref('')

const isEditing = computed(() => !!props.contact)

// Form validation
const isFormValid = computed(() => {
  if (isEditing.value) {
    // For editing, we need at least name and lastContactAt to be valid
    // ProfilePicture is optional unless hasNewImage is true
    const hasValidName = form.name.trim().length > 0
    const hasValidDate = form.lastContactAt instanceof Date && !isNaN(form.lastContactAt.getTime())
    
    let hasValidImage = true
    if (hasNewImage.value && form.profilePicture) {
      // Only validate image if user uploaded a new one
      const imageResult = validateUpdateContactForm({ profilePicture: form.profilePicture })
      hasValidImage = imageResult.success
    }
    
    return hasValidName && hasValidDate && hasValidImage
  } else {
    // For creation, all fields are required
    const formData = {
      name: form.name,
      profilePicture: form.profilePicture,
      lastContactAt: form.lastContactAt
    }
    const result = validateCreateContactForm(formData)
    return result.success
  }
})

// Helper to convert Date to MM/DD/YYYY input format
const formatDateForInput = (date: Date | undefined): string => {
  if (!date) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

// Helper to convert MM/DD/YYYY input to Date
const parseInputDate = (dateString: string): Date => {
  if (!dateString.trim()) return new Date()
  // Parse MM/DD/YYYY format
  const [month, day, year] = dateString.split('/')
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}

const lastContactDateInput = computed({
  get: () => formatDateForInput(form.lastContactAt),
  set: (value: string) => {
    form.lastContactAt = parseInputDate(value)
  }
})

// Image upload and cropping functions
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file size (5MB max before cropping)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB. Please choose a smaller image.')
    target.value = ''
    return
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    alert('Please select a JPG or PNG image file.')
    target.value = ''
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    if (result) {
      selectedImageForCrop.value = result
      showCropper.value = true
    }
  }
  reader.onerror = () => {
    alert('Error reading file. Please try again.')
    target.value = ''
  }
  reader.readAsDataURL(file)
  
  // Reset file input
  target.value = ''
}

const handleCroppedImage = (croppedImage: string) => {
  form.profilePicture = croppedImage
  hasNewImage.value = true
  showCropper.value = false
}

const closeCropper = () => {
  showCropper.value = false
  selectedImageForCrop.value = ''
}


const populateForm = () => {
  if (props.contact) {
    form.name = props.contact.name
    form.profilePicture = props.contact.profilePicture
    form.lastContactAt = props.contact.lastContactAt || new Date()
    
    // Store original image and reset new image flag
    originalProfilePicture.value = props.contact.profilePicture
    hasNewImage.value = false
  }
}

// Watch for contact prop changes to populate form
watch(
  () => props.contact,
  (newContact) => {
    if (newContact) {
      populateForm()
    }
  },
  { immediate: true }
)

onMounted(() => {
  populateForm()
})

const handleSubmit = async () => {
  saveState.value = 'saving'
  
  try {
    // Prepare form data - only include profilePicture if it's new
    const formData: Partial<ContactFormData> = {
      name: form.name,
      lastContactAt: form.lastContactAt
    }
    
    // Only include profilePicture if user uploaded a new image
    if (hasNewImage.value) {
      formData.profilePicture = form.profilePicture
    }
    
    const result = await new Promise<{ success: boolean; error?: string }>((resolve) => {
      // Emit and wait for parent to process
      emit('submit', formData)
      
      // Since emit is synchronous, we need to wait a bit for async processing
      // This is a temporary solution - ideally the parent should return a promise
      setTimeout(async () => {
        // Check if there was an error in the store
        if (contactsStore.error) {
          resolve({ success: false, error: contactsStore.error })
        } else {
          resolve({ success: true })
        }
      }, 100)
    })
    
    if (result.success) {
      saveState.value = 'success'
      
      // For editing mode, return to idle state after 3 seconds
      if (isEditing.value) {
        setTimeout(() => {
          saveState.value = 'idle'
        }, 3000)
      }
    } else {
      saveState.value = 'error'
      console.error('Submit failed:', result.error)
      setTimeout(() => {
        saveState.value = 'idle'
      }, 2000)
    }
  } catch (error) {
    saveState.value = 'error'
    console.error('Submit error:', error)
    setTimeout(() => {
      saveState.value = 'idle'
    }, 2000)
  }
}

// Method to clear form (exposed to parent)
const clearForm = () => {
  // Reset form fields
  form.name = ''
  form.profilePicture = ''
  form.lastContactAt = new Date()
  
  // Reset image state
  originalProfilePicture.value = ''
  hasNewImage.value = false
  
  // Reset cropper state
  selectedImageForCrop.value = ''
  showCropper.value = false
  
  // Reset save state
  saveState.value = 'idle'
  
  // Clear file input if it exists
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// Expose clearForm method to parent component
defineExpose({
  clearForm
})
</script>