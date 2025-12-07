import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'

/**
 * Header - Page header with title, subtitle, and actions
 *
 * @param {Object} props
 * @param {string} [props.title] - Page title
 * @param {string} [props.subtitle] - Subtitle or date
 * @param {React.ReactNode} [props.leftContent] - Custom left content (overrides title/subtitle)
 * @param {React.ReactNode} [props.rightContent] - Right side content
 * @param {React.ReactNode} [props.actions] - Actions (alias for rightContent)
 * @param {boolean} [props.sticky=true] - Whether header sticks to top
 * @param {string} [props.className] - Additional CSS classes
 */
const Header = forwardRef(function Header(
  { title, subtitle, leftContent, rightContent, actions, sticky = true, className, ...props },
  ref
) {
  const rightSlot = rightContent || actions

  return (
    <header
      ref={ref}
      className={classNames(
        'h-16 md:h-[72px] bg-white border-b border-cloud flex items-center justify-between px-4 md:px-8 z-50',
        sticky && 'sticky top-0',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-6">
        {leftContent || (
          <>
            {title && (
              <h1 className="font-display text-xl md:text-2xl font-semibold text-midnight m-0">
                {title}
              </h1>
            )}
            {subtitle && <span className="text-sm text-mist hidden md:inline">{subtitle}</span>}
          </>
        )}
      </div>

      {rightSlot && <div className="flex items-center gap-3">{rightSlot}</div>}
    </header>
  )
})

export default Header
