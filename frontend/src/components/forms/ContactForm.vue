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
      <ImageUploader v-model="form.profilePicture" @new-image="setHasNewImage" />
    </div>
    
    <div>
      <label for="lastContactAt" class="block text-sm font-medium text-gray-700 mb-1">
        Last Contact Date <span class="text-red-800">*</span>
      </label>
      <VueDatePicker
        v-model="form.lastContactAt"
        format="MM/dd/yyyy"
        :enable-time-picker="false"
        placeholder="MM/DD/YYYY"
        :required="true"
        :clearable="false"
        class="w-full"
        input-class-name="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    
    <div class="flex justify-end">
      <SaveButton type="submit" :state="saveState" :disabled="!isFormValid" />
    </div>
  </form>
</template>

<script setup lang="ts">
import ImageUploader from '@/components/forms/ImageUploader.vue'
import SaveButton from '@/components/ui/SaveButton.vue'
import { useContactForm } from '@/composables/useContactForm'
import type { Contact, ContactFormData } from '@/types'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

interface Props {
  contact?: Contact
}

interface Emits {
  submit: [formData: Partial<ContactFormData>]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { form, saveState, isFormValid, handleSubmit, clearForm, setHasNewImage } = useContactForm(props, emit)

// Expose clearForm method to parent component
defineExpose({
  clearForm
})
</script>