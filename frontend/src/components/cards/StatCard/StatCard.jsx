import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { TrendIndicator } from '../../primitives'

// Icon background color variants
const iconColorStyles = {
  blue: 'bg-primary-bg',
  green: 'bg-accent-bg',
  amber: 'bg-warm-bg',
  purple: 'bg-purple-bg',
}

/**
 * StatCard - Display key metrics with icon and optional trend
 */
const StatCard = forwardRef(function StatCard(
  {
    icon,
    color = 'blue',
    value,
    label,
    trendValue,
    trendDirection,
    hoverable = true,
    className,
    ...props
  },
  ref
) {
  return (
    <article
      ref={ref}
      className={classNames(
        'bg-white border border-cloud rounded-lg p-6',
        hoverable && 'transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={classNames(
            'flex items-center justify-center w-11 h-11 rounded-xl text-[22px]',
            iconColorStyles[color]
          )}
        >
          {icon}
        </div>
        {trendValue !== undefined && <TrendIndicator value={trendValue} trend={trendDirection} />}
      </div>
      <div className="font-display text-[32px] font-bold text-midnight leading-none mb-1">
        {value}
      </div>
      <div className="text-sm text-mist">{label}</div>
    </article>
  )
})

export default StatCard
