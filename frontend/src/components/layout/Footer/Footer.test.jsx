import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  const defaultColumns = [
    {
      title: 'For Landlords',
      links: [
        { label: 'List Your Property', href: '/list' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'For Renters',
      links: [
        { label: 'Find a Room', href: '/search' },
        { label: 'FAQs', href: '/faqs' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
      ],
    },
  ]

  const defaultLegalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ]

  // Logo
  it('renders with default logo', () => {
    render(<Footer />)
    expect(screen.getByText('R')).toBeInTheDocument()
    expect(screen.getByText('RoomPilot')).toBeInTheDocument()
  })

  it('renders custom logo and text', () => {
    render(<Footer logo="X" logoText="MyApp" />)
    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByText('MyApp')).toBeInTheDocument()
  })

  it('renders tagline when provided', () => {
    render(<Footer tagline="The best rental marketplace" />)
    expect(screen.getByText('The best rental marketplace')).toBeInTheDocument()
  })

  it('does not render tagline when not provided', () => {
    const { container } = render(<Footer />)
    expect(container.querySelector('.footer__tagline')).not.toBeInTheDocument()
  })

  // Columns
  it('renders link columns', () => {
    render(<Footer columns={defaultColumns} />)
    expect(screen.getByText('For Landlords')).toBeInTheDocument()
    expect(screen.getByText('For Renters')).toBeInTheDocument()
    expect(screen.getByText('Company')).toBeInTheDocument()
  })

  it('renders links within columns', () => {
    render(<Footer columns={defaultColumns} />)
    expect(screen.getByText('List Your Property')).toBeInTheDocument()
    expect(screen.getByText('Find a Room')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('links have correct href', () => {
    render(<Footer columns={defaultColumns} />)
    expect(screen.getByRole('link', { name: 'List Your Property' })).toHaveAttribute(
      'href',
      '/list'
    )
    expect(screen.getByRole('link', { name: 'Find a Room' })).toHaveAttribute('href', '/search')
  })

  it('renders without columns', () => {
    const { container } = render(<Footer columns={[]} />)
    expect(container.querySelector('.footer__column')).not.toBeInTheDocument()
  })

  // Copyright
  it('renders default copyright with current year', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(`© ${year} RoomPilot. All rights reserved.`)).toBeInTheDocument()
  })

  it('renders custom copyright', () => {
    render(<Footer copyright="© 2025 Custom Corp" />)
    expect(screen.getByText('© 2025 Custom Corp')).toBeInTheDocument()
  })

  // Legal links
  it('renders legal links', () => {
    render(<Footer legalLinks={defaultLegalLinks} />)
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toBeInTheDocument()
  })

  it('legal links have correct href', () => {
    render(<Footer legalLinks={defaultLegalLinks} />)
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms')
  })

  it('does not render legal section when empty', () => {
    const { container } = render(<Footer legalLinks={[]} />)
    expect(container.querySelector('.footer__legal')).not.toBeInTheDocument()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<Footer className="custom-footer" />)
    expect(container.querySelector('.footer')).toHaveClass('custom-footer')
  })

  // Ref forwarding
  it('forwards ref to footer element', () => {
    const ref = { current: null }
    render(<Footer ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName).toBe('FOOTER')
  })

  // Semantic structure
  it('uses semantic footer element', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  // Full render test
  it('renders complete footer with all props', () => {
    render(
      <Footer
        logo="R"
        logoText="RoomPilot"
        tagline="The automation-first rental marketplace"
        columns={defaultColumns}
        legalLinks={defaultLegalLinks}
        copyright="© 2025 RoomPilot. All rights reserved."
      />
    )
    expect(screen.getByText('RoomPilot')).toBeInTheDocument()
    expect(screen.getByText('The automation-first rental marketplace')).toBeInTheDocument()
    expect(screen.getByText('For Landlords')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('© 2025 RoomPilot. All rights reserved.')).toBeInTheDocument()
  })
})
