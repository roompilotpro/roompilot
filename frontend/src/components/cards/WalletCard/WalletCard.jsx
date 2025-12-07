import { forwardRef } from 'react'
import { classNames } from '../../../utils/classNames'
import { Button, Skeleton } from '../../primitives'

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
    <div
      ref={ref}
      className={classNames(
        'bg-gradient-to-br from-charcoal to-midnight rounded-lg p-6 text-white',
        className
      )}
      {...props}
    >
      <span className="block text-sm opacity-80 mb-2">{label}</span>

      {loading ? (
        <Skeleton variant="text" width="60%" height={48} className="mb-5" />
      ) : (
        <span className="block font-display text-5xl font-bold leading-tight mb-5 sm:text-4xl">
          ${formattedBalance}
        </span>
      )}

      <div className="flex gap-3 sm:flex-col">
        {onAddFunds && (
          <Button
            variant="white"
            size="md"
            onClick={onAddFunds}
            disabled={loading}
            className="sm:w-full"
          >
            Add Funds
          </Button>
        )}
        {onWithdraw && (
          <Button
            variant="outline"
            size="md"
            onClick={onWithdraw}
            disabled={loading}
            className="border-white/30 text-white hover:border-white/50 hover:bg-white/10 sm:w-full"
          >
            Withdraw
          </Button>
        )}
      </div>
    </div>
  )
})

export default WalletCard
