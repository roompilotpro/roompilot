import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import './FeatureCard.css'

/**
 * FeatureCard - Marketing feature display card
 */
const FeatureCard = forwardRef(function FeatureCard(
  { icon, heading, description, metrics, highlight = false, hoverable = true, className, ...props },
  ref
) {
  return (
    <article
      ref={ref}
      className={classNames(
        'feature-card',
        highlight && 'feature-card--highlight',
        hoverable && 'feature-card--hoverable',
        className
      )}
      {...props}
    >
      <div className="feature-card__icon">{icon}</div>
      <h3 className="feature-card__heading">{heading}</h3>
      <p className="feature-card__description">{description}</p>

      {metrics && metrics.length > 0 && (
        <div className="feature-card__metrics">
          {metrics.map((metric, index) => (
            <div key={index} className="feature-card__metric">
              <span className="feature-card__metric-value">{metric.value}</span>
              <span className="feature-card__metric-label">{metric.label}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  )
})

export default FeatureCard
