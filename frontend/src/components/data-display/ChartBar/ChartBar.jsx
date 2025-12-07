import { forwardRef, useState } from 'react'
import classNames from '../../../utils/classNames'

// Tooltip animation styles
const chartStyles = `
  @keyframes chart-tooltip-fade-in {
    from { opacity: 0; transform: translateX(-50%) translateY(4px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  .chart-tooltip-animate { animation: chart-tooltip-fade-in 0.15s ease-out; }
`

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
    <>
      <style>{chartStyles}</style>
      <div ref={ref} className={classNames('flex flex-col gap-2', className)} {...props}>
        <div className="flex items-end gap-2" style={{ height: `${height}px` }}>
          {data.map((item, index) => {
            const barHeight = getBarHeight(item.value)
            const isHovered = hoveredIndex === index

            return (
              <div
                key={index}
                className="flex-1 relative h-full flex items-end"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={classNames(
                    'w-full min-h-1 bg-primary rounded-t-sm transition-all duration-150 cursor-pointer',
                    isHovered && 'bg-primary/80 scale-x-105'
                  )}
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: item.color,
                  }}
                  role="graphics-symbol"
                  aria-label={`${item.label}: ${formatValue(item.value)}`}
                />
                {showTooltip && isHovered && (
                  <div className="chart-tooltip-animate absolute bottom-full left-1/2 -translate-x-1/2 mb-2 py-1 px-2 bg-charcoal text-white text-xs font-medium rounded-md whitespace-nowrap z-10 pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-charcoal">
                    {formatValue(item.value)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {showLabels && (
          <div className="flex gap-2">
            {data.map((item, index) => (
              <span
                key={index}
                className="flex-1 text-center text-xs text-slate overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {item.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  )
})

export default ChartBar
