// Modal component props
export interface ModalProps {
  show?: boolean
  closeOnOverlay?: boolean
  showCloseButton?: boolean
  ariaLabelledby?: string
  ariaDescribedby?: string
}

// Button component variants
export type ButtonType = 'button' | 'submit' | 'reset'

// ARIA attributes for components
export interface AriaAttributes {
  ariaLabel?: string
  ariaDescribedby?: string
  ariaExpanded?: boolean | 'true' | 'false'
  ariaPressed?: boolean | 'true' | 'false'
}