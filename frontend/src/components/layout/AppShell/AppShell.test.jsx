import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AppShell from './AppShell'

describe('AppShell', () => {
  const defaultSidebar = {
    logo: 'R',
    logoText: 'RoomPilot',
    links: [
      { label: 'Dashboard', href: '/dashboard', active: true },
      { label: 'Properties', href: '/properties' },
    ],
  }

  const defaultHeader = {
    title: 'Dashboard',
    subtitle: 'Welcome back',
  }

  it('renders children content', () => {
    render(<AppShell>Main Content</AppShell>)
    expect(screen.getByText('Main Content')).toBeInTheDocument()
  })

  it('renders sidebar when provided', () => {
    render(<AppShell sidebar={defaultSidebar}>Content</AppShell>)
    expect(screen.getByText('RoomPilot')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders header when provided', () => {
    render(<AppShell header={defaultHeader}>Content</AppShell>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
  })

  it('renders both sidebar and header', () => {
    render(
      <AppShell sidebar={defaultSidebar} header={defaultHeader}>
        Content
      </AppShell>
    )
    expect(screen.getByText('RoomPilot')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard')
  })

  it('does not render sidebar when not provided', () => {
    const { container } = render(<AppShell header={defaultHeader}>Content</AppShell>)
    expect(container.querySelector('.sidebar')).not.toBeInTheDocument()
  })

  it('does not render header when not provided', () => {
    render(<AppShell sidebar={defaultSidebar}>Content</AppShell>)
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  // Menu toggle (button is hidden on desktop, so we use getByLabelText)
  it('renders menu button when sidebar is present', () => {
    const { container } = render(
      <AppShell sidebar={defaultSidebar} header={defaultHeader}>
        Content
      </AppShell>
    )
    expect(container.querySelector('.app-shell__menu-btn')).toBeInTheDocument()
  })

  it('does not render menu button when no sidebar', () => {
    const { container } = render(<AppShell header={defaultHeader}>Content</AppShell>)
    expect(container.querySelector('.app-shell__menu-btn')).not.toBeInTheDocument()
  })

  it('toggles sidebar on menu button click', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()

    const { container } = render(
      <AppShell
        sidebar={defaultSidebar}
        header={defaultHeader}
        sidebarCollapsed={true}
        onSidebarToggle={handleToggle}
      >
        Content
      </AppShell>
    )

    await user.click(container.querySelector('.app-shell__menu-btn'))
    expect(handleToggle).toHaveBeenCalledWith(false)
  })

  it('updates aria-expanded on toggle', async () => {
    const { container, rerender } = render(
      <AppShell sidebar={defaultSidebar} header={defaultHeader} sidebarCollapsed={true}>
        Content
      </AppShell>
    )

    expect(container.querySelector('.app-shell__menu-btn')).toHaveAttribute(
      'aria-expanded',
      'false'
    )

    rerender(
      <AppShell sidebar={defaultSidebar} header={defaultHeader} sidebarCollapsed={false}>
        Content
      </AppShell>
    )

    expect(container.querySelector('.app-shell__menu-btn')).toHaveAttribute('aria-expanded', 'true')
  })

  // Uncontrolled mode
  it('works in uncontrolled mode', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <AppShell sidebar={defaultSidebar} header={defaultHeader}>
        Content
      </AppShell>
    )

    const menuBtn = container.querySelector('.app-shell__menu-btn')

    // Initially collapsed
    expect(container.querySelector('.sidebar--collapsed')).toBeInTheDocument()

    // Click to open
    await user.click(menuBtn)
    expect(container.querySelector('.sidebar--collapsed')).not.toBeInTheDocument()

    // Click to close
    await user.click(menuBtn)
    expect(container.querySelector('.sidebar--collapsed')).toBeInTheDocument()
  })

  // Main content offset
  it('applies sidebar offset class when sidebar present', () => {
    const { container } = render(<AppShell sidebar={defaultSidebar}>Content</AppShell>)
    expect(container.querySelector('.app-shell__main--with-sidebar')).toBeInTheDocument()
  })

  it('does not apply sidebar offset when no sidebar', () => {
    const { container } = render(<AppShell>Content</AppShell>)
    expect(container.querySelector('.app-shell__main--with-sidebar')).not.toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<AppShell className="custom-shell">Content</AppShell>)
    expect(container.querySelector('.app-shell')).toHaveClass('custom-shell')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<AppShell ref={ref}>Content</AppShell>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('app-shell')
  })

  // Header actions pass through
  it('passes header actions through', () => {
    render(
      <AppShell
        header={{
          title: 'Page',
          actions: <button>Save</button>,
        }}
      >
        Content
      </AppShell>
    )
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})
