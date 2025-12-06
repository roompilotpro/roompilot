import { forwardRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../../../hooks'
import classNames from '../../../utils/classNames'
import { IconButton } from '../../primitives'
import './ModalBase.css'

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
    <div className="modal-overlay" onClick={handleOverlayClick}>
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
        className={classNames('modal', `modal--${size}`, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        {...props}
      >
        {showHeader && (title || showCloseButton) && (
          <div className="modal__header">
            {title && (
              <div className="modal__header-content">
                <h2 id="modal-title" className="modal__title">
                  {title}
                </h2>
                {subtitle && <p className="modal__subtitle">{subtitle}</p>}
              </div>
            )}
            {showCloseButton && (
              <IconButton className="modal__close" onClick={onClose} label="Close modal" size="sm">
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

        <div className="modal__body">{children}</div>

        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
})

export default ModalBase
