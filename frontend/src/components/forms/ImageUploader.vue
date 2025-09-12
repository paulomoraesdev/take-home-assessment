<template>
  <div>
    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      class="hidden"
    />

    <!-- Upload/Preview Area -->
    <div class="space-y-3">
      <div
        v-if="!modelValue"
        class="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        @click="triggerFileInput"
      >
        <div class="text-center">
          <svg
            class="mx-auto h-8 w-8 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <p class="text-sm text-gray-500">Click to upload image</p>
          <p class="text-xs text-gray-400">PNG, JPG up to 200KB</p>
        </div>
      </div>

      <div v-else class="flex items-center space-x-3">
        <img
          :src="modelValue"
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageCropper from '@/components/ui/ImageCropper.vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'new-image', value: boolean): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const showCropper = ref(false)
const selectedImageForCrop = ref('')

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB. Please choose a smaller image.')
    target.value = ''
    return
  }

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
  target.value = ''
}

const handleCroppedImage = (croppedImage: string) => {
  emit('update:modelValue', croppedImage)
  emit('new-image', true)
  showCropper.value = false
}

const closeCropper = () => {
  showCropper.value = false
  selectedImageForCrop.value = ''
}
</script>