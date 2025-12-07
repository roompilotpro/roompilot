import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'

/**
 * Footer - Site footer with link columns and copyright
 *
 * @param {Object} props
 * @param {Array<{title: string, links: Array<{label: string, href: string}>}>} [props.columns] - Link columns
 * @param {Array<{label: string, href: string}>} [props.legalLinks] - Bottom legal links (unused in new design)
 * @param {string} [props.copyright] - Copyright text
 * @param {string} [props.className] - Additional CSS classes
 */
const Footer = forwardRef(function Footer({ columns = [], copyright, className, ...props }, ref) {
  const copyrightText =
    copyright || '© ' + new Date().getFullYear() + ' RoomPilot. All rights reserved.'

  return (
    <footer
      ref={ref}
      className={classNames('bg-midnight text-cloud py-12 px-8', className)}
      {...props}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Link columns */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 mb-8">
          {columns.map((column, index) => (
            <div key={column.title || index}>
              <h4 className="text-white font-semibold mb-4">{column.title}</h4>
              <ul className="list-none p-0 m-0">
                {column.links.map((link, linkIndex) => (
                  <li key={link.href || linkIndex} className="mb-2">
                    <a
                      href={link.href}
                      className="text-cloud no-underline transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-slate pt-6 text-center text-mist">
          <p className="m-0">{copyrightText}</p>
        </div>
      </div>
    </footer>
  )
})

export default Footer
