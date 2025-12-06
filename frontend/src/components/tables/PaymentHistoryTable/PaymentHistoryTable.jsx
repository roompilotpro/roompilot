import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import { Badge } from '../../primitives'
import './PaymentHistoryTable.css'

/**
 * PaymentHistoryTable - Table for displaying payment history
 *
 * @param {Array} payments - Array of payment objects
 * @param {Function} [onViewReceipt] - Handler for viewing receipt
 * @param {Function} [onViewBreakdown] - Handler for viewing breakdown
 * @param {ReactNode} [emptyState] - Custom empty state content
 * @param {string} [className] - Additional CSS classes
 */
const PaymentHistoryTable = forwardRef(function PaymentHistoryTable(
  { payments = [], onViewReceipt, onViewBreakdown, emptyState, className, ...props },
  ref
) {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'success'
      case 'pending':
      case 'processing':
        return 'warning'
      case 'failed':
      case 'declined':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    const d = date instanceof Date ? date : new Date(date)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount) => {
    if (amount == null) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  if (payments.length === 0) {
    return (
      <div ref={ref} className={classNames('payment-history', className)} {...props}>
        <div className="payment-history__empty">
          {emptyState || (
            <div className="payment-history__empty-default">
              <span className="payment-history__empty-icon">💳</span>
              <p className="payment-history__empty-text">No payment history</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className={classNames('payment-history', className)} {...props}>
      <table className="payment-history__table" role="grid">
        <thead className="payment-history__header">
          <tr>
            <th className="payment-history__header-cell">Date</th>
            <th className="payment-history__header-cell">Description</th>
            <th className="payment-history__header-cell payment-history__header-cell--right">
              Amount
            </th>
            <th className="payment-history__header-cell">Status</th>
            <th className="payment-history__header-cell payment-history__header-cell--right">
              Receipt
            </th>
          </tr>
        </thead>
        <tbody className="payment-history__body">
          {payments.map((payment) => (
            <tr key={payment.id} className="payment-history__row" role="row">
              <td className="payment-history__cell">
                <span className="payment-history__date">{formatDate(payment.date)}</span>
              </td>
              <td className="payment-history__cell">
                <span className="payment-history__description">{payment.description}</span>
              </td>
              <td className="payment-history__cell payment-history__cell--right">
                <span className="payment-history__amount">{formatCurrency(payment.amount)}</span>
              </td>
              <td className="payment-history__cell">
                <Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge>
              </td>
              <td className="payment-history__cell payment-history__cell--right">
                {payment.receiptUrl || onViewReceipt ? (
                  <button
                    type="button"
                    className="payment-history__link"
                    onClick={() => onViewReceipt?.(payment)}
                    aria-label={`View receipt for payment on ${formatDate(payment.date)}`}
                  >
                    View
                  </button>
                ) : onViewBreakdown ? (
                  <button
                    type="button"
                    className="payment-history__link"
                    onClick={() => onViewBreakdown?.(payment)}
                    aria-label={`View breakdown for payment on ${formatDate(payment.date)}`}
                  >
                    View Breakdown →
                  </button>
                ) : (
                  <span className="payment-history__no-receipt">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default PaymentHistoryTable
