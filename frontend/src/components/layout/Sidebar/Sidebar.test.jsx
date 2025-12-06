import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sidebar from './Sidebar'

describe('Sidebar', () => {
  const defaultLinks = [
    { icon: '📊', label: 'Dashboard', href: '/dashboard', active: true },
    { icon: '🏠', label: 'Properties', href: '/properties', badge: 3 },
    { icon: '👥', label: 'Tenants', href: '/tenants' },
  ]

  const defaultUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://example.com/avatar.jpg',
  }

  it('renders logo with default text', () => {
    render(<Sidebar />)
    expect(screen.getByText('RoomPilot')).toBeInTheDocument()
    expect(screen.getByText('R')).toBeInTheDocument()
  })

  it('renders custom logo text', () => {
    render(<Sidebar logo="X" logoText="MyApp" />)
    expect(screen.getByText('MyApp')).toBeInTheDocument()
    expect(screen.getByText('X')).toBeInTheDocument()
  })

  it('renders logo badge when provided', () => {
    render(<Sidebar logoBadge="Host" />)
    expect(screen.getByText('Host')).toBeInTheDocument()
  })

  // Navigation links
  it('renders navigation links', () => {
    render(<Sidebar links={defaultLinks} />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Properties')).toBeInTheDocument()
    expect(screen.getByText('Tenants')).toBeInTheDocument()
  })

  it('renders link icons', () => {
    render(<Sidebar links={defaultLinks} />)
    expect(screen.getByText('📊')).toBeInTheDocument()
    expect(screen.getByText('🏠')).toBeInTheDocument()
  })

  it('applies active class to active link', () => {
    render(<Sidebar links={defaultLinks} />)
    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i })
    expect(dashboardLink).toHaveClass('sidebar__link--active')
    expect(dashboardLink).toHaveAttribute('aria-current', 'page')
  })

  it('renders link badges', () => {
    render(<Sidebar links={defaultLinks} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('links have correct href', () => {
    render(<Sidebar links={defaultLinks} />)
    expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: /Properties/i })).toHaveAttribute('href', '/properties')
  })

  // User profile
  it('renders user profile when provided', () => {
    render(<Sidebar user={defaultUser} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('renders user avatar image', () => {
    render(<Sidebar user={defaultUser} />)
    expect(screen.getByRole('img', { name: 'John Doe' })).toHaveAttribute(
      'src',
      'https://example.com/avatar.jpg'
    )
  })

  it('does not render user section when user not provided', () => {
    const { container } = render(<Sidebar />)
    expect(container.querySelector('.sidebar__user')).not.toBeInTheDocument()
  })

  // Collapsed state
  it('applies collapsed class when collapsed', () => {
    const { container } = render(<Sidebar collapsed />)
    expect(container.querySelector('.sidebar--collapsed')).toBeInTheDocument()
  })

  it('does not apply collapsed class by default', () => {
    const { container } = render(<Sidebar />)
    expect(container.querySelector('.sidebar--collapsed')).not.toBeInTheDocument()
  })

  // Overlay
  it('renders overlay when not collapsed', () => {
    const { container } = render(<Sidebar collapsed={false} />)
    expect(container.querySelector('.sidebar__overlay')).toBeInTheDocument()
  })

  it('does not render overlay when collapsed', () => {
    const { container } = render(<Sidebar collapsed={true} />)
    expect(container.querySelector('.sidebar__overlay')).not.toBeInTheDocument()
  })

  it('calls onClose when overlay clicked', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    const { container } = render(<Sidebar collapsed={false} onClose={handleClose} />)

    await user.click(container.querySelector('.sidebar__overlay'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<Sidebar className="custom-sidebar" />)
    expect(container.querySelector('.sidebar')).toHaveClass('custom-sidebar')
  })

  // Ref forwarding
  it('forwards ref to aside element', () => {
    const ref = { current: null }
    render(<Sidebar ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('ASIDE')
  })

  // Empty links
  it('renders empty nav when no links provided', () => {
    const { container } = render(<Sidebar links={[]} />)
    const nav = container.querySelector('.sidebar__nav')
    expect(nav).toBeInTheDocument()
    expect(nav.children).toHaveLength(0)
  })

  // Badge variants
  it('applies custom badge variant', () => {
    const linksWithVariant = [
      { label: 'Alerts', href: '/alerts', badge: 5, badgeVariant: 'warning' },
    ]
    const { container } = render(<Sidebar links={linksWithVariant} />)
    expect(container.querySelector('.badge--warning')).toBeInTheDocument()
  })
})
