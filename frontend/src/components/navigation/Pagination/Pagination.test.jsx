import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './Pagination'

describe('Pagination', () => {
  // Basic rendering
  it('renders page buttons', () => {
    render(<Pagination currentPage={1} totalPages={5} />)
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 5' })).toBeInTheDocument()
  })

  it('renders with navigation role', () => {
    render(<Pagination currentPage={1} totalPages={5} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('has aria-label for navigation', () => {
    render(<Pagination currentPage={1} totalPages={5} />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Pagination')
  })

  // Returns null for single page
  it('returns null when totalPages is 1', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when totalPages is 0', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={0} />)
    expect(container.firstChild).toBeNull()
  })

  // Active page
  it('marks current page as active', () => {
    const { container } = render(<Pagination currentPage={3} totalPages={5} />)
    const activeBtn = container.querySelector('.pagination__btn--active')
    expect(activeBtn).toHaveTextContent('3')
  })

  it('sets aria-current on active page', () => {
    render(<Pagination currentPage={2} totalPages={5} />)
    expect(screen.getByRole('button', { name: 'Go to page 2' })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  // Click handlers
  it('calls onPageChange when page button is clicked', () => {
    const handleChange = vi.fn()
    render(<Pagination currentPage={1} totalPages={5} onPageChange={handleChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 3' }))
    expect(handleChange).toHaveBeenCalledWith(3)
  })

  it('does not call onPageChange when current page is clicked', () => {
    const handleChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handleChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 3' }))
    expect(handleChange).not.toHaveBeenCalled()
  })

  // Prev/Next buttons
  it('renders prev/next buttons by default', () => {
    render(<Pagination currentPage={3} totalPages={5} />)
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument()
  })

  it('calls onPageChange with previous page when prev is clicked', () => {
    const handleChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handleChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Go to previous page' }))
    expect(handleChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with next page when next is clicked', () => {
    const handleChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handleChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }))
    expect(handleChange).toHaveBeenCalledWith(4)
  })

  it('disables prev button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} />)
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} />)
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled()
  })

  it('hides prev/next buttons when showPrevNext is false', () => {
    render(<Pagination currentPage={3} totalPages={5} showPrevNext={false} />)
    expect(screen.queryByRole('button', { name: 'Go to previous page' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Go to next page' })).not.toBeInTheDocument()
  })

  // First/Last buttons
  it('renders first/last buttons by default', () => {
    render(<Pagination currentPage={3} totalPages={5} />)
    expect(screen.getByRole('button', { name: 'Go to first page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to last page' })).toBeInTheDocument()
  })

  it('calls onPageChange with 1 when first is clicked', () => {
    const handleChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handleChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Go to first page' }))
    expect(handleChange).toHaveBeenCalledWith(1)
  })

  it('calls onPageChange with totalPages when last is clicked', () => {
    const handleChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handleChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Go to last page' }))
    expect(handleChange).toHaveBeenCalledWith(5)
  })

  it('disables first button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} />)
    expect(screen.getByRole('button', { name: 'Go to first page' })).toBeDisabled()
  })

  it('disables last button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} />)
    expect(screen.getByRole('button', { name: 'Go to last page' })).toBeDisabled()
  })

  it('hides first/last buttons when showFirstLast is false', () => {
    render(<Pagination currentPage={3} totalPages={5} showFirstLast={false} />)
    expect(screen.queryByRole('button', { name: 'Go to first page' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Go to last page' })).not.toBeInTheDocument()
  })

  // Ellipsis
  it('shows ellipsis for many pages', () => {
    render(<Pagination currentPage={5} totalPages={10} />)
    const ellipses = screen.getAllByText('…')
    expect(ellipses.length).toBeGreaterThanOrEqual(1)
  })

  it('marks ellipsis as aria-hidden', () => {
    const { container } = render(<Pagination currentPage={5} totalPages={10} />)
    const ellipsis = container.querySelector('.pagination__ellipsis')
    expect(ellipsis).toHaveAttribute('aria-hidden', 'true')
  })

  // Sibling count
  it('shows correct number of siblings', () => {
    render(<Pagination currentPage={5} totalPages={10} siblingCount={2} />)
    // With siblingCount=2 and current=5, should show 3, 4, 5, 6, 7
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 7' })).toBeInTheDocument()
  })

  // Sizes
  it('applies md size by default', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={5} />)
    expect(container.querySelector('.pagination--md')).toBeInTheDocument()
  })

  it('applies sm size', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={5} size="sm" />)
    expect(container.querySelector('.pagination--sm')).toBeInTheDocument()
  })

  it('applies lg size', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={5} size="lg" />)
    expect(container.querySelector('.pagination--lg')).toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={5} className="custom-pagination" />
    )
    expect(container.querySelector('.pagination')).toHaveClass('custom-pagination')
  })

  // Ref forwarding
  it('forwards ref to nav element', () => {
    const ref = { current: null }
    render(<Pagination ref={ref} currentPage={1} totalPages={5} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('NAV')
  })

  // Edge cases
  it('handles all pages visible (small total)', () => {
    render(<Pagination currentPage={2} totalPages={3} />)
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument()
  })

  it('handles current page near start', () => {
    render(<Pagination currentPage={2} totalPages={10} />)
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument()
  })

  it('handles current page near end', () => {
    render(<Pagination currentPage={9} totalPages={10} />)
    expect(screen.getByRole('button', { name: 'Go to page 8' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 9' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 10' })).toBeInTheDocument()
  })
})
