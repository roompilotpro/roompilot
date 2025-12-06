import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ViewToggle from './ViewToggle'

const mockViews = [
  { id: 'grid', label: 'Grid' },
  { id: 'list', label: 'List' },
]

describe('ViewToggle', () => {
  // Basic rendering
  it('renders all view options', () => {
    render(<ViewToggle views={mockViews} activeView="grid" />)
    expect(screen.getByText('Grid')).toBeInTheDocument()
    expect(screen.getByText('List')).toBeInTheDocument()
  })

  it('renders with group role', () => {
    render(<ViewToggle views={mockViews} activeView="grid" />)
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('renders buttons for each view', () => {
    render(<ViewToggle views={mockViews} activeView="grid" />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  // Active state
  it('applies active class to active view', () => {
    const { container } = render(<ViewToggle views={mockViews} activeView="list" />)
    const activeBtn = container.querySelector('.view-toggle__btn--active')
    expect(activeBtn).toHaveTextContent('List')
  })

  it('sets aria-pressed on active view', () => {
    render(<ViewToggle views={mockViews} activeView="grid" />)
    expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('sets aria-pressed false on inactive view', () => {
    render(<ViewToggle views={mockViews} activeView="grid" />)
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'false')
  })

  // Click handler
  it('calls onChange when view is clicked', () => {
    const handleChange = vi.fn()
    render(<ViewToggle views={mockViews} activeView="grid" onChange={handleChange} />)
    fireEvent.click(screen.getByText('List'))
    expect(handleChange).toHaveBeenCalledWith('list')
  })

  it('calls onChange when active view is clicked', () => {
    const handleChange = vi.fn()
    render(<ViewToggle views={mockViews} activeView="grid" onChange={handleChange} />)
    fireEvent.click(screen.getByText('Grid'))
    expect(handleChange).toHaveBeenCalledWith('grid')
  })

  // Icons
  it('renders view with icon', () => {
    const viewsWithIcons = [
      { id: 'grid', label: 'Grid', icon: '▦' },
      { id: 'list', label: 'List', icon: '☰' },
    ]
    render(<ViewToggle views={viewsWithIcons} activeView="grid" />)
    expect(screen.getByText('▦')).toBeInTheDocument()
    expect(screen.getByText('☰')).toBeInTheDocument()
  })

  it('marks icon as aria-hidden', () => {
    const viewsWithIcons = [{ id: 'grid', label: 'Grid', icon: '▦' }]
    const { container } = render(<ViewToggle views={viewsWithIcons} activeView="grid" />)
    const icon = container.querySelector('.view-toggle__icon')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders icon-only views', () => {
    const iconOnlyViews = [
      { id: 'grid', icon: '▦' },
      { id: 'list', icon: '☰' },
    ]
    render(<ViewToggle views={iconOnlyViews} activeView="grid" />)
    expect(screen.getByText('▦')).toBeInTheDocument()
    expect(screen.getByText('☰')).toBeInTheDocument()
  })

  // Sizes
  it('applies md size by default', () => {
    const { container } = render(<ViewToggle views={mockViews} activeView="grid" />)
    expect(container.querySelector('.view-toggle--md')).toBeInTheDocument()
  })

  it('applies sm size', () => {
    const { container } = render(<ViewToggle views={mockViews} activeView="grid" size="sm" />)
    expect(container.querySelector('.view-toggle--sm')).toBeInTheDocument()
  })

  it('applies lg size', () => {
    const { container } = render(<ViewToggle views={mockViews} activeView="grid" size="lg" />)
    expect(container.querySelector('.view-toggle--lg')).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(
      <ViewToggle views={mockViews} activeView="grid" className="custom-toggle" />
    )
    expect(container.querySelector('.view-toggle')).toHaveClass('custom-toggle')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<ViewToggle ref={ref} views={mockViews} activeView="grid" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('view-toggle')
  })

  // Accessibility
  it('has aria-label for group', () => {
    render(<ViewToggle views={mockViews} activeView="grid" />)
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'View options')
  })

  // Preset views
  it('has gridListViews preset', () => {
    expect(ViewToggle.gridListViews).toEqual([
      { id: 'grid', label: 'Grid', icon: '▦' },
      { id: 'list', label: 'List', icon: '☰' },
    ])
  })

  // Empty views
  it('renders empty when no views provided', () => {
    const { container } = render(<ViewToggle views={[]} activeView="" />)
    const toggle = container.querySelector('.view-toggle')
    expect(toggle.children).toHaveLength(0)
  })

  // Additional props
  it('passes additional props to container', () => {
    render(<ViewToggle views={mockViews} activeView="grid" data-testid="view-toggle" />)
    expect(screen.getByTestId('view-toggle')).toBeInTheDocument()
  })
})
