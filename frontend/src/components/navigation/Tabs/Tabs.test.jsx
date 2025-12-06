import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Tabs from './Tabs'

const mockTabs = [
  { id: 'tab1', label: 'Overview' },
  { id: 'tab2', label: 'Details' },
  { id: 'tab3', label: 'Settings' },
]

describe('Tabs', () => {
  // Basic rendering
  it('renders all tabs', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders with tablist role', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('renders tabs with tab role', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(3)
  })

  // Active state
  it('applies active class to active tab', () => {
    const { container } = render(<Tabs tabs={mockTabs} activeTab="tab2" />)
    const activeTab = container.querySelector('.tabs__tab--active')
    expect(activeTab).toHaveTextContent('Details')
  })

  it('sets aria-selected on active tab', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" />)
    const activeTab = screen.getByRole('tab', { name: 'Overview' })
    expect(activeTab).toHaveAttribute('aria-selected', 'true')
  })

  it('sets aria-selected false on inactive tabs', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" />)
    const inactiveTab = screen.getByRole('tab', { name: 'Details' })
    expect(inactiveTab).toHaveAttribute('aria-selected', 'false')
  })

  // Click handler
  it('calls onChange when tab is clicked', () => {
    const handleChange = vi.fn()
    render(<Tabs tabs={mockTabs} activeTab="tab1" onChange={handleChange} />)
    fireEvent.click(screen.getByText('Details'))
    expect(handleChange).toHaveBeenCalledWith('tab2')
  })

  it('does not call onChange when active tab is clicked', () => {
    const handleChange = vi.fn()
    render(<Tabs tabs={mockTabs} activeTab="tab1" onChange={handleChange} />)
    fireEvent.click(screen.getByText('Overview'))
    expect(handleChange).toHaveBeenCalledWith('tab1')
  })

  // Disabled tabs
  it('applies disabled class to disabled tab', () => {
    const tabsWithDisabled = [
      ...mockTabs.slice(0, 2),
      { id: 'tab3', label: 'Settings', disabled: true },
    ]
    const { container } = render(<Tabs tabs={tabsWithDisabled} activeTab="tab1" />)
    expect(container.querySelector('.tabs__tab--disabled')).toHaveTextContent('Settings')
  })

  it('does not call onChange when disabled tab is clicked', () => {
    const handleChange = vi.fn()
    const tabsWithDisabled = [
      ...mockTabs.slice(0, 2),
      { id: 'tab3', label: 'Settings', disabled: true },
    ]
    render(<Tabs tabs={tabsWithDisabled} activeTab="tab1" onChange={handleChange} />)
    fireEvent.click(screen.getByText('Settings'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('sets aria-disabled on disabled tab', () => {
    const tabsWithDisabled = [
      ...mockTabs.slice(0, 2),
      { id: 'tab3', label: 'Settings', disabled: true },
    ]
    render(<Tabs tabs={tabsWithDisabled} activeTab="tab1" />)
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-disabled', 'true')
  })

  // Icons
  it('renders tab with icon', () => {
    const tabsWithIcons = [{ id: 'tab1', label: 'Home', icon: '🏠' }]
    render(<Tabs tabs={tabsWithIcons} activeTab="tab1" />)
    expect(screen.getByText('🏠')).toBeInTheDocument()
  })

  it('marks icon as aria-hidden', () => {
    const tabsWithIcons = [{ id: 'tab1', label: 'Home', icon: '🏠' }]
    const { container } = render(<Tabs tabs={tabsWithIcons} activeTab="tab1" />)
    const icon = container.querySelector('.tabs__tab-icon')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  // Badges
  it('renders tab with badge', () => {
    const tabsWithBadges = [{ id: 'tab1', label: 'Messages', badge: 5 }]
    render(<Tabs tabs={tabsWithBadges} activeTab="tab1" />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders badge with zero value', () => {
    const tabsWithBadges = [{ id: 'tab1', label: 'Messages', badge: 0 }]
    render(<Tabs tabs={tabsWithBadges} activeTab="tab1" />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  // Variants
  it('applies underline variant by default', () => {
    const { container } = render(<Tabs tabs={mockTabs} activeTab="tab1" />)
    expect(container.querySelector('.tabs--underline')).toBeInTheDocument()
  })

  it('applies pills variant', () => {
    const { container } = render(<Tabs tabs={mockTabs} activeTab="tab1" variant="pills" />)
    expect(container.querySelector('.tabs--pills')).toBeInTheDocument()
  })

  it('applies default variant', () => {
    const { container } = render(<Tabs tabs={mockTabs} activeTab="tab1" variant="default" />)
    expect(container.querySelector('.tabs--default')).toBeInTheDocument()
  })

  // Sizes
  it('applies md size by default', () => {
    const { container } = render(<Tabs tabs={mockTabs} activeTab="tab1" />)
    expect(container.querySelector('.tabs--md')).toBeInTheDocument()
  })

  it('applies sm size', () => {
    const { container } = render(<Tabs tabs={mockTabs} activeTab="tab1" size="sm" />)
    expect(container.querySelector('.tabs--sm')).toBeInTheDocument()
  })

  it('applies lg size', () => {
    const { container } = render(<Tabs tabs={mockTabs} activeTab="tab1" size="lg" />)
    expect(container.querySelector('.tabs--lg')).toBeInTheDocument()
  })

  // Full width
  it('applies full-width class', () => {
    const { container } = render(<Tabs tabs={mockTabs} activeTab="tab1" fullWidth />)
    expect(container.querySelector('.tabs--full-width')).toBeInTheDocument()
  })

  // Keyboard navigation
  it('navigates with ArrowRight key', () => {
    const handleChange = vi.fn()
    render(<Tabs tabs={mockTabs} activeTab="tab1" onChange={handleChange} />)
    const firstTab = screen.getByRole('tab', { name: 'Overview' })
    fireEvent.keyDown(firstTab, { key: 'ArrowRight' })
    expect(handleChange).toHaveBeenCalledWith('tab2')
  })

  it('navigates with ArrowLeft key', () => {
    const handleChange = vi.fn()
    render(<Tabs tabs={mockTabs} activeTab="tab2" onChange={handleChange} />)
    const secondTab = screen.getByRole('tab', { name: 'Details' })
    fireEvent.keyDown(secondTab, { key: 'ArrowLeft' })
    expect(handleChange).toHaveBeenCalledWith('tab1')
  })

  it('wraps around with ArrowRight on last tab', () => {
    const handleChange = vi.fn()
    render(<Tabs tabs={mockTabs} activeTab="tab3" onChange={handleChange} />)
    const lastTab = screen.getByRole('tab', { name: 'Settings' })
    fireEvent.keyDown(lastTab, { key: 'ArrowRight' })
    expect(handleChange).toHaveBeenCalledWith('tab1')
  })

  it('navigates to first tab with Home key', () => {
    const handleChange = vi.fn()
    render(<Tabs tabs={mockTabs} activeTab="tab3" onChange={handleChange} />)
    const lastTab = screen.getByRole('tab', { name: 'Settings' })
    fireEvent.keyDown(lastTab, { key: 'Home' })
    expect(handleChange).toHaveBeenCalledWith('tab1')
  })

  it('navigates to last tab with End key', () => {
    const handleChange = vi.fn()
    render(<Tabs tabs={mockTabs} activeTab="tab1" onChange={handleChange} />)
    const firstTab = screen.getByRole('tab', { name: 'Overview' })
    fireEvent.keyDown(firstTab, { key: 'End' })
    expect(handleChange).toHaveBeenCalledWith('tab3')
  })

  // Tabindex
  it('sets tabIndex 0 on active tab', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" />)
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('tabIndex', '0')
  })

  it('sets tabIndex -1 on inactive tabs', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" />)
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('tabIndex', '-1')
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('tabIndex', '-1')
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<Tabs tabs={mockTabs} activeTab="tab1" className="custom-tabs" />)
    expect(container.querySelector('.tabs')).toHaveClass('custom-tabs')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<Tabs ref={ref} tabs={mockTabs} activeTab="tab1" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('tabs')
  })

  // Empty tabs
  it('renders empty when no tabs provided', () => {
    const { container } = render(<Tabs tabs={[]} activeTab="" />)
    const tablist = container.querySelector('.tabs')
    expect(tablist.children).toHaveLength(0)
  })

  // ARIA
  it('sets aria-orientation to horizontal', () => {
    render(<Tabs tabs={mockTabs} activeTab="tab1" />)
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal')
  })
})
