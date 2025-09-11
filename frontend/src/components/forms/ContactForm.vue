<template>
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
      <label for="profilePicture" class="block text-sm font-medium text-gray-700 mb-1">
        Profile Picture
      </label>
      <input
        id="profilePicture"
        type="file"
        accept="image/*"
        @change="handleImageUpload"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div v-if="form.profilePicture" class="mt-2">
        <img 
          :src="form.profilePicture" 
          alt="Profile preview" 
          class="w-16 h-16 rounded-full object-cover"
        />
      </div>
    </div>
    
    <div>
      <label for="lastContactAt" class="block text-sm font-medium text-gray-700 mb-1">
        Last Contact Date
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
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue'
import SaveButton from '@/components/ui/SaveButton.vue'
import type { Contact, ContactFormData } from '@/types'
import type { SaveState } from '@/components/ui/SaveButton.vue'

interface Props {
  contact?: Contact
}

interface Emits {
  submit: [formData: ContactFormData]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive<ContactFormData>({
  name: '',
  profilePicture: '',
  lastContactAt: new Date()
})

const saveState = ref<SaveState>('idle')

const isEditing = computed(() => !!props.contact)

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

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.profilePicture = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const populateForm = () => {
  if (props.contact) {
    form.name = props.contact.name
    form.profilePicture = props.contact.profilePicture
    form.lastContactAt = props.contact.lastContactAt || new Date()
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
    emit('submit', { ...form })
    saveState.value = 'success'
  } catch (error) {
    saveState.value = 'error'
    setTimeout(() => {
      saveState.value = 'idle'
    }, 2000)
  }
}
</script>