import { forwardRef, useState } from 'react'
import classNames from '../../../utils/classNames'
import './ChartBar.css'

/**
 * ChartBar - Simple bar chart visualization
 *
 * @param {Array} data - Array of data points { label, value, color? }
 * @param {number} [height=160] - Chart height in pixels
 * @param {boolean} [showTooltip=true] - Show value on hover
 * @param {boolean} [showLabels=true] - Show x-axis labels
 * @param {Function} [formatValue] - Custom value formatter
 * @param {string} [className] - Additional CSS classes
 */
const ChartBar = forwardRef(function ChartBar(
  {
    data = [],
    height = 160,
    showTooltip = true,
    showLabels = true,
    formatValue = (v) => v,
    className,
    ...props
  },
  ref
) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const maxValue = Math.max(...data.map((d) => d.value), 0)

  const getBarHeight = (value) => {
    if (maxValue === 0) return 0
    return (value / maxValue) * 100
  }

  return (
    <div
      ref={ref}
      className={classNames('chart-bar', className)}
      style={{ '--chart-height': `${height}px` }}
      {...props}
    >
      <div className="chart-bar__bars">
        {data.map((item, index) => {
          const barHeight = getBarHeight(item.value)
          const isHovered = hoveredIndex === index

          return (
            <div
              key={index}
              className="chart-bar__bar-wrapper"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={classNames('chart-bar__bar', isHovered && 'chart-bar__bar--hovered')}
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: item.color,
                }}
                role="graphics-symbol"
                aria-label={`${item.label}: ${formatValue(item.value)}`}
              />
              {showTooltip && isHovered && (
                <div className="chart-bar__tooltip">{formatValue(item.value)}</div>
              )}
            </div>
          )
        })}
      </div>
      {showLabels && (
        <div className="chart-bar__labels">
          {data.map((item, index) => (
            <span key={index} className="chart-bar__label">
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
})

export default ChartBar
