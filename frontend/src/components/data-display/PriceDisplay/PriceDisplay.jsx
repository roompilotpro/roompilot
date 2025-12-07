import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'

// Size configurations
const sizeConfig = {
  sm: { amount: 'text-sm', period: 'text-xs' },
  md: { amount: 'text-lg', period: 'text-sm' },
  lg: { amount: 'text-2xl', period: 'text-base' },
  xl: { amount: 'text-3xl', period: 'text-lg' },
}

/**
 * PriceDisplay - Formatted currency display with period
 *
 * @param {number} amount - The price amount
 * @param {string} [period] - Time period: '/week' | '/month' | '/year' | 'total'
 * @param {string} [currency='USD'] - Currency code
 * @param {string} [locale='en-US'] - Locale for formatting
 * @param {string} [size='md'] - Size: 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} [showDecimals=false] - Show decimal places
 * @param {number|string} [originalAmount] - Strikethrough original price (for discounts)
 * @param {string} [className] - Additional CSS classes
 */
const PriceDisplay = forwardRef(function PriceDisplay(
  {
    amount,
    period,
    currency = 'USD',
    locale = 'en-US',
    size = 'md',
    showDecimals = false,
    originalAmount,
    className,
    ...props
  },
  ref
) {
  const formatPrice = (value) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(numValue)
  }

  const periodLabels = {
    '/week': '/week',
    '/month': '/mo',
    '/year': '/year',
    total: '',
  }

  const sizes = sizeConfig[size]

  return (
    <div ref={ref} className={classNames('inline-flex items-baseline gap-1', className)} {...props}>
      {originalAmount && (
        <span className={classNames('font-normal text-slate line-through', sizes.period)}>
          {formatPrice(originalAmount)}
        </span>
      )}
      <span
        className={classNames(
          'font-bold',
          sizes.amount,
          originalAmount ? 'text-coral' : 'text-charcoal'
        )}
      >
        {formatPrice(amount)}
      </span>
      {period && period !== 'total' && (
        <span className={classNames('font-normal text-slate', sizes.period)}>
          {periodLabels[period] || period}
        </span>
      )}
    </div>
  )
})

export default PriceDisplay
