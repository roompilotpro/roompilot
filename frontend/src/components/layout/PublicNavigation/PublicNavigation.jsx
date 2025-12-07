import { forwardRef, useState, useCallback } from 'react'
import { classNames } from '../../../utils/classNames'

/**
 * PublicNavigation - Navigation bar for public/marketing pages
 *
 * @param {Object} props
 * @param {string} [props.logoText='RoomPilot'] - Logo text
 * @param {string} [props.logoHref='/'] - Logo link destination
 * @param {Array<{label: string, href: string}>} [props.links] - Navigation links
 * @param {React.ReactNode} [props.actions] - Right side actions (buttons)
 * @param {'default'|'transparent'} [props.variant='default'] - Visual variant
 * @param {string} [props.className] - Additional CSS classes
 */
const PublicNavigation = forwardRef(function PublicNavigation(
  { logoText = 'RoomPilot', logoHref = '/', links = [], actions, className, ...props },
  ref
) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  return (
    <nav
      ref={ref}
      className={classNames('sticky top-0 z-[100] bg-white border-b border-cloud', className)}
      {...props}
    >
      <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href={logoHref}
          className="font-display text-[1.5rem] font-bold text-primary no-underline"
        >
          {logoText}
        </a>

        {/* Links - center */}
        {links.length > 0 && (
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {links.map((link, index) => (
              <li key={link.href || index}>
                <a
                  href={link.href}
                  className="text-[15px] font-medium text-slate no-underline transition-colors duration-200 hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Actions - right */}
        {actions && <div className="hidden md:flex items-center gap-4">{actions}</div>}

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex md:hidden flex-col justify-center items-center gap-[5px] w-10 h-10 p-0 bg-transparent border-none cursor-pointer"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span
            className={classNames(
              'block w-6 h-0.5 bg-slate rounded-sm transition-all duration-200',
              mobileMenuOpen && 'translate-y-[7px] rotate-45'
            )}
          />
          <span
            className={classNames(
              'block w-6 h-0.5 bg-slate rounded-sm transition-all duration-200',
              mobileMenuOpen && 'opacity-0'
            )}
          />
          <span
            className={classNames(
              'block w-6 h-0.5 bg-slate rounded-sm transition-all duration-200',
              mobileMenuOpen && '-translate-y-[7px] -rotate-45'
            )}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="flex md:hidden flex-col bg-white border-b border-cloud p-4 shadow-md">
          {links.length > 0 && (
            <div className="flex flex-col gap-1">
              {links.map((link, index) => (
                <a
                  key={link.href || index}
                  href={link.href}
                  className="block py-3 px-3 text-[15px] font-medium text-charcoal no-underline rounded-md transition-colors duration-200 hover:bg-snow"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
          {actions && (
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-cloud [&>*]:w-full [&>*]:justify-center">
              {actions}
            </div>
          )}
        </div>
      )}
    </nav>
  )
})

export default PublicNavigation
