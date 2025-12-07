import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'

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
        'flex flex-col items-center gap-2 py-5 px-3 bg-snow border-none rounded-md cursor-pointer no-underline transition-all duration-150 ease-out',
        'hover:enabled:bg-cloud hover:enabled:-translate-y-0.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'active:enabled:translate-y-0',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...elementProps}
      {...props}
    >
      <div
        className="flex items-center justify-center w-10 h-10 bg-white rounded-[10px] text-xl"
        aria-hidden="true"
      >
        {icon}
      </div>
      <span className="text-xs font-semibold text-charcoal text-center leading-tight">{label}</span>
    </Component>
  )
})

export default QuickActionCard
