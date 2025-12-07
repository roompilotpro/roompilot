import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'

// Size variants
const sizeStyles = {
  sm: { text: 'text-xs', separator: 'text-[10px]' },
  md: { text: 'text-sm', separator: 'text-xs' },
  lg: { text: 'text-base', separator: 'text-sm' },
}

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

  const styles = sizeStyles[size]
  const itemClasses =
    'inline-flex items-center gap-1 sm:max-w-[120px] sm:overflow-hidden sm:text-ellipsis sm:whitespace-nowrap'

  return (
    <nav
      ref={ref}
      className={classNames('flex items-center', styles.text, className)}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="flex items-center flex-wrap gap-1 m-0 p-0 list-none sm:gap-0.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const hasLink = item.href || item.onClick

          return (
            <li key={index} className="flex items-center gap-1 sm:gap-0.5">
              {index > 0 && (
                <span
                  className={classNames('text-slate font-medium', styles.separator)}
                  aria-hidden="true"
                >
                  {getSeparatorChar()}
                </span>
              )}

              {isLast ? (
                <span
                  className={classNames(itemClasses, 'text-charcoal font-medium')}
                  aria-current="page"
                >
                  {item.icon && (
                    <span className="leading-none" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </span>
              ) : hasLink ? (
                <a
                  href={item.href || '#'}
                  className={classNames(
                    itemClasses,
                    'text-slate no-underline transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:rounded-sm'
                  )}
                  onClick={(e) => handleItemClick(item, e)}
                >
                  {item.icon && (
                    <span className="leading-none" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </a>
              ) : (
                <span className={classNames(itemClasses, 'text-slate')}>
                  {item.icon && (
                    <span className="leading-none" aria-hidden="true">
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
