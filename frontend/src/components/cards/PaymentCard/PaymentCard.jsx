import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { Badge, Button } from '../../primitives'

const typeLabels = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
  bank: 'Bank Account',
}

const typeIcons = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
  bank: '🏦',
}

/**
 * PaymentCard - Payment method display card
 */
const PaymentCard = forwardRef(function PaymentCard(
  {
    type = 'visa',
    lastFour,
    expiryDate,
    isDefault = false,
    onEdit,
    onRemove,
    disabled = false,
    className,
    ...props
  },
  ref
) {
  const numberDisplay =
    type === 'bank' ? `Account ending in ${lastFour}` : `•••• •••• •••• ${lastFour}`

  return (
    <div
      ref={ref}
      className={classNames(
        'flex items-center gap-4 p-4 bg-white border border-cloud rounded-lg sm:flex-wrap',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-12 h-8 bg-cloud rounded-sm text-lg">
        {typeIcons[type] || typeIcons.visa}
      </div>

      <div className="flex-1 flex flex-col gap-0.5 min-w-0 sm:basis-[calc(100%-64px)]">
        <span className="text-sm font-semibold text-charcoal">{typeLabels[type] || type}</span>
        <span className="text-sm text-slate font-mono">{numberDisplay}</span>
        {expiryDate && <span className="text-xs text-slate">Expires {expiryDate}</span>}
      </div>

      {isDefault && (
        <Badge color="primary" size="sm" className="shrink-0">
          Default
        </Badge>
      )}

      <div className="flex gap-2 shrink-0">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit} disabled={disabled}>
            Edit
          </Button>
        )}
        {onRemove && (
          <Button variant="ghost" size="sm" onClick={onRemove} disabled={disabled}>
            Remove
          </Button>
        )}
      </div>
    </div>
  )
})

export default PaymentCard
