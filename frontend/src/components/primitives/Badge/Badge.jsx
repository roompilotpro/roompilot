import { classNames } from '../../../utils/classNames'

// Base badge styles
const baseStyles = 'inline-flex items-center gap-1.5 font-semibold rounded-full whitespace-nowrap'

// Size variants
const sizeStyles = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
}

// Color variants (background and text)
const variantStyles = {
  default: 'bg-bg-tertiary text-text-secondary',
  primary: 'bg-primary-bg text-primary border border-primary/20',
  success: 'bg-accent-bg text-accent border border-accent/20',
  warning: 'bg-warm-bg text-warm-dark border border-warm/20',
  danger: 'bg-coral-bg text-coral-dark border border-coral/20',
  info: 'bg-purple-bg text-purple-dark border border-purple/20',
}

// Dot colors by variant
const dotStyles = {
  default: 'bg-mist',
  primary: 'bg-primary',
  success: 'bg-accent',
  warning: 'bg-warm',
  danger: 'bg-coral',
  info: 'bg-purple',
}

/**
 * Badge component for status indicators and labels
 *
 * @param {Object} props
 * @param {'default'|'primary'|'success'|'warning'|'danger'|'info'} [props.variant='default'] - Color variant
 * @param {'sm'|'md'} [props.size='md'] - Size variant
 * @param {boolean} [props.dot=false] - Show status dot before text
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Badge content
 */
function Badge({ variant = 'default', size = 'md', dot = false, className, children, ...props }) {
  return (
    <span
      className={classNames(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {dot && (
        <span
          className={classNames('w-1.5 h-1.5 rounded-full shrink-0', dotStyles[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

export default Badge
