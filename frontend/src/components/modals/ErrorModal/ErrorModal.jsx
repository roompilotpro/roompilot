import { forwardRef, useState, useEffect, useRef } from 'react'
import ModalBase from '../ModalBase'
import { Button } from '../../primitives'
import classNames from '../../../utils/classNames'
import './ErrorModal.css'

/**
 * ErrorModal - Error dialog with shake animation
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Callback when modal should close
 * @param {string} title - Modal title
 * @param {string} [description] - Modal description text
 * @param {string} [errorCode] - Error code to display
 * @param {ReactNode} [icon] - Custom icon to display
 * @param {Function} [onRetry] - Callback when retry button clicked
 * @param {string} [supportLink] - URL for support link
 * @param {string} [className] - Additional CSS classes
 */
const ErrorModal = forwardRef(function ErrorModal(
  {
    isOpen = false,
    onClose,
    title,
    description,
    errorCode,
    icon,
    onRetry,
    supportLink,
    className,
    ...props
  },
  ref
) {
  const [shake, setShake] = useState(false)
  const prevOpenRef = useRef(false)

  // Trigger shake animation when modal opens
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      // Schedule shake on next tick to avoid synchronous setState
      const timer = setTimeout(() => {
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }, 0)
      return () => clearTimeout(timer)
    }
    prevOpenRef.current = isOpen
  }, [isOpen])

  const footer = (
    <>
      {supportLink && (
        <a
          className="btn btn--secondary btn--md"
          href={supportLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="btn__label">Get Support</span>
        </a>
      )}
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Try Again
        </Button>
      )}
      {!onRetry && !supportLink && (
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      )}
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
      className={classNames('error-modal', shake && 'error-modal--shake', className)}
      {...props}
    >
      <div className="error-modal__content">
        <div className="error-modal__icon">
          {icon || (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 8v4m0 4h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <h2 className="error-modal__title">{title}</h2>
        {description && <p className="error-modal__description">{description}</p>}
        {errorCode && (
          <div className="error-modal__code">
            <span>Error code: {errorCode}</span>
          </div>
        )}
      </div>
    </ModalBase>
  )
})

export default ErrorModal
