import { classNames } from '../../../utils/classNames'

// Base styles
const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold'

// Status variants (background and text color)
const statusStyles = {
  active: 'bg-accent-bg text-accent-dark',
  inactive: 'bg-cloud text-mist',
  pending: 'bg-warm-bg text-warm',
  success: 'bg-accent-bg text-accent-dark',
  warning: 'bg-warm-bg text-warm',
  error: 'bg-coral-bg text-coral',
}

/**
 * StatusBadge component for inline status display with dot indicator
 *
 * @param {Object} props
 * @param {'active'|'inactive'|'pending'|'success'|'warning'|'error'} [props.status='active'] - Status type
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Status text
 */
function StatusBadge({ status = 'active', className, children, ...props }) {
  return (
    <span className={classNames(baseStyles, statusStyles[status], className)} {...props}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current" aria-hidden="true" />
      <span>{children}</span>
    </span>
  )
}

export default StatusBadge
