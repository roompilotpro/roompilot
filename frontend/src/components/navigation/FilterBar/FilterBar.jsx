import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import { FilterChip } from '../FilterChip'
import './FilterBar.css'

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
      className={classNames('filter-bar', sticky && 'filter-bar--sticky', className)}
      role="toolbar"
      aria-label="Filters"
      {...props}
    >
      <div className="filter-bar__chips">
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
        <div className="filter-bar__actions">
          {activeCount > 0 && removable && (
            <button type="button" className="filter-bar__clear" onClick={handleClearAll}>
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
