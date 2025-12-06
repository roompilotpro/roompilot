import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  // Basic rendering
  it('renders title', () => {
    render(<EmptyState title="No results found" />)
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('renders title as heading', () => {
    render(<EmptyState title="No results" />)
    expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument()
  })

  // Description
  it('renders description when provided', () => {
    render(<EmptyState title="No results" description="Try adjusting your filters" />)
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="No results" />)
    expect(container.querySelector('.empty-state__description')).not.toBeInTheDocument()
  })

  // Icon
  it('renders icon when provided', () => {
    render(<EmptyState title="No results" icon="🔍" />)
    expect(screen.getByText('🔍')).toBeInTheDocument()
  })

  it('does not render icon when not provided', () => {
    const { container } = render(<EmptyState title="No results" />)
    expect(container.querySelector('.empty-state__icon')).not.toBeInTheDocument()
  })

  it('marks icon as aria-hidden', () => {
    const { container } = render(<EmptyState title="No results" icon="🔍" />)
    const icon = container.querySelector('.empty-state__icon')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders custom icon element', () => {
    const { container } = render(
      <EmptyState title="No results" icon={<img src="/icon.svg" alt="" />} />
    )
    // Icon container is aria-hidden, so use querySelector
    expect(container.querySelector('img')).toBeInTheDocument()
  })

  // Action
  it('renders action when provided', () => {
    render(<EmptyState title="No results" action={<button>Add item</button>} />)
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
  })

  it('does not render action when not provided', () => {
    const { container } = render(<EmptyState title="No results" />)
    expect(container.querySelector('.empty-state__action')).not.toBeInTheDocument()
  })

  it('renders multiple action buttons', () => {
    render(
      <EmptyState
        title="No results"
        action={
          <>
            <button>Primary</button>
            <button>Secondary</button>
          </>
        }
      />
    )
    expect(screen.getByRole('button', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Secondary' })).toBeInTheDocument()
  })

  // Sizes
  it('applies md size by default', () => {
    const { container } = render(<EmptyState title="No results" />)
    expect(container.querySelector('.empty-state--md')).toBeInTheDocument()
  })

  it('applies sm size', () => {
    const { container } = render(<EmptyState title="No results" size="sm" />)
    expect(container.querySelector('.empty-state--sm')).toBeInTheDocument()
  })

  it('applies lg size', () => {
    const { container } = render(<EmptyState title="No results" size="lg" />)
    expect(container.querySelector('.empty-state--lg')).toBeInTheDocument()
  })

  // Bordered
  it('does not apply bordered class by default', () => {
    const { container } = render(<EmptyState title="No results" />)
    expect(container.querySelector('.empty-state--bordered')).not.toBeInTheDocument()
  })

  it('applies bordered class when bordered is true', () => {
    const { container } = render(<EmptyState title="No results" bordered />)
    expect(container.querySelector('.empty-state--bordered')).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<EmptyState title="No results" className="custom-empty" />)
    expect(container.querySelector('.empty-state')).toHaveClass('custom-empty')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<EmptyState ref={ref} title="No results" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('empty-state')
  })

  // Additional props
  it('passes additional props to container', () => {
    render(<EmptyState title="No results" data-testid="empty-state" />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })
})
