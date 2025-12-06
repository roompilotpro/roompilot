import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import './QuickActionCard.css'

/**
 * QuickActionCard - Clickable action card with icon and label
 */
const QuickActionCard = forwardRef(function QuickActionCard(
  { icon, label, href, onClick, disabled = false, className, ...props },
  ref
) {
  const Component = href ? 'a' : 'button'
  const elementProps = href
    ? { href, ...(disabled && { 'aria-disabled': true }) }
    : { type: 'button', onClick, disabled }

  return (
    <Component
      ref={ref}
      className={classNames(
        'quick-action-card',
        disabled && 'quick-action-card--disabled',
        className
      )}
      {...elementProps}
      {...props}
    >
      <div className="quick-action-card__icon" aria-hidden="true">
        {icon}
      </div>
      <span className="quick-action-card__label">{label}</span>
    </Component>
  )
})

export default QuickActionCard
