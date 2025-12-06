import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HostStrip from './HostStrip'

describe('HostStrip', () => {
  const defaultHost = {
    name: 'Marcus',
    yearsHosting: 2,
    totalRooms: 12,
    isSuperhost: true,
  }

  it('renders host name', () => {
    render(<HostStrip host={defaultHost} />)
    expect(screen.getByText('Hosted by Marcus')).toBeInTheDocument()
  })

  it('renders initial when no avatar', () => {
    render(<HostStrip host={defaultHost} />)
    expect(document.querySelector('.host-strip__avatar')).toHaveTextContent('M')
  })

  it('renders avatar image when provided', () => {
    render(<HostStrip host={{ ...defaultHost, avatar: '/host.jpg' }} />)
    const img = document.querySelector('.host-strip__avatar-image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/host.jpg')
  })

  it('renders stats', () => {
    render(<HostStrip host={defaultHost} />)
    // "Superhost" appears in both stats text and badge, so use getAllByText
    expect(screen.getAllByText(/Superhost/)).toHaveLength(2)
    expect(screen.getByText(/2 years hosting/)).toBeInTheDocument()
    expect(screen.getByText(/12 rooms/)).toBeInTheDocument()
  })

  it('renders superhost badge when isSuperhost is true', () => {
    render(<HostStrip host={defaultHost} />)
    expect(document.querySelector('.host-strip__badge')).toHaveTextContent('Superhost')
  })

  it('does not render superhost badge when isSuperhost is false', () => {
    render(<HostStrip host={{ ...defaultHost, isSuperhost: false }} />)
    expect(document.querySelector('.host-strip__badge')).not.toBeInTheDocument()
  })

  it('handles singular year correctly', () => {
    render(<HostStrip host={{ ...defaultHost, yearsHosting: 1 }} />)
    expect(screen.getByText(/1 year hosting/)).toBeInTheDocument()
  })

  it('handles singular room correctly', () => {
    render(<HostStrip host={{ ...defaultHost, totalRooms: 1 }} />)
    expect(screen.getByText(/1 room/)).toBeInTheDocument()
  })

  it('renders with default host name', () => {
    render(<HostStrip />)
    expect(screen.getByText('Hosted by Host')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<HostStrip host={defaultHost} className="custom-strip" />)
    expect(document.querySelector('.host-strip')).toHaveClass('custom-strip')
  })
})
