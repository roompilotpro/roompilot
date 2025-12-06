import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { Badge, Button } from '../../primitives'
import './PaymentCard.css'

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
      className={classNames('payment-card', disabled && 'payment-card--disabled', className)}
      {...props}
    >
      <div className="payment-card__icon">{typeIcons[type] || typeIcons.visa}</div>

      <div className="payment-card__info">
        <span className="payment-card__type">{typeLabels[type] || type}</span>
        <span className="payment-card__number">{numberDisplay}</span>
        {expiryDate && <span className="payment-card__expiry">Expires {expiryDate}</span>}
      </div>

      {isDefault && (
        <Badge color="primary" size="sm" className="payment-card__default">
          Default
        </Badge>
      )}

      <div className="payment-card__actions">
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
