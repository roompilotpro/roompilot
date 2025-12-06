import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import './OccupancyBar.css'

/**
 * OccupancyBar - Visual indicator for occupancy/capacity percentage
 *
 * @param {number} current - Current occupied count
 * @param {number} total - Total capacity
 * @param {boolean} [showLabel=true] - Show "X/Y" label
 * @param {boolean} [showPercentage=false] - Show percentage instead of count
 * @param {string} [size='md'] - Size: 'sm' | 'md' | 'lg'
 * @param {string} [className] - Additional CSS classes
 */
const OccupancyBar = forwardRef(function OccupancyBar(
  {
    current = 0,
    total = 0,
    showLabel = true,
    showPercentage = false,
    size = 'md',
    className,
    ...props
  },
  ref
) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0
  const clampedPercentage = Math.min(100, Math.max(0, percentage))

  const getStatus = () => {
    if (percentage >= 75) return 'high'
    if (percentage >= 50) return 'medium'
    return 'low'
  }

  return (
    <div
      ref={ref}
      className={classNames('occupancy-bar', `occupancy-bar--${size}`, className)}
      {...props}
    >
      <div
        className="occupancy-bar__track"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Occupancy: ${current} of ${total}`}
      >
        <div
          className={classNames('occupancy-bar__fill', `occupancy-bar__fill--${getStatus()}`)}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="occupancy-bar__label">
          {showPercentage ? `${percentage}%` : `${current}/${total}`}
        </span>
      )}
    </div>
  )
})

export default OccupancyBar
