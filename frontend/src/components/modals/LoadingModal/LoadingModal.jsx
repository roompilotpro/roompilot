import { forwardRef } from 'react'
import ModalBase from '../ModalBase'
import { Button, LoadingSpinner } from '../../primitives'
import classNames from '../../../utils/classNames'
import './LoadingModal.css'

/**
 * LoadingModal - Loading/processing dialog with spinner
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {string} [title] - Modal title
 * @param {string} [description] - Modal description text
 * @param {number} [progress] - Progress percentage (0-100)
 * @param {Function} [onCancel] - Callback when cancel button clicked
 * @param {boolean} [showCancel=false] - Show cancel button
 * @param {string} [className] - Additional CSS classes
 */
const LoadingModal = forwardRef(function LoadingModal(
  {
    isOpen = false,
    title = 'Loading...',
    description,
    progress,
    onCancel,
    showCancel = false,
    className,
    ...props
  },
  ref
) {
  const hasProgress = typeof progress === 'number'

  const footer =
    showCancel && onCancel ? (
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    ) : null

  return (
    <ModalBase
      ref={ref}
      isOpen={isOpen}
      onClose={onCancel || (() => {})}
      showHeader={false}
      showCloseButton={false}
      closeOnOverlay={false}
      closeOnEscape={showCancel}
      footer={footer}
      size="sm"
      className={classNames('loading-modal', className)}
      {...props}
    >
      <div className="loading-modal__content">
        <div className="loading-modal__spinner-container">
          <LoadingSpinner size="lg" />
        </div>
        <h2 className="loading-modal__title">{title}</h2>
        {description && <p className="loading-modal__description">{description}</p>}
        {hasProgress && (
          <div className="loading-modal__progress-container">
            <div className="loading-modal__progress">
              <div
                className="loading-modal__progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="loading-modal__progress-text">{Math.round(progress)}%</span>
          </div>
        )}
      </div>
    </ModalBase>
  )
})

export default LoadingModal
