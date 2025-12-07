import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'

/**
 * FilterChip - Interactive filter pill for search and filtering interfaces
 *
 * @param {string} [icon] - Emoji or icon to display before label
 * @param {string} label - Text label for the filter
 * @param {boolean} [active=false] - Whether the filter is active/selected
 * @param {boolean} [hasDropdown=false] - Show dropdown arrow indicator
 * @param {boolean} [removable=false] - Show remove button when active
 * @param {boolean} [disabled=false] - Disable the chip
 * @param {Function} [onClick] - Click handler
 * @param {Function} [onRemove] - Remove button handler (when removable)
 * @param {string} [className] - Additional CSS classes
 */
const FilterChip = forwardRef(function FilterChip(
  {
    icon,
    label,
    active = false,
    hasDropdown = false,
    removable = false,
    disabled = false,
    onClick,
    onRemove,
    className,
    ...props
  },
  ref
) {
  const handleRemove = (e) => {
    e.stopPropagation()
    onRemove?.(e)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.(e)
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      className={classNames(
        'inline-flex items-center gap-2 py-2.5 px-4 bg-white border border-cloud rounded-full font-body text-sm font-medium text-charcoal cursor-pointer transition-all duration-150 whitespace-nowrap select-none',
        'hover:not-disabled:border-slate',
        'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
        active &&
          'bg-charcoal border-charcoal text-white hover:not-disabled:bg-charcoal/90 hover:not-disabled:border-charcoal/90',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-pressed={active}
      {...props}
    >
      {icon && (
        <span className="text-base leading-none" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="leading-tight">{label}</span>
      {hasDropdown && !active && (
        <span className="text-[10px] opacity-60 ml-1" aria-hidden="true">
          ▼
        </span>
      )}
      {removable && active && (
        <span
          className="flex items-center justify-center w-4 h-4 ml-1 -mr-1 rounded-full text-sm font-bold leading-none text-white bg-white/20 transition-colors duration-150 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-1"
          onClick={handleRemove}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleRemove(e)
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Remove ${label} filter`}
        >
          ×
        </span>
      )}
    </button>
  )
})

export default FilterChip
