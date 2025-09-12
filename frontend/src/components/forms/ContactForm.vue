<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-slate-800 dark:text-gray-200 mb-1">
        Name <span class="text-red-800">*</span>
      </label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
        class="w-full px-3 py-2 border-0 bg-gray-200 dark:bg-slate-900 rounded-md focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        placeholder="Enter contact name"
      />
    </div>
    
    <div>
      <label class="block text-sm font-medium text-slate-800 dark:text-gray-200 mb-1">
        Profile Picture <span class="text-red-800">*</span>
      </label>
      <ImageUploader v-model="form.profilePicture" @new-image="setHasNewImage" />
    </div>
    
    <div>
      <label for="lastContactAt" class="block text-sm font-medium text-slate-800 dark:text-gray-200 mb-1">
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
        input-class-name="w-full px-3 py-2 bg-gray-200 dark:bg-slate-900 rounded-md focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
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

defineExpose({
  clearForm
})
</script>