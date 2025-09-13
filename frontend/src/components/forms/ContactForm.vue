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
      <ImageUploader :model-value="form.profilePicture || ''" @update:model-value="form.profilePicture = $event" @new-image="setHasNewImage" />
    </div>
    
    <div>
      <label for="lastContactAt" class="block text-sm font-medium text-slate-800 dark:text-gray-200 mb-1">
        Last Contact Date <span class="text-red-800">*</span>
      </label>
      <input
        id="lastContactAt"
        v-model="form.lastContactAt"
        type="date"
        :max="new Date().toISOString().split('T')[0]"
        required
        class="w-full px-3 py-2 border-0 bg-gray-200 dark:bg-slate-900 rounded-md focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 date-input"
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

<style scoped>
/* Custom date input styling */
.date-input {
  /* Webkit/Chromium - style calendar icon */
  color-scheme: light dark;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(0.5); /* Make icon darker */
  cursor: pointer;
  padding: 4px;
}

/* Dark mode - invert icon color */
.dark .date-input::-webkit-calendar-picker-indicator {
  filter: invert(0.8) brightness(1.2); /* Make icon lighter in dark mode */
}

/* Firefox - limited but we can adjust general appearance */
@-moz-document url-prefix() {
  .date-input {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>');
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
  }

  .dark .date-input {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23ccc" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>');
  }
}
</style>