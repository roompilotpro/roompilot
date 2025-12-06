import { classNames } from '../../../utils/classNames'
import './StatusBadge.css'

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
    <span className={classNames('status-badge', `status-badge--${status}`, className)} {...props}>
      <span className="status-badge__dot" aria-hidden="true" />
      <span className="status-badge__text">{children}</span>
    </span>
  )
}

export default StatusBadge
