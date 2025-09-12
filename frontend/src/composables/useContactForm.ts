import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import { validateCreateContactForm, validateUpdateContactForm } from '@/validations/contactForm.schema'
import type { Contact, ContactFormData } from '@/types'
import type { SaveState } from '@/components/ui/SaveButton.vue'

export function useContactForm(props: { contact?: Contact }, emit: (e: 'submit', formData: Partial<ContactFormData>) => void) {
  const contactsStore = useContactsStore()

  const form = reactive<ContactFormData>({
    name: '',
    profilePicture: '',
    lastContactAt: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
  })

  const saveState = ref<SaveState>('idle')
  const originalProfilePicture = ref<string>('')
  const hasNewImage = ref<boolean>(false)

  const isEditing = computed(() => !!props.contact)

  const isFormValid = computed(() => {
    if (isEditing.value) {
      const hasValidName = form.name.trim().length > 0
      
      // Convert string date to Date object for validation
      let lastContactDate: Date
      if (typeof form.lastContactAt === 'string') {
        lastContactDate = new Date(form.lastContactAt)
      } else if (form.lastContactAt) {
        lastContactDate = form.lastContactAt
      } else {
        lastContactDate = new Date()
      }
      const hasValidDate = lastContactDate instanceof Date && !isNaN(lastContactDate.getTime())

      let hasValidImage = true
      if (hasNewImage.value && form.profilePicture) {
        const imageResult = validateUpdateContactForm({ profilePicture: form.profilePicture })
        hasValidImage = imageResult.success
      }

      return hasValidName && hasValidDate && hasValidImage
    } else {
      // Convert string date to Date object for validation
      let lastContactDate: Date
      if (typeof form.lastContactAt === 'string') {
        lastContactDate = new Date(form.lastContactAt)
      } else if (form.lastContactAt) {
        lastContactDate = form.lastContactAt
      } else {
        lastContactDate = new Date()
      }

      const formData = {
        name: form.name,
        profilePicture: form.profilePicture,
        lastContactAt: lastContactDate
      }
      const result = validateCreateContactForm(formData)
      return result.success
    }
  })

  const populateForm = () => {
    if (props.contact) {
      form.name = props.contact.name
      form.profilePicture = props.contact.profilePicture
      
      // Convert Date to string format for input type="date"
      const contactDate = props.contact.lastContactAt || new Date()
      form.lastContactAt = contactDate instanceof Date 
        ? contactDate.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]

      originalProfilePicture.value = props.contact.profilePicture
      hasNewImage.value = false
    }
  }

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

  const setHasNewImage = (value: boolean) => {
    hasNewImage.value = value
  }

  const handleSubmit = async () => {
    saveState.value = 'saving'

    try {
      // Convert string date to Date object if needed
      let lastContactDate: Date
      if (typeof form.lastContactAt === 'string') {
        lastContactDate = new Date(form.lastContactAt)
      } else if (form.lastContactAt) {
        lastContactDate = form.lastContactAt
      } else {
        lastContactDate = new Date()
      }

      const formData: Partial<ContactFormData> = {
        name: form.name,
        lastContactAt: lastContactDate
      }

      if (hasNewImage.value) {
        formData.profilePicture = form.profilePicture
      }

      const result = await new Promise<{ success: boolean; error?: string }>((resolve) => {
        emit('submit', formData)

        setTimeout(() => {
          if (contactsStore.error) {
            resolve({ success: false, error: contactsStore.error })
          } else {
            resolve({ success: true })
          }
        }, 100)
      })

      if (result.success) {
        saveState.value = 'success'

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

  const clearForm = () => {
    form.name = ''
    form.profilePicture = ''
    form.lastContactAt = new Date().toISOString().split('T')[0]

    originalProfilePicture.value = ''
    hasNewImage.value = false

    saveState.value = 'idle'
  }

  return {
    form,
    saveState,
    isFormValid,
    handleSubmit,
    clearForm,
    setHasNewImage
  }
}