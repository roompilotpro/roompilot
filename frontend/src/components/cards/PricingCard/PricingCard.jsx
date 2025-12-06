import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { Badge, Button } from '../../primitives'
import './PricingCard.css'

/**
 * PricingCard - Pricing plan display card
 */
const PricingCard = forwardRef(function PricingCard(
  {
    planName,
    description,
    price,
    period,
    features = [],
    ctaText,
    ctaHref,
    onCtaClick,
    recommended = false,
    recommendedText = 'Recommended',
    ctaVariant = 'primary',
    className,
    ...props
  },
  ref
) {
  return (
    <article
      ref={ref}
      className={classNames('pricing-card', recommended && 'pricing-card--recommended', className)}
      {...props}
    >
      {recommended && (
        <Badge color="primary" className="pricing-card__badge">
          {recommendedText}
        </Badge>
      )}

      <h3 className="pricing-card__name">{planName}</h3>
      {description && <p className="pricing-card__description">{description}</p>}

      <div className="pricing-card__price">
        <span className="pricing-card__price-amount">{price}</span>
        <span className="pricing-card__price-period">{period}</span>
      </div>

      {features.length > 0 && (
        <ul className="pricing-card__features">
          {features.map((feature, index) => (
            <li key={index} className="pricing-card__feature">
              <svg
                className="pricing-card__check"
                viewBox="0 0 12 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 5L4.5 8.5L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      )}

      {(ctaText || ctaHref || onCtaClick) && (
        <Button
          variant={ctaVariant}
          fullWidth
          href={ctaHref}
          onClick={onCtaClick}
          className="pricing-card__cta"
        >
          {ctaText}
        </Button>
      )}
    </article>
  )
})

export default PricingCard
