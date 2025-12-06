import { forwardRef } from 'react'
import ModalBase from '../ModalBase'
import { Button } from '../../primitives'
import classNames from '../../../utils/classNames'
import './ConfirmationModal.css'

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
      className={classNames('confirmation-modal', className)}
      {...props}
    >
      <div className="confirmation-modal__content">
        <div
          className={classNames('confirmation-modal__icon', `confirmation-modal__icon--${variant}`)}
        >
          {icon || defaultIcons[variant]}
        </div>
        <h2 className="confirmation-modal__title">{title}</h2>
        {description && <p className="confirmation-modal__description">{description}</p>}
      </div>
    </ModalBase>
  )
})

export default ConfirmationModal
