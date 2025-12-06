import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  it('renders with title', () => {
    render(<Header title="Dashboard" />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
  })

  it('renders with subtitle', () => {
    render(<Header title="Dashboard" subtitle="Sunday, December 1, 2024" />)
    expect(screen.getByText('Sunday, December 1, 2024')).toBeInTheDocument()
  })

  it('renders without title or subtitle', () => {
    const { container } = render(<Header />)
    expect(container.querySelector('.header__title')).not.toBeInTheDocument()
    expect(container.querySelector('.header__subtitle')).not.toBeInTheDocument()
  })

  // Custom content
  it('renders custom left content', () => {
    render(<Header leftContent={<span data-testid="custom-left">Custom</span>} />)
    expect(screen.getByTestId('custom-left')).toBeInTheDocument()
  })

  it('prefers leftContent over title/subtitle', () => {
    render(
      <Header
        title="Title"
        subtitle="Subtitle"
        leftContent={<span data-testid="custom">Custom</span>}
      />
    )
    expect(screen.getByTestId('custom')).toBeInTheDocument()
    expect(screen.queryByText('Title')).not.toBeInTheDocument()
  })

  it('renders right content', () => {
    render(<Header rightContent={<button>Action</button>} />)
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('renders actions (alias for rightContent)', () => {
    render(<Header actions={<button>Save</button>} />)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('prefers rightContent over actions', () => {
    render(<Header rightContent={<button>Right</button>} actions={<button>Action</button>} />)
    expect(screen.getByRole('button', { name: 'Right' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Action' })).not.toBeInTheDocument()
  })

  it('does not render right section when no content', () => {
    const { container } = render(<Header title="Test" />)
    expect(container.querySelector('.header__right')).not.toBeInTheDocument()
  })

  // Sticky behavior
  it('applies sticky class by default', () => {
    const { container } = render(<Header />)
    expect(container.querySelector('.header--sticky')).toBeInTheDocument()
  })

  it('removes sticky class when sticky is false', () => {
    const { container } = render(<Header sticky={false} />)
    expect(container.querySelector('.header--sticky')).not.toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<Header className="custom-header" />)
    expect(container.querySelector('.header')).toHaveClass('custom-header')
  })

  // Ref forwarding
  it('forwards ref to header element', () => {
    const ref = { current: null }
    render(<Header ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('HEADER')
  })

  // Semantic structure
  it('uses semantic header element', () => {
    render(<Header title="Test" />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  // Multiple children in actions
  it('renders multiple action buttons', () => {
    render(
      <Header
        actions={
          <>
            <button>Search</button>
            <button>Notifications</button>
            <button>Add New</button>
          </>
        }
      />
    )
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add New' })).toBeInTheDocument()
  })
})
