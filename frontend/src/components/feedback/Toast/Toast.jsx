import { forwardRef, useState } from 'react'
import classNames from '../../../utils/classNames'

// Toast animation styles
const toastStyles = `
  @keyframes toast-slide-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes toast-slide-out { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(10px); } }
  .toast-animate { animation: toast-slide-in 0.2s ease-out; }
  .toast-exit { animation: toast-slide-out 0.2s ease-in forwards; }
`

// Toast type styles
const typeStyles = {
  info: 'bg-charcoal text-white',
  success: 'bg-accent text-white',
  warning: 'bg-warm text-charcoal',
  error: 'bg-coral text-white',
}

// Container position styles
const positionStyles = {
  'bottom-center':
    'bottom-6 left-1/2 -translate-x-1/2 items-center sm:left-4 sm:right-4 sm:translate-x-0',
  'bottom-right': 'bottom-6 right-6 items-end sm:left-4 sm:right-4',
  'top-center':
    'top-6 left-1/2 -translate-x-1/2 items-center sm:left-4 sm:right-4 sm:translate-x-0',
  'top-right': 'top-6 right-6 items-end sm:left-4 sm:right-4',
}

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
    }, 200)
  }

  const icons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕',
  }

  const needsIconBg = type === 'success' || type === 'error'

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={classNames(
        'flex items-center gap-3 py-3 px-4 rounded-xl shadow-lg pointer-events-auto sm:w-full',
        isExiting ? 'toast-exit' : 'toast-animate',
        typeStyles[type],
        className
      )}
      {...props}
    >
      <span
        className={classNames(
          'shrink-0 flex items-center justify-center w-5 h-5 text-sm leading-none',
          needsIconBg && 'bg-white/20 rounded-full text-[10px]'
        )}
        aria-hidden="true"
      >
        {icons[type]}
      </span>
      <span className="flex-1 text-sm font-medium leading-snug">{message}</span>
      {dismissible && (
        <button
          type="button"
          className="shrink-0 flex items-center justify-center w-5 h-5 p-0 bg-transparent border-none rounded-full text-lg font-light leading-none cursor-pointer opacity-70 transition-opacity duration-150 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2"
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
    <>
      <style>{toastStyles}</style>
      <div
        ref={ref}
        className={classNames(
          'fixed z-[1100] flex flex-col gap-3 max-w-[400px] pointer-events-none sm:max-w-none',
          positionStyles[position],
          className
        )}
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
    </>
  )
})

export default Toast
