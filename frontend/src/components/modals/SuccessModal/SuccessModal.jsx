import { forwardRef, useEffect, useState, useRef } from 'react'
import ModalBase from '../ModalBase'
import { Button } from '../../primitives'
import classNames from '../../../utils/classNames'
import './SuccessModal.css'

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
    <ModalBase
      ref={ref}
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      footer={footer}
      size="sm"
      className={classNames('success-modal', className)}
      {...props}
    >
      <div className="success-modal__content">
        <div className="success-modal__icon">
          {icon || (
            <svg className="success-modal__checkmark" viewBox="0 0 52 52" aria-hidden="true">
              <circle className="success-modal__circle" cx="26" cy="26" r="24" fill="none" />
              <path className="success-modal__check" d="M14 27l8 8 16-16" fill="none" />
            </svg>
          )}
        </div>
        <h2 className="success-modal__title">{title}</h2>
        {description && <p className="success-modal__description">{description}</p>}
        {autoCloseSeconds && countdown > 0 && (
          <p className="success-modal__countdown">
            Closing in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        )}
      </div>
    </ModalBase>
  )
})

export default SuccessModal
