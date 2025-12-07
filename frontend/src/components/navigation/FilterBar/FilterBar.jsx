import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import { FilterChip } from '../FilterChip'

/**
 * FilterBar - Container for filter chips with horizontal scrolling on mobile
 *
 * @param {Array} filters - Array of filter objects { id, label, icon?, hasDropdown?, active?, disabled? }
 * @param {Object} [activeFilters={}] - Object mapping filter IDs to active state { filterId: true/false }
 * @param {Function} [onFilterClick] - Callback when filter is clicked, receives filter id
 * @param {Function} [onFilterRemove] - Callback when filter is removed, receives filter id
 * @param {boolean} [removable=false] - Allow active filters to be removed
 * @param {ReactNode} [children] - Additional content (e.g., clear all button)
 * @param {boolean} [sticky=false] - Make the filter bar sticky
 * @param {string} [className] - Additional CSS classes
 */
const FilterBar = forwardRef(function FilterBar(
  {
    filters = [],
    activeFilters = {},
    onFilterClick,
    onFilterRemove,
    removable = false,
    children,
    sticky = false,
    className,
    ...props
  },
  ref
) {
  const activeCount = Object.values(activeFilters).filter(Boolean).length

  const handleClearAll = () => {
    Object.keys(activeFilters).forEach((filterId) => {
      if (activeFilters[filterId]) {
        onFilterRemove?.(filterId)
      }
    })
  }

  return (
    <div
      ref={ref}
      className={classNames(
        'flex items-center gap-3 py-3 px-6 bg-white border-b border-cloud md:px-4',
        sticky && 'sticky top-0 z-40',
        className
      )}
      role="toolbar"
      aria-label="Filters"
      {...props}
    >
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none flex-1 min-w-0">
        {filters.map((filter) => (
          <FilterChip
            key={filter.id}
            icon={filter.icon}
            label={filter.label}
            active={activeFilters[filter.id] || filter.active}
            hasDropdown={filter.hasDropdown}
            removable={removable}
            disabled={filter.disabled}
            onClick={() => onFilterClick?.(filter.id)}
            onRemove={() => onFilterRemove?.(filter.id)}
          />
        ))}
      </div>

      {(activeCount > 0 || children) && (
        <div className="flex items-center gap-3 shrink-0 md:absolute md:right-4 md:bg-gradient-to-r md:from-transparent md:to-white md:pl-6">
          {activeCount > 0 && removable && (
            <button
              type="button"
              className="py-2 px-3 bg-transparent border-none font-body text-sm font-medium text-primary cursor-pointer whitespace-nowrap transition-colors duration-150 hover:text-primary/80 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:rounded-sm"
              onClick={handleClearAll}
            >
              Clear all ({activeCount})
            </button>
          )}
          {children}
        </div>
      )}
    </div>
  )
})

export default FilterBar
