import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'

// Size styles
const sizeStyles = {
  sm: 'py-1.5 px-3 text-xs',
  md: 'py-2.5 px-5 text-sm',
  lg: 'py-3 px-6 text-base',
}

/**
 * ViewToggle - Segmented control for switching between views (grid/list)
 *
 * @param {Array} views - Array of view options { id, label, icon? }
 * @param {string} activeView - ID of the currently active view
 * @param {Function} onChange - Callback when view changes, receives view id
 * @param {string} [size='md'] - Button size: 'sm' | 'md' | 'lg'
 * @param {string} [className] - Additional CSS classes
 */
const ViewToggle = forwardRef(function ViewToggle(
  { views = [], activeView, onChange, size = 'md', className, ...props },
  ref
) {
  const handleClick = (viewId) => {
    onChange?.(viewId)
  }

  return (
    <div
      ref={ref}
      className={classNames(
        'inline-flex bg-white border border-cloud rounded-md overflow-hidden',
        className
      )}
      role="group"
      aria-label="View options"
      {...props}
    >
      {views.map((view) => {
        const isActive = view.id === activeView

        return (
          <button
            key={view.id}
            type="button"
            className={classNames(
              'inline-flex items-center justify-center gap-2 border-none bg-transparent font-semibold cursor-pointer transition-all duration-150',
              sizeStyles[size],
              isActive
                ? 'bg-primary text-white'
                : 'text-slate hover:bg-snow hover:text-charcoal/80',
              'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px] focus-visible:z-[1]'
            )}
            onClick={() => handleClick(view.id)}
            aria-pressed={isActive}
          >
            {view.icon && (
              <span className="text-[1em] leading-none" aria-hidden="true">
                {view.icon}
              </span>
            )}
            {view.label && <span className="leading-tight">{view.label}</span>}
          </button>
        )
      })}
    </div>
  )
})

// Common preset views
ViewToggle.gridListViews = [
  { id: 'grid', label: 'Grid', icon: '▦' },
  { id: 'list', label: 'List', icon: '☰' },
]

export default ViewToggle
