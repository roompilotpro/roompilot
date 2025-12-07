import { forwardRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../../../hooks'
import classNames from '../../../utils/classNames'
import { IconButton } from '../../primitives'

// Size variants for modal
const sizeStyles = {
  sm: 'max-w-[440px]',
  md: 'max-w-[520px]',
  lg: 'max-w-[600px]',
  full: 'max-w-[90vw] max-h-[90vh]',
}

// Animation keyframes - kept inline since Tailwind v4 doesn't have built-in slideUp
const modalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .modal-overlay-animate { animation: fadeIn 0.2s ease; }
  .modal-animate { animation: slideUp 0.3s ease; }
`

/**
 * ModalBase - Foundation modal component with overlay, focus trap, and keyboard handling
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Callback when modal should close
 * @param {string} [title] - Modal title
 * @param {string} [subtitle] - Modal subtitle
 * @param {string} [size='md'] - Modal size: 'sm' | 'md' | 'lg' | 'full'
 * @param {boolean} [showCloseButton=true] - Show close button in header
 * @param {boolean} [closeOnOverlay=true] - Close when clicking overlay
 * @param {boolean} [closeOnEscape=true] - Close when pressing Escape
 * @param {boolean} [showHeader=true] - Show the header section
 * @param {ReactNode} [footer] - Footer content
 * @param {ReactNode} children - Modal body content
 * @param {string} [className] - Additional CSS classes
 */
const ModalBase = forwardRef(function ModalBase(
  {
    isOpen = false,
    onClose,
    title,
    subtitle,
    size = 'md',
    showCloseButton = true,
    closeOnOverlay = true,
    closeOnEscape = true,
    showHeader = true,
    footer,
    children,
    className,
    ...props
  },
  ref
) {
  const focusTrapRef = useFocusTrap(isOpen)

  // Handle Escape key
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape' && closeOnEscape && onClose) {
        onClose()
      }
    },
    [closeOnEscape, onClose]
  )

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget && closeOnOverlay && onClose) {
        onClose()
      }
    },
    [closeOnOverlay, onClose]
  )

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Add/remove keydown listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const modalContent = (
    <>
      <style>{modalStyles}</style>
      <div
        className="modal-overlay-animate fixed inset-0 z-[1000] bg-midnight/60 backdrop-blur-sm flex items-center justify-center p-5 sm:p-0 sm:items-end"
        onClick={handleOverlayClick}
      >
        <div
          ref={(node) => {
            // Combine refs
            focusTrapRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          className={classNames(
            'modal-animate relative bg-white rounded-lg shadow-lg max-h-[90vh] overflow-hidden flex flex-col w-full',
            'sm:max-w-full sm:max-h-[95vh] sm:rounded-t-lg sm:rounded-b-none',
            sizeStyles[size],
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          {...props}
        >
          {showHeader && (title || showCloseButton) && (
            <div className="relative p-6 sm:p-5 border-b border-cloud flex items-start justify-between gap-4">
              {title && (
                <div className="flex-1 min-w-0">
                  <h2
                    id="modal-title"
                    className="text-xl font-semibold text-charcoal m-0 leading-tight"
                  >
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-sm text-slate mt-2 mb-0 leading-relaxed">{subtitle}</p>
                  )}
                </div>
              )}
              {showCloseButton && (
                <IconButton className="shrink-0" onClick={onClose} label="Close modal" size="sm">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </IconButton>
              )}
            </div>
          )}

          <div className="p-6 sm:p-5 overflow-y-auto flex-1">{children}</div>

          {footer && (
            <div className="py-5 px-6 sm:py-4 sm:px-5 border-t border-cloud flex gap-3 justify-end bg-white sm:flex-col-reverse sm:[&>*]:w-full">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
})

export default ModalBase
