import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import './ViewToggle.css'

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
      className={classNames('view-toggle', `view-toggle--${size}`, className)}
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
            className={classNames('view-toggle__btn', isActive && 'view-toggle__btn--active')}
            onClick={() => handleClick(view.id)}
            aria-pressed={isActive}
          >
            {view.icon && (
              <span className="view-toggle__icon" aria-hidden="true">
                {view.icon}
              </span>
            )}
            {view.label && <span className="view-toggle__label">{view.label}</span>}
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
