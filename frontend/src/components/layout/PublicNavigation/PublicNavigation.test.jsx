import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PublicNavigation from './PublicNavigation'

describe('PublicNavigation', () => {
  const defaultLinks = [
    { label: 'Find a Room', href: '/search' },
    { label: 'List Your Property', href: '/list' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
  ]

  it('renders with default logo', () => {
    render(<PublicNavigation />)
    expect(screen.getByText('R')).toBeInTheDocument()
    expect(screen.getByText('RoomPilot')).toBeInTheDocument()
  })

  it('renders custom logo and text', () => {
    render(<PublicNavigation logo="X" logoText="MyApp" />)
    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByText('MyApp')).toBeInTheDocument()
  })

  it('renders logo link with correct href', () => {
    render(<PublicNavigation logoHref="/home" />)
    expect(screen.getByRole('link', { name: /RoomPilot/i })).toHaveAttribute('href', '/home')
  })

  // Links
  it('renders navigation links', () => {
    render(<PublicNavigation links={defaultLinks} />)
    expect(screen.getByText('Find a Room')).toBeInTheDocument()
    expect(screen.getByText('List Your Property')).toBeInTheDocument()
    expect(screen.getByText('How It Works')).toBeInTheDocument()
  })

  it('links have correct href', () => {
    render(<PublicNavigation links={defaultLinks} />)
    expect(screen.getByRole('link', { name: 'Find a Room' })).toHaveAttribute('href', '/search')
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing')
  })

  it('does not render links section when empty', () => {
    const { container } = render(<PublicNavigation links={[]} />)
    expect(container.querySelector('.public-nav__links')).not.toBeInTheDocument()
  })

  // Actions
  it('renders actions', () => {
    render(
      <PublicNavigation
        actions={
          <>
            <button>Log In</button>
            <button>Get Started</button>
          </>
        }
      />
    )
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument()
  })

  it('does not render actions section when not provided', () => {
    const { container } = render(<PublicNavigation />)
    expect(container.querySelector('.public-nav__actions')).not.toBeInTheDocument()
  })

  // Variants
  it('applies default variant class', () => {
    const { container } = render(<PublicNavigation />)
    expect(container.querySelector('.public-nav--default')).toBeInTheDocument()
  })

  it('applies transparent variant class', () => {
    const { container } = render(<PublicNavigation variant="transparent" />)
    expect(container.querySelector('.public-nav--transparent')).toBeInTheDocument()
  })

  // Mobile menu
  it('renders mobile menu button', () => {
    const { container } = render(<PublicNavigation />)
    expect(container.querySelector('.public-nav__mobile-btn')).toBeInTheDocument()
  })

  it('toggles mobile menu on button click', async () => {
    const user = userEvent.setup()
    const { container } = render(<PublicNavigation links={defaultLinks} />)

    const menuBtn = container.querySelector('.public-nav__mobile-btn')

    // Initially closed
    expect(container.querySelector('.public-nav__mobile-menu')).not.toBeInTheDocument()

    // Open
    await user.click(menuBtn)
    expect(container.querySelector('.public-nav__mobile-menu')).toBeInTheDocument()

    // Close
    await user.click(menuBtn)
    expect(container.querySelector('.public-nav__mobile-menu')).not.toBeInTheDocument()
  })

  it('mobile menu contains links', async () => {
    const user = userEvent.setup()
    const { container } = render(<PublicNavigation links={defaultLinks} />)

    await user.click(container.querySelector('.public-nav__mobile-btn'))

    const mobileMenu = container.querySelector('.public-nav__mobile-menu')
    expect(mobileMenu).toContainElement(screen.getAllByText('Find a Room')[1]) // Second occurrence is in mobile
  })

  it('mobile menu contains actions', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <PublicNavigation links={defaultLinks} actions={<button>Sign Up</button>} />
    )

    await user.click(container.querySelector('.public-nav__mobile-btn'))
    // Mobile actions section exists and contains the action
    const mobileActions = container.querySelector('.public-nav__mobile-actions')
    expect(mobileActions).toBeInTheDocument()
    expect(mobileActions.querySelector('button')).toHaveTextContent('Sign Up')
  })

  it('updates aria-expanded on menu toggle', async () => {
    const user = userEvent.setup()
    const { container } = render(<PublicNavigation links={defaultLinks} />)

    const menuBtn = container.querySelector('.public-nav__mobile-btn')
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false')

    await user.click(menuBtn)
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true')

    await user.click(menuBtn)
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false')
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<PublicNavigation className="custom-nav" />)
    expect(container.querySelector('.public-nav')).toHaveClass('custom-nav')
  })

  // Ref forwarding
  it('forwards ref to nav element', () => {
    const ref = { current: null }
    render(<PublicNavigation ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('NAV')
  })

  // Semantic structure
  it('uses semantic nav element', () => {
    render(<PublicNavigation />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
