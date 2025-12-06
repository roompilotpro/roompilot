import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import './Footer.css'

/**
 * Footer - Site footer with logo, links, and legal info
 *
 * @param {Object} props
 * @param {string} [props.logo='R'] - Logo icon/letter
 * @param {string} [props.logoText='RoomPilot'] - Logo text
 * @param {string} [props.tagline] - Brand tagline
 * @param {Array<{title: string, links: Array<{label: string, href: string}>}>} [props.columns] - Link columns
 * @param {Array<{label: string, href: string}>} [props.legalLinks] - Bottom legal links
 * @param {string} [props.copyright] - Copyright text
 * @param {string} [props.className] - Additional CSS classes
 */
const Footer = forwardRef(function Footer(
  {
    logo = 'R',
    logoText = 'RoomPilot',
    tagline,
    columns = [],
    legalLinks = [],
    copyright = `© ${new Date().getFullYear()} RoomPilot. All rights reserved.`,
    className,
    ...props
  },
  ref
) {
  return (
    <footer ref={ref} className={classNames('footer', className)} {...props}>
      <div className="footer__container">
        {/* Top section with brand and columns */}
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">{logo}</div>
              <span className="footer__logo-text">{logoText}</span>
            </div>
            {tagline && <p className="footer__tagline">{tagline}</p>}
          </div>

          {/* Link columns */}
          {columns.map((column, index) => (
            <div key={column.title || index} className="footer__column">
              <h4 className="footer__column-title">{column.title}</h4>
              <ul className="footer__links">
                {column.links.map((link, linkIndex) => (
                  <li key={link.href || linkIndex} className="footer__link-item">
                    <a href={link.href} className="footer__link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section with copyright and legal */}
        <div className="footer__bottom">
          <p className="footer__copyright">{copyright}</p>
          {legalLinks.length > 0 && (
            <div className="footer__legal">
              {legalLinks.map((link, index) => (
                <a key={link.href || index} href={link.href} className="footer__legal-link">
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
})

export default Footer
