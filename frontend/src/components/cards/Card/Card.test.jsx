import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from './Card'

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders with title', () => {
    render(<Card title="Card Title">Content</Card>)
    expect(screen.getByRole('heading', { name: 'Card Title' })).toBeInTheDocument()
  })

  it('renders header action', () => {
    render(
      <Card title="Title" headerAction={<button>Action</button>}>
        Content
      </Card>
    )
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<Card footer={<button>Save</button>}>Content</Card>)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('does not render header when no title or action', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.querySelector('.card__header')).not.toBeInTheDocument()
  })

  it('does not render footer when not provided', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.querySelector('.card__footer')).not.toBeInTheDocument()
  })

  // Variants
  it.each(['default', 'bordered', 'elevated'])('applies %s variant class', (variant) => {
    const { container } = render(<Card variant={variant}>Content</Card>)
    expect(container.querySelector(`.card--${variant}`)).toBeInTheDocument()
  })

  // Padding
  it.each(['sm', 'md', 'lg'])('applies %s padding class', (padding) => {
    const { container } = render(<Card padding={padding}>Content</Card>)
    expect(container.querySelector(`.card--padding-${padding}`)).toBeInTheDocument()
  })

  // Hoverable
  it('applies hoverable class when enabled', () => {
    const { container } = render(<Card hoverable>Content</Card>)
    expect(container.querySelector('.card--hoverable')).toBeInTheDocument()
  })

  it('does not apply hoverable class by default', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.querySelector('.card--hoverable')).not.toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>)
    expect(container.querySelector('.card')).toHaveClass('custom-card')
  })

  // Ref forwarding
  it('forwards ref to container element', () => {
    const ref = { current: null }
    render(<Card ref={ref}>Content</Card>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('ARTICLE')
  })

  // Custom element
  it('renders as custom element when as prop provided', () => {
    const ref = { current: null }
    render(
      <Card ref={ref} as="div">
        Content
      </Card>
    )
    expect(ref.current.tagName).toBe('DIV')
  })

  // Default variant
  it('uses default variant when not specified', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.querySelector('.card--default')).toBeInTheDocument()
  })

  // Default padding
  it('uses md padding when not specified', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.querySelector('.card--padding-md')).toBeInTheDocument()
  })
})
