import { classNames } from '../../../utils/classNames'
import './Badge.css'

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
      className={classNames(
        'badge',
        `badge--${variant}`,
        `badge--${size}`,
        dot && 'badge--with-dot',
        className
      )}
      {...props}
    >
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
}

export default Badge
