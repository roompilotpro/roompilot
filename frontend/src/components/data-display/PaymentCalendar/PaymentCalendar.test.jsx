import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PaymentCalendar from './PaymentCalendar'

const mockPayments = [
  { date: new Date(2024, 11, 1), amount: 175, status: 'paid' },
  { date: new Date(2024, 11, 8), amount: 175, status: 'due' },
  { date: new Date(2024, 11, 15), amount: 175, status: 'pending' },
  { date: new Date(2024, 11, 22), amount: 175, status: 'overdue' },
]

describe('PaymentCalendar', () => {
  // Basic rendering
  it('renders the calendar', () => {
    const { container } = render(<PaymentCalendar year={2024} month={11} />)
    expect(container.querySelector('.payment-calendar')).toBeInTheDocument()
  })

  it('renders month name in header', () => {
    render(<PaymentCalendar year={2024} month={11} />)
    expect(screen.getByText('December 2024')).toBeInTheDocument()
  })

  it('renders day name headers', () => {
    render(<PaymentCalendar year={2024} month={11} />)
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Thu')).toBeInTheDocument()
    expect(screen.getByText('Fri')).toBeInTheDocument()
    expect(screen.getByText('Sat')).toBeInTheDocument()
  })

  it('renders all days of the month', () => {
    render(<PaymentCalendar year={2024} month={11} />)
    // December 2024 has 31 days
    for (let i = 1; i <= 31; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument()
    }
  })

  // Payment status styling
  it('applies paid status class to paid days', () => {
    const { container } = render(
      <PaymentCalendar year={2024} month={11} payments={mockPayments} />
    )
    const paidDay = container.querySelector('.payment-calendar__day--paid')
    expect(paidDay).toBeInTheDocument()
  })

  it('applies due status class to due days', () => {
    const { container } = render(
      <PaymentCalendar year={2024} month={11} payments={mockPayments} />
    )
    const dueDay = container.querySelector('.payment-calendar__day--due')
    expect(dueDay).toBeInTheDocument()
  })

  it('applies overdue status class to overdue days', () => {
    const { container } = render(
      <PaymentCalendar year={2024} month={11} payments={mockPayments} />
    )
    const overdueDay = container.querySelector('.payment-calendar__day--overdue')
    expect(overdueDay).toBeInTheDocument()
  })

  // Click handling
  it('calls onDateClick when day is clicked', () => {
    const handleClick = vi.fn()
    render(
      <PaymentCalendar
        year={2024}
        month={11}
        payments={mockPayments}
        onDateClick={handleClick}
      />
    )
    fireEvent.click(screen.getByText('15'))
    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith(
      expect.any(Date),
      expect.objectContaining({ status: 'pending' })
    )
  })

  it('does not call onDateClick for empty cells', () => {
    const handleClick = vi.fn()
    const { container } = render(
      <PaymentCalendar year={2024} month={11} onDateClick={handleClick} />
    )
    const emptyCell = container.querySelector('.payment-calendar__day--empty')
    if (emptyCell) {
      fireEvent.click(emptyCell)
    }
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies clickable class when onDateClick is provided', () => {
    const { container } = render(
      <PaymentCalendar year={2024} month={11} onDateClick={() => {}} />
    )
    expect(container.querySelector('.payment-calendar__day--clickable')).toBeInTheDocument()
  })

  // Legend
  it('renders payment legend', () => {
    render(<PaymentCalendar year={2024} month={11} />)
    expect(screen.getByText('Paid')).toBeInTheDocument()
    expect(screen.getByText('Due')).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  // Date string support
  it('accepts date strings in payments', () => {
    // Use ISO string with time to avoid timezone issues
    const paymentsWithStrings = [
      { date: '2024-12-01T12:00:00', amount: 175, status: 'paid' },
    ]
    const { container } = render(
      <PaymentCalendar year={2024} month={11} payments={paymentsWithStrings} />
    )
    expect(container.querySelector('.payment-calendar__day--paid')).toBeInTheDocument()
  })

  // Custom formatting
  it('uses custom formatAmount for aria-label', () => {
    const { container } = render(
      <PaymentCalendar
        year={2024}
        month={11}
        payments={mockPayments}
        formatAmount={(amount) => `AUD ${amount}`}
      />
    )
    const paidDay = container.querySelector('.payment-calendar__day--paid')
    expect(paidDay).toHaveAttribute('aria-label', expect.stringContaining('AUD 175'))
  })

  // Grid structure
  it('renders correct number of empty cells before first day', () => {
    // December 2024 starts on Sunday (0), so no empty cells before
    const { container } = render(<PaymentCalendar year={2024} month={11} />)
    const emptyCells = container.querySelectorAll('.payment-calendar__day--empty')
    expect(emptyCells).toHaveLength(0)
  })

  it('renders empty cells for month starting mid-week', () => {
    // November 2024 starts on Friday (5 empty cells)
    const { container } = render(<PaymentCalendar year={2024} month={10} />)
    const emptyCells = container.querySelectorAll('.payment-calendar__day--empty')
    expect(emptyCells).toHaveLength(5)
  })

  // Accessibility
  it('has accessible grid role', () => {
    render(<PaymentCalendar year={2024} month={11} />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('sets aria-label on grid', () => {
    render(<PaymentCalendar year={2024} month={11} />)
    expect(screen.getByRole('grid')).toHaveAttribute(
      'aria-label',
      'Payment calendar for December 2024'
    )
  })

  it('sets aria-label on days with payments', () => {
    const { container } = render(
      <PaymentCalendar year={2024} month={11} payments={mockPayments} />
    )
    const paidDay = container.querySelector('.payment-calendar__day--paid')
    expect(paidDay).toHaveAttribute('aria-label', expect.stringContaining('paid'))
  })

  // Default to current date
  it('defaults to current month when no year/month provided', () => {
    const now = new Date()
    const expectedMonth = now.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    render(<PaymentCalendar />)
    expect(screen.getByText(expectedMonth)).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<PaymentCalendar className="custom-calendar" />)
    expect(container.querySelector('.payment-calendar')).toHaveClass('custom-calendar')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<PaymentCalendar ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('payment-calendar')
  })

  // Empty payments
  it('renders without payments', () => {
    const { container } = render(<PaymentCalendar year={2024} month={11} payments={[]} />)
    expect(container.querySelector('.payment-calendar__day--paid')).not.toBeInTheDocument()
    expect(container.querySelector('.payment-calendar__day--due')).not.toBeInTheDocument()
  })

  // Today highlight
  it('highlights today', () => {
    const now = new Date()
    const { container } = render(
      <PaymentCalendar year={now.getFullYear()} month={now.getMonth()} />
    )
    expect(container.querySelector('.payment-calendar__day--today')).toBeInTheDocument()
  })

  // Indicator for payment days
  it('shows indicator on payment days', () => {
    const { container } = render(
      <PaymentCalendar year={2024} month={11} payments={mockPayments} />
    )
    const indicators = container.querySelectorAll('.payment-calendar__indicator')
    expect(indicators).toHaveLength(4) // 4 payments
  })
})
