import { forwardRef } from 'react'
import classNames from '../../../utils/classNames'
import { Badge } from '../../primitives'

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
      <div ref={ref} className={classNames('w-full overflow-x-auto', className)} {...props}>
        <div className="py-12 px-6 text-center bg-white rounded-lg border border-cloud">
          {emptyState || (
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl opacity-50">💳</span>
              <p className="text-sm text-slate m-0">No payment history</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className={classNames('w-full overflow-x-auto', className)} {...props}>
      <table className="w-full border-collapse text-sm" role="grid">
        <thead className="bg-snow">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate whitespace-nowrap border-b-2 border-cloud">
              Date
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate whitespace-nowrap border-b-2 border-cloud">
              Description
            </th>
            <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider text-slate whitespace-nowrap border-b-2 border-cloud">
              Amount
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate whitespace-nowrap border-b-2 border-cloud">
              Status
            </th>
            <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider text-slate whitespace-nowrap border-b-2 border-cloud">
              Receipt
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className="border-b border-cloud last:border-b-0 transition-colors hover:bg-snow"
              role="row"
            >
              <td className="p-4 align-middle">
                <span className="text-sm text-slate">{formatDate(payment.date)}</span>
              </td>
              <td className="p-4 align-middle">
                <span className="text-sm text-charcoal">{payment.description}</span>
              </td>
              <td className="p-4 align-middle text-right">
                <span className="font-semibold text-charcoal">
                  {formatCurrency(payment.amount)}
                </span>
              </td>
              <td className="p-4 align-middle">
                <Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge>
              </td>
              <td className="p-4 align-middle text-right">
                {payment.receiptUrl || onViewReceipt ? (
                  <button
                    type="button"
                    className="bg-transparent border-0 p-0 text-sm font-medium text-primary cursor-pointer transition-colors hover:text-primary/80 hover:underline"
                    onClick={() => onViewReceipt?.(payment)}
                    aria-label={`View receipt for payment on ${formatDate(payment.date)}`}
                  >
                    View
                  </button>
                ) : onViewBreakdown ? (
                  <button
                    type="button"
                    className="bg-transparent border-0 p-0 text-sm font-medium text-primary cursor-pointer transition-colors hover:text-primary/80 hover:underline"
                    onClick={() => onViewBreakdown?.(payment)}
                    aria-label={`View breakdown for payment on ${formatDate(payment.date)}`}
                  >
                    View Breakdown →
                  </button>
                ) : (
                  <span className="text-mist">-</span>
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
