import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'

// Variant styles
const variantStyles = {
  default: 'border border-cloud',
  bordered: 'border border-slate/30',
  elevated: 'shadow-md',
}

// Padding styles for body and footer
const paddingStyles = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2xl': 'p-10',
}

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
        'bg-white rounded-lg overflow-hidden',
        variantStyles[variant],
        hoverable &&
          'transition-all duration-150 ease-out cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div className="flex items-center justify-between gap-3 py-5 px-6 border-b border-cloud">
          {title && (
            <h3 className="m-0 font-display text-lg font-semibold text-midnight">{title}</h3>
          )}
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      {children && <div className={paddingStyles[padding]}>{children}</div>}
      {footer && (
        <div
          className={classNames(
            'flex items-center justify-end gap-3 border-t border-cloud bg-snow',
            paddingStyles[padding]
          )}
        >
          {footer}
        </div>
      )}
    </Tag>
  )
})

export default Card
