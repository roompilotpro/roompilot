import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import './Header.css'

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
      className={classNames('header', sticky && 'header--sticky', className)}
      {...props}
    >
      <div className="header__left">
        {leftContent || (
          <>
            {title && <h1 className="header__title">{title}</h1>}
            {subtitle && <span className="header__subtitle">{subtitle}</span>}
          </>
        )}
      </div>

      {rightSlot && <div className="header__right">{rightSlot}</div>}
    </header>
  )
})

export default Header
