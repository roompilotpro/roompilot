import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'

// Size configurations
const sizeConfig = {
  sm: {
    padding: 'p-6',
    icon: 'text-[32px]',
    title: 'text-base',
    description: 'text-sm',
  },
  md: {
    padding: 'p-12',
    icon: 'text-[48px]',
    title: 'text-lg',
    description: 'text-base',
  },
  lg: {
    padding: 'p-20',
    icon: 'text-[64px] mb-6',
    title: 'text-xl',
    description: 'text-base max-w-[400px]',
  },
}

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
  const sizes = sizeConfig[size]

  return (
    <div
      ref={ref}
      className={classNames(
        'flex flex-col items-center justify-center text-center',
        sizes.padding,
        bordered && 'bg-white border border-cloud rounded-xl',
        className
      )}
      {...props}
    >
      {icon && (
        <div className={classNames('mb-4 text-slate leading-none', sizes.icon)} aria-hidden="true">
          {icon}
        </div>
      )}

      <h3 className={classNames('m-0 mb-2 font-semibold text-charcoal', sizes.title)}>{title}</h3>

      {description && (
        <p className={classNames('m-0 mb-6 text-slate max-w-[320px]', sizes.description)}>
          {description}
        </p>
      )}

      {action && <div className="flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  )
})

export default EmptyState
