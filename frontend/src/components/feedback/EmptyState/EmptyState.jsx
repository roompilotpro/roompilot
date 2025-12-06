import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import './EmptyState.css'

/**
 * EmptyState - Placeholder for empty content areas
 *
 * @param {string|ReactNode} [icon] - Icon or illustration to display
 * @param {string} title - Main message
 * @param {string} [description] - Secondary description text
 * @param {ReactNode} [action] - Action button or link
 * @param {string} [size='md'] - Size: 'sm' | 'md' | 'lg'
 * @param {boolean} [bordered=false] - Show border around container
 * @param {string} [className] - Additional CSS classes
 */
const EmptyState = forwardRef(function EmptyState(
  { icon, title, description, action, size = 'md', bordered = false, className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={classNames(
        'empty-state',
        `empty-state--${size}`,
        bordered && 'empty-state--bordered',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}

      <h3 className="empty-state__title">{title}</h3>

      {description && <p className="empty-state__description">{description}</p>}

      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
})

export default EmptyState
