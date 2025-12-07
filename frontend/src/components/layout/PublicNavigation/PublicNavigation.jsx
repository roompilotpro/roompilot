import { forwardRef, useState, useCallback } from 'react'
import { classNames } from '../../../utils/classNames'
import { Button } from '../../primitives'

/**
 * PublicNavigation - Navigation bar for public/marketing pages
 *
 * @param {Object} props
 * @param {string} [props.logo='R'] - Logo icon/letter
 * @param {string} [props.logoText='RoomPilot'] - Logo text
 * @param {string} [props.logoHref='/'] - Logo link destination
 * @param {Array<{label: string, href: string}>} [props.links] - Navigation links
 * @param {React.ReactNode} [props.actions] - Right side actions (buttons)
 * @param {'default'|'transparent'} [props.variant='default'] - Visual variant
 * @param {string} [props.className] - Additional CSS classes
 */
const PublicNavigation = forwardRef(function PublicNavigation(
  {
    logo = 'R',
    logoText = 'RoomPilot',
    logoHref = '/',
    links = [],
    actions,
    variant = 'default',
    className,
    ...props
  },
  ref
) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  const isTransparent = variant === 'transparent'

  return (
    <nav
      ref={ref}
      className={classNames(
        'fixed top-0 left-0 right-0 z-[1000] py-4 px-10 flex items-center justify-between transition-all duration-200',
        isTransparent
          ? 'bg-transparent border-b border-transparent'
          : 'bg-white/[0.92] backdrop-blur-[20px] border-b border-black/[0.04]',
        className
      )}
      {...props}
    >
      {/* Logo */}
      <a href={logoHref} className="flex items-center gap-2.5 no-underline">
        <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-[10px] flex items-center justify-center text-white font-bold text-lg shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
          {logo}
        </div>
        <span
          className={classNames(
            'font-display text-[22px] font-semibold tracking-[-0.02em]',
            isTransparent ? 'text-white' : 'text-midnight'
          )}
        >
          {logoText}
        </span>
      </a>

      {/* Links - center */}
      {links.length > 0 && (
        <div className="hidden md:flex items-center gap-8">
          {links.map((link, index) => (
            <a
              key={link.href || index}
              href={link.href}
              className={classNames(
                'text-[15px] font-medium no-underline transition-colors duration-200',
                isTransparent ? 'text-white hover:text-cloud' : 'text-slate hover:text-primary'
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Actions - right */}
      {actions && <div className="hidden md:flex items-center gap-3">{actions}</div>}

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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="flex md:hidden flex-col absolute top-full left-0 right-0 bg-white border-b border-cloud p-4 shadow-md">
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
