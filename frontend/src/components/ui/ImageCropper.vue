<template>
  <Modal :show="show" @close="handleCancel" aria-labelledby="image-crop-title">
    <template #header>
      <h2 id="image-crop-title" class="text-xl font-semibold text-gray-900">
        Crop Profile Picture
      </h2>
    </template>
    
    <div class="space-y-4">
      <!-- Cropper Area -->
      <div class="relative bg-gray-50 rounded-lg overflow-hidden" style="height: 400px;">
        <Cropper
          ref="cropperRef"
          :src="image"
          :stencil-component="CircleStencil"
          :stencil-props="stencilProps"
          :default-size="cropperDefaultSize"
          :min-width="50"
          :min-height="50"
          :default-transforms="defaultTransforms"
          :resize-image="{
            adjustStencil: false,
            wheel: {
              ratio: 0.1
            }
          }"
          class="w-full h-full"
          @ready="onCropperReady"
        />
      </div>
      
      <!-- Preview Section -->
      <div v-if="preview" class="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <div class="text-sm text-gray-600">
          Preview:
        </div>
        <img 
          :src="preview" 
          alt="Crop preview" 
          class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
        />
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="!cropperReady || processing"
          @click="handleConfirm"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="processing" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Confirm</span>
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import Modal from './Modal.vue'
import 'vue-advanced-cropper/dist/style.css'

interface Props {
  show: boolean
  image: string
}

interface Emits {
  close: []
  crop: [croppedImage: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)
const cropperReady = ref(false)
const processing = ref(false)
const preview = ref<string>('')

// Default size function for responsive cropper
const cropperDefaultSize = {
  width: 200,
  height: 200
}

// Default transforms to fit image in container
const defaultTransforms = ({ cropper, imageSize }: any) => {
  return {
    scaleX: Math.min(cropper.width / imageSize.width, cropper.height / imageSize.height),
    scaleY: Math.min(cropper.width / imageSize.width, cropper.height / imageSize.height),
    translateX: 0,
    translateY: 0
  }
}

// Stencil configuration for circular crop
const stencilProps = {
  movable: true,
  resizable: true,
  scalable: true,
  aspectRatio: 1,
  minWidth: 50,
  minHeight: 50
}

// Watch for image changes to reset state
watch(() => props.image, () => {
  cropperReady.value = false
  preview.value = ''
})

const onCropperReady = () => {
  cropperReady.value = true
  updatePreview()
}

const updatePreview = () => {
  if (!cropperRef.value || !cropperReady.value) return
  
  try {
    const canvas = (cropperRef.value as any).getCanvas({
      width: 200,
      height: 200,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    })
    
    if (canvas) {
      preview.value = canvas.toDataURL('image/jpeg', 0.9)
    }
  } catch (error) {
    console.error('Error generating preview:', error)
  }
}

const handleCancel = () => {
  emit('close')
}

const handleConfirm = async () => {
  if (!cropperRef.value || !cropperReady.value) return
  
  processing.value = true
  
  try {
    const canvas = (cropperRef.value as any).getCanvas({
      width: 200,
      height: 200,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    })
    
    if (canvas) {
      const croppedImage = canvas.toDataURL('image/jpeg', 0.9)
      emit('crop', croppedImage)
    }
  } catch (error) {
    console.error('Error cropping image:', error)
  } finally {
    processing.value = false
  }
}

// Update preview when cropper changes
watch(cropperReady, () => {
  if (cropperReady.value) {
    updatePreview()
  }
})
</script>

<style scoped>
/* Additional custom styles for the cropper if needed */
.cropper {
  max-height: 400px;
}
</style>