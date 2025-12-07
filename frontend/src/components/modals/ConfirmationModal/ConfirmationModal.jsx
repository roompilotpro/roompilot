import { forwardRef } from 'react'
import ModalBase from '../ModalBase'
import { Button } from '../../primitives'
import classNames from '../../../utils/classNames'

// Icon variant styles
const iconVariantStyles = {
  danger: 'bg-coral-bg text-coral',
  warning: 'bg-warm-bg text-warm',
  info: 'bg-primary-bg text-primary',
}

/**
 * ConfirmationModal - Confirm/cancel dialog with icon and variant styling
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Callback when modal should close
 * @param {string} [variant='danger'] - Modal variant: 'danger' | 'warning' | 'info'
 * @param {string} title - Modal title
 * @param {string} [description] - Modal description text
 * @param {ReactNode} [icon] - Custom icon to display
 * @param {string} [confirmLabel='Confirm'] - Confirm button label
 * @param {string} [cancelLabel='Cancel'] - Cancel button label
 * @param {Function} onConfirm - Callback when confirm button clicked
 * @param {Function} [onCancel] - Callback when cancel button clicked (defaults to onClose)
 * @param {boolean} [loading=false] - Show loading state on confirm button
 * @param {string} [className] - Additional CSS classes
 */
const ConfirmationModal = forwardRef(function ConfirmationModal(
  {
    isOpen = false,
    onClose,
    variant = 'danger',
    title,
    description,
    icon,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    loading = false,
    className,
    ...props
  },
  ref
) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onClose()
    }
  }

  const defaultIcons = {
    danger: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  }

  const buttonVariants = {
    danger: 'danger',
    warning: 'primary',
    info: 'primary',
  }

  const footer = (
    <>
      <Button variant="secondary" onClick={handleCancel} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button variant={buttonVariants[variant]} onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </>
  )

  return (
    <ModalBase
      ref={ref}
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      footer={footer}
      size="sm"
      className={className}
      {...props}
    >
      <div className="text-center py-2">
        <div
          className={classNames(
            'w-16 h-16 sm:w-14 sm:h-14 rounded-full mx-auto mb-5 flex items-center justify-center [&>svg]:w-8 [&>svg]:h-8 sm:[&>svg]:w-7 sm:[&>svg]:h-7',
            iconVariantStyles[variant]
          )}
        >
          {icon || defaultIcons[variant]}
        </div>
        <h2 className="text-xl font-semibold text-charcoal mb-3 m-0 leading-tight">{title}</h2>
        {description && <p className="text-base text-slate m-0 leading-relaxed">{description}</p>}
      </div>
    </ModalBase>
  )
})

export default ConfirmationModal
