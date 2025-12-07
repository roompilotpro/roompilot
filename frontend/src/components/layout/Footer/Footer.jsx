import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'

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
    <footer ref={ref} className={classNames('bg-midnight pt-20 pb-10 px-10', className)} {...props}>
      <div className="max-w-[1200px] mx-auto">
        {/* Top section with brand and columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_repeat(3,1fr)] gap-[60px] pb-[60px] border-b border-white/[0.08]">
          {/* Brand */}
          <div className="max-w-[300px] md:col-span-2 lg:col-span-1 md:max-w-none lg:max-w-[300px]">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center text-white font-bold text-lg">
                {logo}
              </div>
              <span className="font-display text-[22px] font-semibold text-white">{logoText}</span>
            </div>
            {tagline && <p className="text-[15px] text-mist leading-[1.6] m-0">{tagline}</p>}
          </div>

          {/* Link columns */}
          {columns.map((column, index) => (
            <div key={column.title || index} className="flex flex-col">
              <h4 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-mist mb-5 mt-0 mx-0">
                {column.title}
              </h4>
              <ul className="list-none p-0 m-0">
                {column.links.map((link, linkIndex) => (
                  <li key={link.href || linkIndex} className="mb-3">
                    <a
                      href={link.href}
                      className="text-[15px] text-white/70 no-underline transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section with copyright and legal */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 pt-10 text-center md:text-left">
          <p className="text-sm text-mist m-0">{copyright}</p>
          {legalLinks.length > 0 && (
            <div className="flex items-center gap-6">
              {legalLinks.map((link, index) => (
                <a
                  key={link.href || index}
                  href={link.href}
                  className="text-sm text-mist no-underline transition-colors duration-200 hover:text-white"
                >
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
