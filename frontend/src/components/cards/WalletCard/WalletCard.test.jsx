import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WalletCard from './WalletCard'

describe('WalletCard', () => {
  it('renders balance with dollar sign', () => {
    render(<WalletCard balance={175} />)
    expect(screen.getByText('$175.00')).toBeInTheDocument()
  })

  it('renders formatted balance with commas', () => {
    render(<WalletCard balance={1234.56} />)
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })

  it('renders string balance as-is', () => {
    render(<WalletCard balance="175.00" />)
    expect(screen.getByText('$175.00')).toBeInTheDocument()
  })

  it('renders default label', () => {
    render(<WalletCard balance={100} />)
    expect(screen.getByText('Wallet Balance')).toBeInTheDocument()
  })

  it('renders custom label', () => {
    render(<WalletCard balance={100} label="Available Balance" />)
    expect(screen.getByText('Available Balance')).toBeInTheDocument()
  })

  // Loading state
  it('shows skeleton when loading', () => {
    const { container } = render(<WalletCard balance={100} loading />)
    expect(container.querySelector('.skeleton')).toBeInTheDocument()
  })

  it('hides balance when loading', () => {
    render(<WalletCard balance={100} loading />)
    expect(screen.queryByText('$100.00')).not.toBeInTheDocument()
  })

  // Actions
  it('renders Add Funds button when onAddFunds provided', () => {
    render(<WalletCard balance={100} onAddFunds={() => {}} />)
    expect(screen.getByRole('button', { name: 'Add Funds' })).toBeInTheDocument()
  })

  it('renders Withdraw button when onWithdraw provided', () => {
    render(<WalletCard balance={100} onWithdraw={() => {}} />)
    expect(screen.getByRole('button', { name: 'Withdraw' })).toBeInTheDocument()
  })

  it('does not render Add Funds when onAddFunds not provided', () => {
    render(<WalletCard balance={100} />)
    expect(screen.queryByRole('button', { name: 'Add Funds' })).not.toBeInTheDocument()
  })

  it('calls onAddFunds when Add Funds clicked', async () => {
    const user = userEvent.setup()
    const handleAddFunds = vi.fn()
    render(<WalletCard balance={100} onAddFunds={handleAddFunds} />)

    await user.click(screen.getByRole('button', { name: 'Add Funds' }))
    expect(handleAddFunds).toHaveBeenCalledTimes(1)
  })

  it('calls onWithdraw when Withdraw clicked', async () => {
    const user = userEvent.setup()
    const handleWithdraw = vi.fn()
    render(<WalletCard balance={100} onWithdraw={handleWithdraw} />)

    await user.click(screen.getByRole('button', { name: 'Withdraw' }))
    expect(handleWithdraw).toHaveBeenCalledTimes(1)
  })

  it('disables buttons when loading', () => {
    render(<WalletCard balance={100} onAddFunds={() => {}} onWithdraw={() => {}} loading />)
    expect(screen.getByRole('button', { name: 'Add Funds' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Withdraw' })).toBeDisabled()
  })

  // Zero balance
  it('handles zero balance', () => {
    render(<WalletCard balance={0} />)
    expect(screen.getByText('$0.00')).toBeInTheDocument()
  })

  // Large balance
  it('formats large balance correctly', () => {
    render(<WalletCard balance={123456.78} />)
    expect(screen.getByText('$123,456.78')).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<WalletCard balance={100} className="custom-wallet" />)
    expect(container.querySelector('.wallet-card')).toHaveClass('custom-wallet')
  })

  // Ref forwarding
  it('forwards ref to container element', () => {
    const ref = { current: null }
    render(<WalletCard ref={ref} balance={100} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
