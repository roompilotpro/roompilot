import { forwardRef } from 'react'
import ModalBase from '../ModalBase'
import { Button } from '../../primitives'
import classNames from '../../../utils/classNames'
import './FormModal.css'

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
    <ModalBase
      ref={ref}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      footer={footer}
      size={size}
      className={classNames('form-modal', className)}
      {...props}
    >
      {hasSteps && (
        <div
          className="form-modal__steps"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
        >
          {steps.map((step, index) => (
            <div
              key={step.id || index}
              className={classNames(
                'form-modal__step',
                index < currentStep && 'form-modal__step--completed',
                index === currentStep && 'form-modal__step--active'
              )}
              aria-label={step.label}
            />
          ))}
        </div>
      )}
      <form className="form-modal__content" onSubmit={handleSubmit}>
        {children}
      </form>
    </ModalBase>
  )
})

export default FormModal
