import { forwardRef, useState } from 'react'
import classNames from '../../../utils/classNames'
import './Alert.css'

/**
 * Alert - Inline alert/notification component
 *
 * @param {string} [variant='info'] - Alert type: 'info' | 'success' | 'warning' | 'error'
 * @param {string} [title] - Optional title for the alert
 * @param {ReactNode} children - Alert content/message
 * @param {string|ReactNode} [icon] - Custom icon (defaults based on variant)
 * @param {boolean} [dismissible=false] - Show dismiss button
 * @param {Function} [onDismiss] - Callback when dismissed
 * @param {ReactNode} [action] - Optional action button/link
 * @param {string} [className] - Additional CSS classes
 */
const Alert = forwardRef(function Alert(
  {
    variant = 'info',
    title,
    children,
    icon,
    dismissible = false,
    onDismiss,
    action,
    className,
    ...props
  },
  ref
) {
  const [isDismissed, setIsDismissed] = useState(false)

  const defaultIcons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕',
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  if (isDismissed) {
    return null
  }

  const displayIcon = icon !== undefined ? icon : defaultIcons[variant]

  return (
    <div
      ref={ref}
      role="alert"
      className={classNames('alert', `alert--${variant}`, className)}
      {...props}
    >
      {displayIcon && (
        <span className="alert__icon" aria-hidden="true">
          {displayIcon}
        </span>
      )}

      <div className="alert__content">
        {title && <div className="alert__title">{title}</div>}
        <div className="alert__message">{children}</div>
        {action && <div className="alert__action">{action}</div>}
      </div>

      {dismissible && (
        <button
          type="button"
          className="alert__dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          ×
        </button>
      )}
    </div>
  )
})

export default Alert
