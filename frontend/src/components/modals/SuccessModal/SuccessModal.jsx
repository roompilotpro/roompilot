import { forwardRef, useEffect, useState, useRef } from 'react'
import ModalBase from '../ModalBase'
import { Button } from '../../primitives'

// Checkmark animation styles
const successStyles = `
  @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
  @keyframes circleDraw { from { stroke-dashoffset: 151; } to { stroke-dashoffset: 0; } }
  @keyframes checkDraw { from { stroke-dashoffset: 50; } to { stroke-dashoffset: 0; } }
  .success-icon-animate { animation: scaleIn 0.5s ease; }
  .success-circle-animate {
    stroke-dasharray: 151;
    stroke-dashoffset: 151;
    animation: circleDraw 0.6s ease 0.2s forwards;
  }
  .success-check-animate {
    stroke-dasharray: 50;
    stroke-dashoffset: 50;
    animation: checkDraw 0.4s ease 0.6s forwards;
  }
`

/**
 * SuccessModal - Success dialog with animated checkmark
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Callback when modal should close
 * @param {string} title - Modal title
 * @param {string} [description] - Modal description text
 * @param {ReactNode} [icon] - Custom icon to display (defaults to animated checkmark)
 * @param {Object} [primaryAction] - Primary action button { label, onClick }
 * @param {Object} [secondaryAction] - Secondary action button { label, onClick }
 * @param {number} [autoCloseSeconds] - Auto-close after specified seconds
 * @param {string} [className] - Additional CSS classes
 */
const SuccessModal = forwardRef(function SuccessModal(
  {
    isOpen = false,
    onClose,
    title,
    description,
    icon,
    primaryAction,
    secondaryAction,
    autoCloseSeconds,
    className,
    ...props
  },
  ref
) {
  const [countdown, setCountdown] = useState(autoCloseSeconds)
  const timerRef = useRef(null)
  const prevOpenRef = useRef(false)

  // Handle auto-close countdown
  useEffect(() => {
    if (isOpen && autoCloseSeconds) {
      // Only reset countdown when modal first opens
      if (!prevOpenRef.current) {
        // Schedule countdown reset on next tick
        setTimeout(() => setCountdown(autoCloseSeconds), 0)
      }
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            onClose()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      prevOpenRef.current = true
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    } else if (!isOpen) {
      prevOpenRef.current = false
    }
  }, [isOpen, autoCloseSeconds, onClose])

  const footer =
    primaryAction || secondaryAction ? (
      <>
        {secondaryAction && (
          <Button variant="secondary" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
        {primaryAction && (
          <Button variant="primary" onClick={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
        )}
      </>
    ) : null

  return (
    <>
      <style>{successStyles}</style>
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
          <div className="success-icon-animate w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-accent-bg mx-auto mb-6 flex items-center justify-center">
            {icon || (
              <svg className="w-12 h-12 sm:w-10 sm:h-10" viewBox="0 0 52 52" aria-hidden="true">
                <circle
                  className="success-circle-animate stroke-accent/30"
                  cx="26"
                  cy="26"
                  r="24"
                  fill="none"
                  strokeWidth="2"
                />
                <path
                  className="success-check-animate stroke-accent"
                  d="M14 27l8 8 16-16"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <h2 className="text-xl font-semibold text-charcoal mb-3 m-0 leading-tight">{title}</h2>
          {description && <p className="text-base text-slate m-0 leading-relaxed">{description}</p>}
          {autoCloseSeconds && countdown > 0 && (
            <p className="text-sm text-slate mt-4 m-0">
              Closing in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          )}
        </div>
      </ModalBase>
    </>
  )
})

export default SuccessModal
