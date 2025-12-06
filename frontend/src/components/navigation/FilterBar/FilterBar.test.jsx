import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterBar from './FilterBar'

const mockFilters = [
  { id: 'price', label: 'Price', icon: '💰', hasDropdown: true },
  { id: 'rooms', label: 'Room Type', icon: '🛏️', hasDropdown: true },
  { id: 'bath', label: 'Private Bath', icon: '🚿' },
]

describe('FilterBar', () => {
  // Basic rendering
  it('renders all filters', () => {
    render(<FilterBar filters={mockFilters} />)
    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.getByText('Room Type')).toBeInTheDocument()
    expect(screen.getByText('Private Bath')).toBeInTheDocument()
  })

  it('renders with toolbar role', () => {
    render(<FilterBar filters={mockFilters} />)
    expect(screen.getByRole('toolbar')).toBeInTheDocument()
  })

  it('has aria-label for toolbar', () => {
    render(<FilterBar filters={mockFilters} />)
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Filters')
  })

  // Active filters
  it('marks filters as active based on activeFilters prop', () => {
    const { container } = render(
      <FilterBar filters={mockFilters} activeFilters={{ price: true }} />
    )
    expect(container.querySelector('.filter-chip--active')).toHaveTextContent('Price')
  })

  it('marks filters as active based on filter.active property', () => {
    const filtersWithActive = [
      ...mockFilters.slice(0, 2),
      { id: 'bath', label: 'Private Bath', active: true },
    ]
    const { container } = render(<FilterBar filters={filtersWithActive} />)
    expect(container.querySelector('.filter-chip--active')).toHaveTextContent('Private Bath')
  })

  // Click handlers
  it('calls onFilterClick when filter is clicked', () => {
    const handleClick = vi.fn()
    render(<FilterBar filters={mockFilters} onFilterClick={handleClick} />)
    fireEvent.click(screen.getByText('Price'))
    expect(handleClick).toHaveBeenCalledWith('price')
  })

  // Removable filters
  it('does not show clear all when no filters are active', () => {
    render(<FilterBar filters={mockFilters} removable />)
    expect(screen.queryByText(/clear all/i)).not.toBeInTheDocument()
  })

  it('shows clear all when filters are active and removable', () => {
    render(
      <FilterBar filters={mockFilters} activeFilters={{ price: true, rooms: true }} removable />
    )
    expect(screen.getByText('Clear all (2)')).toBeInTheDocument()
  })

  it('calls onFilterRemove for each active filter when clear all is clicked', () => {
    const handleRemove = vi.fn()
    render(
      <FilterBar
        filters={mockFilters}
        activeFilters={{ price: true, rooms: true }}
        removable
        onFilterRemove={handleRemove}
      />
    )
    fireEvent.click(screen.getByText('Clear all (2)'))
    expect(handleRemove).toHaveBeenCalledWith('price')
    expect(handleRemove).toHaveBeenCalledWith('rooms')
    expect(handleRemove).toHaveBeenCalledTimes(2)
  })

  // Disabled filters
  it('passes disabled to filter chips', () => {
    const filtersWithDisabled = [{ id: 'price', label: 'Price', disabled: true }]
    const { container } = render(<FilterBar filters={filtersWithDisabled} />)
    expect(container.querySelector('.filter-chip--disabled')).toBeInTheDocument()
  })

  // Sticky
  it('applies sticky class when sticky prop is true', () => {
    const { container } = render(<FilterBar filters={mockFilters} sticky />)
    expect(container.querySelector('.filter-bar--sticky')).toBeInTheDocument()
  })

  it('does not apply sticky class by default', () => {
    const { container } = render(<FilterBar filters={mockFilters} />)
    expect(container.querySelector('.filter-bar--sticky')).not.toBeInTheDocument()
  })

  // Children
  it('renders children in actions section', () => {
    render(
      <FilterBar filters={mockFilters}>
        <button>More Filters</button>
      </FilterBar>
    )
    expect(screen.getByRole('button', { name: 'More Filters' })).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<FilterBar filters={mockFilters} className="custom-bar" />)
    expect(container.querySelector('.filter-bar')).toHaveClass('custom-bar')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<FilterBar ref={ref} filters={mockFilters} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('filter-bar')
  })

  // Empty filters
  it('renders empty chips container when no filters provided', () => {
    const { container } = render(<FilterBar filters={[]} />)
    const chips = container.querySelector('.filter-bar__chips')
    expect(chips.children).toHaveLength(0)
  })

  // Additional props
  it('passes additional props to container', () => {
    render(<FilterBar filters={mockFilters} data-testid="filter-bar" />)
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument()
  })

  // Filter with hasDropdown
  it('passes hasDropdown to filter chips', () => {
    render(<FilterBar filters={mockFilters} />)
    // Price and Room Type have hasDropdown: true
    const arrows = screen.getAllByText('▼')
    expect(arrows).toHaveLength(2)
  })

  // Icons
  it('passes icons to filter chips', () => {
    render(<FilterBar filters={mockFilters} />)
    expect(screen.getByText('💰')).toBeInTheDocument()
    expect(screen.getByText('🛏️')).toBeInTheDocument()
  })
})
