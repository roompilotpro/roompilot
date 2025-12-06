import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import './Card.css'

/**
 * Card - Base card component with header, body, and footer sections
 */
const Card = forwardRef(function Card(
  {
    title,
    headerAction,
    footer,
    children,
    variant = 'default',
    padding = 'md',
    hoverable = false,
    as = 'article',
    className,
    ...props
  },
  ref
) {
  const hasHeader = title || headerAction
  const Tag = as

  return (
    <Tag
      ref={ref}
      className={classNames(
        'card',
        `card--${variant}`,
        `card--padding-${padding}`,
        hoverable && 'card--hoverable',
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {headerAction && <div className="card__action">{headerAction}</div>}
        </div>
      )}
      {children && <div className="card__body">{children}</div>}
      {footer && <div className="card__footer">{footer}</div>}
    </Tag>
  )
})

export default Card
