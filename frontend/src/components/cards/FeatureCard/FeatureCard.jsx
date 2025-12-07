import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'

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
        'bg-white border border-cloud rounded-lg p-6',
        highlight && 'border-primary ring-1 ring-primary',
        hoverable && 'transition-all duration-150 hover:-translate-y-1 hover:shadow-md',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-warm-bg rounded-md text-2xl mb-4">
        {icon}
      </div>
      <h3 className="m-0 mb-3 font-display text-lg font-semibold text-charcoal">{heading}</h3>
      <p className="m-0 text-sm text-slate leading-relaxed">{description}</p>

      {metrics && metrics.length > 0 && (
        <div className="flex gap-6 mt-5 pt-5 border-t border-cloud">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col gap-0.5">
              <span className="font-display text-2xl font-bold text-charcoal">{metric.value}</span>
              <span className="text-sm text-slate">{metric.label}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  )
})

export default FeatureCard
