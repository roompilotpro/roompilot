import { forwardRef } from 'react'
import ModalBase from '../ModalBase'
import { Button } from '../../primitives'
import classNames from '../../../utils/classNames'

// Animation for form content transitions
const formStyles = `
  @keyframes fadeInContent {
    from { opacity: 0; transform: translateX(10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .form-content-animate { animation: fadeInContent 0.3s ease; }
`

/**
 * FormModal - Multi-step form modal with step indicator
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Callback when modal should close
 * @param {string} title - Modal title
 * @param {string} [subtitle] - Modal subtitle
 * @param {Array} [steps] - Array of step objects { id, label }
 * @param {number} [currentStep=0] - Current step index (0-based)
 * @param {ReactNode} children - Form content
 * @param {Function} onSubmit - Callback when form submitted
 * @param {Function} [onBack] - Callback when back button clicked
 * @param {string} [submitLabel='Submit'] - Submit button label
 * @param {string} [cancelLabel='Cancel'] - Cancel button label
 * @param {boolean} [isValid=true] - Whether form is valid
 * @param {boolean} [loading=false] - Show loading state on submit button
 * @param {string} [size='md'] - Modal size
 * @param {string} [className] - Additional CSS classes
 */
const FormModal = forwardRef(function FormModal(
  {
    isOpen = false,
    onClose,
    title,
    subtitle,
    steps,
    currentStep = 0,
    children,
    onSubmit,
    onBack,
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
    isValid = true,
    loading = false,
    size = 'md',
    className,
    ...props
  },
  ref
) {
  const hasSteps = steps && steps.length > 0
  const isFirstStep = currentStep === 0
  const isLastStep = !hasSteps || currentStep === steps.length - 1

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit && isValid && !loading) {
      onSubmit()
    }
  }

  const footer = (
    <>
      {isFirstStep ? (
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
      ) : (
        <Button variant="secondary" onClick={onBack} disabled={loading}>
          Back
        </Button>
      )}
      <Button variant="primary" onClick={handleSubmit} disabled={!isValid} loading={loading}>
        {isLastStep ? submitLabel : 'Next'}
      </Button>
    </>
  )

  return (
    <>
      <style>{formStyles}</style>
      <ModalBase
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        subtitle={subtitle}
        footer={footer}
        size={size}
        className={className}
        {...props}
      >
        {hasSteps && (
          <div
            className="flex gap-2 pb-5 mb-1 sm:pb-4"
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={steps.length}
          >
            {steps.map((step, index) => (
              <div
                key={step.id || index}
                className={classNames(
                  'flex-1 h-1 rounded-full bg-cloud transition-colors duration-200',
                  index < currentStep && 'bg-accent',
                  index === currentStep && 'bg-primary'
                )}
                aria-label={step.label}
              />
            ))}
          </div>
        )}
        <form className="form-content-animate space-y-4" onSubmit={handleSubmit}>
          {children}
        </form>
      </ModalBase>
    </>
  )
})

export default FormModal
