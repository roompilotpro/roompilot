import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { Badge, Button } from '../../primitives'

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
      className={classNames(
        'relative bg-white border-2 border-cloud rounded-lg p-8 text-center transition-all duration-150 hover:-translate-y-1 hover:shadow-lg sm:p-6',
        recommended && 'border-primary shadow-[0_8px_24px_rgba(37,99,235,0.15)]',
        className
      )}
      {...props}
    >
      {recommended && (
        <Badge color="primary" className="absolute -top-3 left-1/2 -translate-x-1/2">
          {recommendedText}
        </Badge>
      )}

      <h3 className="m-0 mb-2 font-display text-xl font-semibold text-charcoal">{planName}</h3>
      {description && <p className="m-0 mb-4 text-sm text-slate">{description}</p>}

      <div className="mb-6">
        <span className="font-display text-5xl font-bold text-charcoal sm:text-4xl">{price}</span>
        <span className="text-base text-slate ml-1">{period}</span>
      </div>

      {features.length > 0 && (
        <ul className="list-none m-0 mb-6 p-0 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 py-2 text-sm text-charcoal/80">
              <svg
                className="shrink-0 w-4 h-3.5 text-accent"
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
          className="mt-auto"
        >
          {ctaText}
        </Button>
      )}
    </article>
  )
})

export default PricingCard
