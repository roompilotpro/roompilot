import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PaymentHistoryTable from './PaymentHistoryTable'

const mockPayments = [
  {
    id: 1,
    date: new Date('2024-12-01T12:00:00'),
    description: 'Weekly rent - Week of Dec 1-7',
    amount: 175,
    status: 'Paid',
    receiptUrl: '/receipts/1',
  },
  {
    id: 2,
    date: new Date('2024-11-24T12:00:00'),
    description: 'Weekly rent - Week of Nov 24-30',
    amount: 175,
    status: 'Pending',
  },
  {
    id: 3,
    date: new Date('2024-11-17T12:00:00'),
    description: 'Weekly rent - Week of Nov 17-23',
    amount: 175,
    status: 'Failed',
  },
]

describe('PaymentHistoryTable', () => {
  // Basic rendering
  it('renders the table', () => {
    render(<PaymentHistoryTable payments={mockPayments} />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(<PaymentHistoryTable payments={mockPayments} />)
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Amount')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Receipt')).toBeInTheDocument()
  })

  it('renders payment rows', () => {
    render(<PaymentHistoryTable payments={mockPayments} />)
    expect(screen.getByText('Weekly rent - Week of Dec 1-7')).toBeInTheDocument()
    expect(screen.getByText('Weekly rent - Week of Nov 24-30')).toBeInTheDocument()
    expect(screen.getByText('Weekly rent - Week of Nov 17-23')).toBeInTheDocument()
  })

  // Empty state
  it('renders default empty state when no payments', () => {
    render(<PaymentHistoryTable payments={[]} />)
    expect(screen.getByText('No payment history')).toBeInTheDocument()
  })

  it('renders custom empty state', () => {
    render(<PaymentHistoryTable payments={[]} emptyState={<div>Custom empty</div>} />)
    expect(screen.getByText('Custom empty')).toBeInTheDocument()
  })

  // Date formatting
  it('formats dates correctly', () => {
    render(<PaymentHistoryTable payments={mockPayments} />)
    expect(screen.getByText('Dec 1, 2024')).toBeInTheDocument()
  })

  // Currency formatting
  it('formats amounts as currency', () => {
    render(<PaymentHistoryTable payments={mockPayments} />)
    expect(screen.getAllByText('$175.00')).toHaveLength(3)
  })

  // Status badges
  it('renders Paid status badge', () => {
    render(<PaymentHistoryTable payments={mockPayments} />)
    expect(screen.getByText('Paid')).toBeInTheDocument()
  })

  it('renders Pending status badge', () => {
    render(<PaymentHistoryTable payments={mockPayments} />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('renders Failed status badge', () => {
    render(<PaymentHistoryTable payments={mockPayments} />)
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })

  // Receipt actions
  it('renders View button when receiptUrl exists', () => {
    render(<PaymentHistoryTable payments={mockPayments} onViewReceipt={() => {}} />)
    expect(screen.getAllByText('View').length).toBeGreaterThan(0)
  })

  it('calls onViewReceipt when View button clicked', () => {
    const handleViewReceipt = vi.fn()
    render(<PaymentHistoryTable payments={mockPayments} onViewReceipt={handleViewReceipt} />)
    const viewButtons = screen.getAllByText('View')
    fireEvent.click(viewButtons[0])
    expect(handleViewReceipt).toHaveBeenCalledWith(mockPayments[0])
  })

  it('renders View Breakdown link when onViewBreakdown provided', () => {
    const paymentsWithoutReceipt = [{ ...mockPayments[1] }]
    render(<PaymentHistoryTable payments={paymentsWithoutReceipt} onViewBreakdown={() => {}} />)
    expect(screen.getByText('View Breakdown →')).toBeInTheDocument()
  })

  it('calls onViewBreakdown when clicked', () => {
    const handleViewBreakdown = vi.fn()
    const paymentsWithoutReceipt = [{ ...mockPayments[1] }]
    render(
      <PaymentHistoryTable
        payments={paymentsWithoutReceipt}
        onViewBreakdown={handleViewBreakdown}
      />
    )
    fireEvent.click(screen.getByText('View Breakdown →'))
    expect(handleViewBreakdown).toHaveBeenCalledWith(paymentsWithoutReceipt[0])
  })

  // Accessibility
  it('has accessible receipt button labels', () => {
    render(<PaymentHistoryTable payments={mockPayments} onViewReceipt={() => {}} />)
    expect(screen.getByLabelText(/View receipt for payment on Dec 1, 2024/)).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(
      <PaymentHistoryTable payments={mockPayments} className="custom-table" />
    )
    expect(container.querySelector('.payment-history')).toHaveClass('custom-table')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<PaymentHistoryTable ref={ref} payments={mockPayments} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('payment-history')
  })
})
