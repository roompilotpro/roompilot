import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import './FilterChip.css'

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
        'filter-chip',
        active && 'filter-chip--active',
        disabled && 'filter-chip--disabled',
        removable && active && 'filter-chip--removable',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-pressed={active}
      {...props}
    >
      {icon && (
        <span className="filter-chip__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="filter-chip__label">{label}</span>
      {hasDropdown && !active && (
        <span className="filter-chip__arrow" aria-hidden="true">
          ▼
        </span>
      )}
      {removable && active && (
        <span
          className="filter-chip__remove"
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
