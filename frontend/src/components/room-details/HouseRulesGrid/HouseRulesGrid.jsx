import { forwardRef } from 'react'
import { classNames } from '../../../utils'

/**
 * HouseRulesGrid - Grid display of house rules with allowed/not-allowed states
 *
 * @param {Object} props
 * @param {Array<{label: string, allowed: boolean}>} props.rules - Rule items
 * @param {string} props.title - Section title
 * @param {string} props.className - Additional CSS class
 */
const HouseRulesGrid = forwardRef(function HouseRulesGrid(
  { rules = [], title = 'House rules', className, ...props },
  ref
) {
  return (
    <section ref={ref} className={classNames('py-8 border-b border-cloud', className)} {...props}>
      <h2 className="font-display text-[22px] font-semibold text-midnight mb-5">{title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="flex items-center gap-2.5 py-3 px-4 bg-snow rounded-md text-sm text-charcoal"
          >
            <span
              className={classNames(
                'text-lg shrink-0',
                rule.allowed ? 'text-accent' : 'text-coral'
              )}
            >
              {rule.allowed ? '✓' : '✗'}
            </span>
            {rule.label}
          </div>
        ))}
      </div>
    </section>
  )
})

export default HouseRulesGrid
