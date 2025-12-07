import { forwardRef } from 'react'
import ModalBase from '../ModalBase'
import { Button, LoadingSpinner } from '../../primitives'

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
      className={className}
      {...props}
    >
      <div className="text-center py-2">
        <div className="mb-6 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
        <h2 className="text-xl font-semibold text-charcoal mb-3 m-0 leading-tight">{title}</h2>
        {description && (
          <p className="text-base text-slate mb-4 m-0 leading-relaxed">{description}</p>
        )}
        {hasProgress && (
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-2 bg-cloud rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-[width] duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate min-w-[3rem] text-right">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    </ModalBase>
  )
})

export default LoadingModal
