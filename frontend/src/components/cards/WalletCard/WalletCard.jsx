import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { Button, Skeleton } from '../../primitives'
import './WalletCard.css'

/**
 * WalletCard - Wallet balance display card with gradient background
 */
const WalletCard = forwardRef(function WalletCard(
  {
    balance,
    label = 'Wallet Balance',
    onAddFunds,
    onWithdraw,
    loading = false,
    className,
    ...props
  },
  ref
) {
  const formattedBalance =
    typeof balance === 'number'
      ? balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : balance

  return (
    <div ref={ref} className={classNames('wallet-card', className)} {...props}>
      <span className="wallet-card__label">{label}</span>

      {loading ? (
        <Skeleton variant="text" width="60%" height={48} className="wallet-card__skeleton" />
      ) : (
        <span className="wallet-card__balance">${formattedBalance}</span>
      )}

      <div className="wallet-card__actions">
        {onAddFunds && (
          <Button variant="white" size="md" onClick={onAddFunds} disabled={loading}>
            Add Funds
          </Button>
        )}
        {onWithdraw && (
          <Button
            variant="outline"
            size="md"
            onClick={onWithdraw}
            disabled={loading}
            className="wallet-card__withdraw-btn"
          >
            Withdraw
          </Button>
        )}
      </div>
    </div>
  )
})

export default WalletCard
