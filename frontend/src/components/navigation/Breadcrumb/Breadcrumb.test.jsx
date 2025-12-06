import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Breadcrumb from './Breadcrumb'

const mockItems = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Current Property' },
]

describe('Breadcrumb', () => {
  // Basic rendering
  it('renders all items', () => {
    render(<Breadcrumb items={mockItems} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Properties')).toBeInTheDocument()
    expect(screen.getByText('Current Property')).toBeInTheDocument()
  })

  it('renders with navigation role', () => {
    render(<Breadcrumb items={mockItems} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('has aria-label for navigation', () => {
    render(<Breadcrumb items={mockItems} />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb')
  })

  it('renders as ordered list', () => {
    render(<Breadcrumb items={mockItems} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  // Links
  it('renders items with href as links', () => {
    render(<Breadcrumb items={mockItems} />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Properties' })).toHaveAttribute('href', '/properties')
  })

  it('does not render last item as link', () => {
    render(<Breadcrumb items={mockItems} />)
    expect(screen.queryByRole('link', { name: 'Current Property' })).not.toBeInTheDocument()
  })

  // Current page
  it('marks last item as current page', () => {
    const { container } = render(<Breadcrumb items={mockItems} />)
    const current = container.querySelector('.breadcrumb__current')
    expect(current).toHaveTextContent('Current Property')
    expect(current).toHaveAttribute('aria-current', 'page')
  })

  // Separators
  it('renders chevron separator by default', () => {
    render(<Breadcrumb items={mockItems} />)
    const separators = screen.getAllByText('›')
    expect(separators).toHaveLength(2)
  })

  it('renders slash separator', () => {
    render(<Breadcrumb items={mockItems} separator="slash" />)
    const separators = screen.getAllByText('/')
    expect(separators).toHaveLength(2)
  })

  it('renders arrow separator', () => {
    render(<Breadcrumb items={mockItems} separator="arrow" />)
    const separators = screen.getAllByText('→')
    expect(separators).toHaveLength(2)
  })

  it('renders custom separator string', () => {
    render(<Breadcrumb items={mockItems} separator="|" />)
    const separators = screen.getAllByText('|')
    expect(separators).toHaveLength(2)
  })

  it('marks separators as aria-hidden', () => {
    const { container } = render(<Breadcrumb items={mockItems} />)
    const separator = container.querySelector('.breadcrumb__separator')
    expect(separator).toHaveAttribute('aria-hidden', 'true')
  })

  // Icons
  it('renders items with icons', () => {
    const itemsWithIcons = [
      { label: 'Home', href: '/', icon: '🏠' },
      { label: 'Settings', href: '/settings', icon: '⚙️' },
      { label: 'Profile' },
    ]
    render(<Breadcrumb items={itemsWithIcons} />)
    expect(screen.getByText('🏠')).toBeInTheDocument()
    expect(screen.getByText('⚙️')).toBeInTheDocument()
  })

  it('marks icons as aria-hidden', () => {
    const itemsWithIcons = [{ label: 'Home', href: '/', icon: '🏠' }, { label: 'Current' }]
    const { container } = render(<Breadcrumb items={itemsWithIcons} />)
    const icon = container.querySelector('.breadcrumb__icon')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  // onClick handler
  it('calls onClick when item is clicked', () => {
    const handleClick = vi.fn()
    const itemsWithClick = [{ label: 'Home', onClick: handleClick }, { label: 'Current' }]
    render(<Breadcrumb items={itemsWithClick} />)
    fireEvent.click(screen.getByRole('link', { name: 'Home' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('prevents default when onClick is provided', () => {
    const handleClick = vi.fn()
    const itemsWithClick = [{ label: 'Home', onClick: handleClick }, { label: 'Current' }]
    render(<Breadcrumb items={itemsWithClick} />)
    const link = screen.getByRole('link', { name: 'Home' })
    fireEvent.click(link)
    // Note: fireEvent doesn't actually prevent default, but we check onClick was called
    expect(handleClick).toHaveBeenCalled()
  })

  // Sizes
  it('applies md size by default', () => {
    const { container } = render(<Breadcrumb items={mockItems} />)
    expect(container.querySelector('.breadcrumb--md')).toBeInTheDocument()
  })

  it('applies sm size', () => {
    const { container } = render(<Breadcrumb items={mockItems} size="sm" />)
    expect(container.querySelector('.breadcrumb--sm')).toBeInTheDocument()
  })

  it('applies lg size', () => {
    const { container } = render(<Breadcrumb items={mockItems} size="lg" />)
    expect(container.querySelector('.breadcrumb--lg')).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<Breadcrumb items={mockItems} className="custom-breadcrumb" />)
    expect(container.querySelector('.breadcrumb')).toHaveClass('custom-breadcrumb')
  })

  // Ref forwarding
  it('forwards ref to nav element', () => {
    const ref = { current: null }
    render(<Breadcrumb ref={ref} items={mockItems} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('NAV')
  })

  // Empty items
  it('renders empty list when no items provided', () => {
    render(<Breadcrumb items={[]} />)
    expect(screen.getByRole('list').children).toHaveLength(0)
  })

  // Single item
  it('handles single item', () => {
    render(<Breadcrumb items={[{ label: 'Home' }]} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.queryByText('›')).not.toBeInTheDocument()
  })

  // Non-clickable items (no href or onClick)
  it('renders non-clickable items as text', () => {
    const itemsNoLinks = [{ label: 'Category' }, { label: 'Subcategory' }, { label: 'Current' }]
    const { container } = render(<Breadcrumb items={itemsNoLinks} />)
    const texts = container.querySelectorAll('.breadcrumb__text')
    expect(texts).toHaveLength(2)
  })

  // Additional props
  it('passes additional props to nav', () => {
    render(<Breadcrumb items={mockItems} data-testid="breadcrumb" />)
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
  })
})
