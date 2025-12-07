import { forwardRef, useState, useEffect, useRef } from 'react'
import ModalBase from '../ModalBase'
import { Button } from '../../primitives'
import classNames from '../../../utils/classNames'

// Shake animation keyframes
const shakeStyles = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .error-modal-shake { animation: shake 0.5s ease; }
`

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
    <>
      <style>{shakeStyles}</style>
      <ModalBase
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        showHeader={false}
        footer={footer}
        size="sm"
        className={classNames(shake && 'error-modal-shake', className)}
        {...props}
      >
        <div className="text-center py-2">
          <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-coral-bg text-coral mx-auto mb-6 flex items-center justify-center [&>svg]:w-10 [&>svg]:h-10 sm:[&>svg]:w-8 sm:[&>svg]:h-8">
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
          <h2 className="text-xl font-semibold text-charcoal mb-3 m-0 leading-tight">{title}</h2>
          {description && (
            <p className="text-base text-slate mb-4 m-0 leading-relaxed">{description}</p>
          )}
          {errorCode && (
            <div className="inline-block font-mono text-sm bg-snow py-2 px-4 rounded-md text-charcoal">
              <span>Error code: {errorCode}</span>
            </div>
          )}
        </div>
      </ModalBase>
    </>
  )
})

export default ErrorModal
