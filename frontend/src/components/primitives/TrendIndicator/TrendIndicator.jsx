import { classNames } from '../../../utils/classNames'
import './TrendIndicator.css'

/**
 * TrendIndicator component for showing up/down trends
 *
 * @param {Object} props
 * @param {number} props.value - Percentage change value
 * @param {'positive'|'negative'|'neutral'} [props.trend] - Override trend direction
 * @param {'sm'|'md'} [props.size='md'] - Size variant
 * @param {string} [props.className] - Additional CSS classes
 */
function TrendIndicator({ value, trend, size = 'md', className, ...props }) {
  // Determine trend from value if not explicitly set
  const trendDirection = trend || (value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral')
  const displayValue = Math.abs(value).toFixed(1)

  return (
    <span
      className={classNames('trend', `trend--${trendDirection}`, `trend--${size}`, className)}
      aria-label={`${trendDirection === 'positive' ? 'Up' : trendDirection === 'negative' ? 'Down' : 'No change'} ${displayValue}%`}
      {...props}
    >
      {trendDirection !== 'neutral' && (
        <svg
          className="trend__arrow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {trendDirection === 'positive' ? <path d="M18 15l-6-6-6 6" /> : <path d="M6 9l6 6 6-6" />}
        </svg>
      )}
      <span className="trend__value">{displayValue}%</span>
    </span>
  )
}

export default TrendIndicator
