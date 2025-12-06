import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { TrendIndicator } from '../../primitives'
import './StatCard.css'

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
      className={classNames('stat-card', hoverable && 'stat-card--hoverable', className)}
      {...props}
    >
      <div className="stat-card__header">
        <div className={classNames('stat-card__icon', `stat-card__icon--${color}`)}>{icon}</div>
        {trendValue !== undefined && <TrendIndicator value={trendValue} trend={trendDirection} />}
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </article>
  )
})

export default StatCard
