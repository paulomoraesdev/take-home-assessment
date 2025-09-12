<template>
  <Button 
    v-bind="$attrs"
    :small="small"
    :loading="state === 'saving'"
    :disabled="disabled || state === 'saving'"
    :class="stateClasses"
    @click="handleClick"
  >
    {{ stateText }}
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from './Button.vue'

export type SaveState = 'idle' | 'saving' | 'success' | 'error'

interface Props {
  small?: boolean
  state?: SaveState
  disabled?: boolean
  saveText?: string
  savingText?: string
  successText?: string
  errorText?: string
}

interface Emits {
  click: []
}

const props = withDefaults(defineProps<Props>(), {
  small: false,
  state: 'idle',
  disabled: false,
  saveText: 'Save',
  savingText: 'Saving...',
  successText: 'Saved!',
  errorText: 'Error'
})

const emit = defineEmits<Emits>()

const stateText = computed(() => {
  switch (props.state) {
    case 'saving': return props.savingText
    case 'success': return props.successText
    case 'error': return props.errorText
    default: return props.saveText
  }
})

const stateClasses = computed(() => {
  switch (props.state) {
    case 'success':
      return '!bg-green-500 hover:!bg-green-600 focus:!ring-green-400'
    case 'error':
      return '!bg-red-500 hover:!bg-red-600 focus:!ring-red-400'
    default:
      return ''
  }
})

const handleClick = () => {
  if (!props.disabled && props.state !== 'saving') {
    emit('click')
  }
}

defineOptions({
  inheritAttrs: false
})
</script>