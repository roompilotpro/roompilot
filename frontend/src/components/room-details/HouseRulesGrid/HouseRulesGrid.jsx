import { forwardRef } from 'react'
import { classNames } from '../../../utils'
import './HouseRulesGrid.css'

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
    <section ref={ref} className={classNames('house-rules-grid', className)} {...props}>
      <h2 className="house-rules-grid__title">{title}</h2>

      <div className="house-rules-grid__list">
        {rules.map((rule, index) => (
          <div
            key={index}
            className={classNames(
              'house-rules-grid__item',
              rule.allowed
                ? 'house-rules-grid__item--allowed'
                : 'house-rules-grid__item--not-allowed'
            )}
          >
            <span className="house-rules-grid__icon">{rule.allowed ? '✓' : '✗'}</span>
            {rule.label}
          </div>
        ))}
      </div>
    </section>
  )
})

export default HouseRulesGrid
