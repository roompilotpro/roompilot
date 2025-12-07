import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'

// Size configurations
const sizeConfig = {
  sm: { track: 'h-1', label: 'text-xs' },
  md: { track: 'h-1.5', label: 'text-sm' },
  lg: { track: 'h-2', label: 'text-base' },
}

// Status colors
const statusColors = {
  high: 'bg-accent',
  medium: 'bg-warm',
  low: 'bg-coral',
}

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

  const sizes = sizeConfig[size]

  return (
    <div ref={ref} className={classNames('flex items-center gap-2', className)} {...props}>
      <div
        className={classNames('flex-1 bg-cloud rounded-full overflow-hidden', sizes.track)}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Occupancy: ${current} of ${total}`}
      >
        <div
          className={classNames(
            'h-full rounded-full transition-[width] duration-200',
            statusColors[getStatus()]
          )}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabel && (
        <span
          className={classNames('shrink-0 font-medium text-slate whitespace-nowrap', sizes.label)}
        >
          {showPercentage ? `${percentage}%` : `${current}/${total}`}
        </span>
      )}
    </div>
  )
})

export default OccupancyBar
