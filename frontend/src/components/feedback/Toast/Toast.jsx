import { forwardRef, useState } from 'react'
import classNames from '../../../utils/classNames'
import './Toast.css'

/**
 * Toast - Single toast notification
 *
 * @param {string} message - Toast message content
 * @param {string} [type='info'] - Toast type: 'info' | 'success' | 'warning' | 'error'
 * @param {boolean} [dismissible=true] - Show dismiss button
 * @param {Function} [onDismiss] - Callback when dismissed
 * @param {string} [className] - Additional CSS classes
 */
export const Toast = forwardRef(function Toast(
  { message, type = 'info', dismissible = true, onDismiss, className, ...props },
  ref
) {
  const [isExiting, setIsExiting] = useState(false)

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      onDismiss?.()
    }, 200) // Match CSS animation duration
  }

  const icons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕',
  }

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={classNames('toast', `toast--${type}`, isExiting && 'toast--exiting', className)}
      {...props}
    >
      <span className="toast__icon" aria-hidden="true">
        {icons[type]}
      </span>
      <span className="toast__message">{message}</span>
      {dismissible && (
        <button
          type="button"
          className="toast__dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  )
})

/**
 * ToastContainer - Container that displays all active toasts
 * Use with ToastProvider
 *
 * @param {Array} toasts - Array of toast objects from useToast()
 * @param {Function} onDismiss - Callback to dismiss a toast by id
 * @param {string} [position='bottom-center'] - Position: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right'
 * @param {string} [className] - Additional CSS classes
 */
export const ToastContainer = forwardRef(function ToastContainer(
  { toasts = [], onDismiss, position = 'bottom-center', className, ...props },
  ref
) {
  if (toasts.length === 0) {
    return null
  }

  return (
    <div
      ref={ref}
      className={classNames('toast-container', `toast-container--${position}`, className)}
      aria-label="Notifications"
      {...props}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          dismissible={toast.dismissible}
          onDismiss={() => onDismiss?.(toast.id)}
        />
      ))}
    </div>
  )
})

export default Toast
