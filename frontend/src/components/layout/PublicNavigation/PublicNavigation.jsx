import { forwardRef, useState, useCallback } from 'react'
import { classNames } from '../../../utils/classNames'
import { Button } from '../../primitives'
import './PublicNavigation.css'

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

  return (
    <nav
      ref={ref}
      className={classNames(
        'public-nav',
        `public-nav--${variant}`,
        mobileMenuOpen && 'public-nav--mobile-open',
        className
      )}
      {...props}
    >
      {/* Logo */}
      <a href={logoHref} className="public-nav__logo">
        <div className="public-nav__logo-icon">{logo}</div>
        <span className="public-nav__logo-text">{logoText}</span>
      </a>

      {/* Links - center */}
      {links.length > 0 && (
        <div className="public-nav__links">
          {links.map((link, index) => (
            <a key={link.href || index} href={link.href} className="public-nav__link">
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Actions - right */}
      {actions && <div className="public-nav__actions">{actions}</div>}

      {/* Mobile menu button */}
      <button
        type="button"
        className="public-nav__mobile-btn"
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
      >
        <span className="public-nav__mobile-btn-line" />
        <span className="public-nav__mobile-btn-line" />
        <span className="public-nav__mobile-btn-line" />
      </button>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="public-nav__mobile-menu">
          {links.length > 0 && (
            <div className="public-nav__mobile-links">
              {links.map((link, index) => (
                <a key={link.href || index} href={link.href} className="public-nav__mobile-link">
                  {link.label}
                </a>
              ))}
            </div>
          )}
          {actions && <div className="public-nav__mobile-actions">{actions}</div>}
        </div>
      )}
    </nav>
  )
})

export default PublicNavigation
