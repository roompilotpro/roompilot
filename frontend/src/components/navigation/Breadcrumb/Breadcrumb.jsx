import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import './Breadcrumb.css'

/**
 * Breadcrumb - Path navigation showing current location hierarchy
 *
 * @param {Array} items - Array of breadcrumb items { label, href?, icon?, onClick? }
 * @param {string} [separator='chevron'] - Separator: 'chevron' | 'slash' | 'arrow' | custom string
 * @param {string} [size='md'] - Size: 'sm' | 'md' | 'lg'
 * @param {string} [className] - Additional CSS classes
 */
const Breadcrumb = forwardRef(function Breadcrumb(
  { items = [], separator = 'chevron', size = 'md', className, ...props },
  ref
) {
  const getSeparatorChar = () => {
    switch (separator) {
      case 'chevron':
        return '›'
      case 'slash':
        return '/'
      case 'arrow':
        return '→'
      default:
        return separator
    }
  }

  const handleItemClick = (item, e) => {
    if (item.onClick) {
      e.preventDefault()
      item.onClick(e)
    }
  }

  return (
    <nav
      ref={ref}
      className={classNames('breadcrumb', `breadcrumb--${size}`, className)}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const hasLink = item.href || item.onClick

          return (
            <li key={index} className="breadcrumb__item">
              {index > 0 && (
                <span className="breadcrumb__separator" aria-hidden="true">
                  {getSeparatorChar()}
                </span>
              )}

              {isLast ? (
                <span className="breadcrumb__current" aria-current="page">
                  {item.icon && (
                    <span className="breadcrumb__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </span>
              ) : hasLink ? (
                <a
                  href={item.href || '#'}
                  className="breadcrumb__link"
                  onClick={(e) => handleItemClick(item, e)}
                >
                  {item.icon && (
                    <span className="breadcrumb__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </a>
              ) : (
                <span className="breadcrumb__text">
                  {item.icon && (
                    <span className="breadcrumb__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
})

export default Breadcrumb
