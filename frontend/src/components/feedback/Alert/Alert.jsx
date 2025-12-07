import { forwardRef, useState } from 'react'
import classNames from '../../../utils/classNames'

// Variant styles for alerts
const variantStyles = {
  info: {
    container: 'bg-primary-bg border-l-primary text-primary',
    icon: 'text-primary',
    title: 'text-charcoal',
  },
  success: {
    container: 'bg-accent-bg border-l-accent text-accent',
    icon: 'text-accent bg-accent/20 rounded-full text-sm',
    title: 'text-charcoal',
  },
  warning: {
    container: 'bg-warm-bg border-l-warm text-warm',
    icon: 'text-warm',
    title: 'text-charcoal',
  },
  error: {
    container: 'bg-coral-bg border-l-coral text-coral',
    icon: 'text-coral bg-coral/20 rounded-full text-sm',
    title: 'text-charcoal',
  },
}

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
  const styles = variantStyles[variant]

  return (
    <div
      ref={ref}
      role="alert"
      className={classNames(
        'flex items-start gap-3 p-4 rounded-lg border-l-4',
        styles.container,
        className
      )}
      {...props}
    >
      {displayIcon && (
        <span
          className={classNames(
            'shrink-0 flex items-center justify-center w-6 h-6 text-base leading-none',
            styles.icon
          )}
          aria-hidden="true"
        >
          {displayIcon}
        </span>
      )}

      <div className="flex-1 min-w-0">
        {title && <div className={classNames('font-semibold mb-1', styles.title)}>{title}</div>}
        <div className="text-sm leading-relaxed">{children}</div>
        {action && <div className="mt-3">{action}</div>}
      </div>

      {dismissible && (
        <button
          type="button"
          className="shrink-0 flex items-center justify-center w-6 h-6 p-0 bg-transparent border-none rounded-sm text-lg font-light leading-none cursor-pointer opacity-60 transition-opacity duration-150 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2"
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
