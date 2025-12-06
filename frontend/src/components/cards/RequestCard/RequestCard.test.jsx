import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RequestCard from './RequestCard'

describe('RequestCard', () => {
  const defaultProps = {
    id: 'req-001',
    title: 'Leaking faucet in kitchen',
    location: 'Unit 203, Sunset Apartments',
    timestamp: '2 hours ago',
  }

  it('renders title', () => {
    render(<RequestCard {...defaultProps} />)
    expect(screen.getByRole('heading', { name: 'Leaking faucet in kitchen' })).toBeInTheDocument()
  })

  it('renders location', () => {
    render(<RequestCard {...defaultProps} />)
    expect(screen.getByText('Unit 203, Sunset Apartments')).toBeInTheDocument()
  })

  it('renders timestamp', () => {
    render(<RequestCard {...defaultProps} />)
    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
  })

  // Category icons
  it('renders plumbing icon for plumbing category', () => {
    const { container } = render(<RequestCard {...defaultProps} category="plumbing" />)
    expect(container.querySelector('.request-card__icon--plumbing')).toBeInTheDocument()
  })

  it('renders electrical icon for electrical category', () => {
    const { container } = render(<RequestCard {...defaultProps} category="electrical" />)
    expect(container.querySelector('.request-card__icon--electrical')).toBeInTheDocument()
  })

  it('renders hvac icon for hvac category', () => {
    const { container } = render(<RequestCard {...defaultProps} category="hvac" />)
    expect(container.querySelector('.request-card__icon--hvac')).toBeInTheDocument()
  })

  it('renders appliance icon for appliance category', () => {
    const { container } = render(<RequestCard {...defaultProps} category="appliance" />)
    expect(container.querySelector('.request-card__icon--appliance')).toBeInTheDocument()
  })

  it('renders general icon by default', () => {
    const { container } = render(<RequestCard {...defaultProps} />)
    expect(container.querySelector('.request-card__icon--general')).toBeInTheDocument()
  })

  // Priority
  it('renders normal priority by default', () => {
    render(<RequestCard {...defaultProps} />)
    expect(screen.getByText('Normal')).toBeInTheDocument()
  })

  it('renders urgent priority', () => {
    render(<RequestCard {...defaultProps} priority="urgent" />)
    expect(screen.getByText('Urgent')).toBeInTheDocument()
  })

  it('renders low priority', () => {
    render(<RequestCard {...defaultProps} priority="low" />)
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  // Status
  it('applies new status class by default', () => {
    const { container } = render(<RequestCard {...defaultProps} />)
    expect(container.querySelector('.request-card--new')).toBeInTheDocument()
  })

  it('applies in-progress status class', () => {
    const { container } = render(<RequestCard {...defaultProps} status="in-progress" />)
    expect(container.querySelector('.request-card--in-progress')).toBeInTheDocument()
  })

  it('applies resolved status class', () => {
    const { container } = render(<RequestCard {...defaultProps} status="resolved" />)
    expect(container.querySelector('.request-card--resolved')).toBeInTheDocument()
  })

  it('applies closed status class', () => {
    const { container } = render(<RequestCard {...defaultProps} status="closed" />)
    expect(container.querySelector('.request-card--closed')).toBeInTheDocument()
  })

  // Tenant
  it('renders tenant when provided', () => {
    render(<RequestCard {...defaultProps} tenant="John Smith" />)
    expect(screen.getByText('John Smith')).toBeInTheDocument()
  })

  // Description and expand
  it('does not show description when not expanded', () => {
    render(<RequestCard {...defaultProps} description="The kitchen faucet is dripping." />)
    expect(screen.queryByText('The kitchen faucet is dripping.')).not.toBeInTheDocument()
  })

  it('shows description when expanded', () => {
    render(<RequestCard {...defaultProps} description="The kitchen faucet is dripping." expanded />)
    expect(screen.getByText('The kitchen faucet is dripping.')).toBeInTheDocument()
  })

  it('renders expand toggle when description and onExpandToggle provided', () => {
    render(<RequestCard {...defaultProps} description="Test" onExpandToggle={() => {}} />)
    expect(screen.getByRole('button', { name: 'Expand details' })).toBeInTheDocument()
  })

  it('shows collapse label when expanded', () => {
    render(<RequestCard {...defaultProps} description="Test" expanded onExpandToggle={() => {}} />)
    expect(screen.getByRole('button', { name: 'Collapse details' })).toBeInTheDocument()
  })

  it('calls onExpandToggle when toggle clicked', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()
    render(<RequestCard {...defaultProps} description="Test" onExpandToggle={handleToggle} />)

    await user.click(screen.getByRole('button', { name: 'Expand details' }))
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  it('applies expanded class when expanded', () => {
    const { container } = render(<RequestCard {...defaultProps} expanded />)
    expect(container.querySelector('.request-card--expanded')).toBeInTheDocument()
  })

  // Draggable
  it('renders drag handle when draggable', () => {
    const { container } = render(<RequestCard {...defaultProps} draggable />)
    expect(container.querySelector('.request-card__drag-handle')).toBeInTheDocument()
  })

  it('does not render drag handle when not draggable', () => {
    const { container } = render(<RequestCard {...defaultProps} />)
    expect(container.querySelector('.request-card__drag-handle')).not.toBeInTheDocument()
  })

  it('applies draggable class when draggable', () => {
    const { container } = render(<RequestCard {...defaultProps} draggable />)
    expect(container.querySelector('.request-card--draggable')).toBeInTheDocument()
  })

  it('sets draggable attribute when draggable', () => {
    render(<RequestCard {...defaultProps} draggable />)
    expect(screen.getByRole('article')).toHaveAttribute('draggable', 'true')
  })

  // Click
  it('calls onClick when card clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<RequestCard {...defaultProps} onClick={handleClick} />)

    await user.click(screen.getByRole('article'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not propagate click from toggle button', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    const handleToggle = vi.fn()
    render(
      <RequestCard
        {...defaultProps}
        description="Test"
        onClick={handleClick}
        onExpandToggle={handleToggle}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Expand details' }))
    expect(handleToggle).toHaveBeenCalledTimes(1)
    expect(handleClick).not.toHaveBeenCalled()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<RequestCard {...defaultProps} className="custom-request" />)
    expect(container.querySelector('.request-card')).toHaveClass('custom-request')
  })

  // Ref forwarding
  it('forwards ref to article element', () => {
    const ref = { current: null }
    render(<RequestCard ref={ref} {...defaultProps} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('ARTICLE')
  })
})
