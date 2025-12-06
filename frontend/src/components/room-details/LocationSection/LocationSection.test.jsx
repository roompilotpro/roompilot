import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LocationSection from './LocationSection'

describe('LocationSection', () => {
  const nearby = [
    { icon: '🚇', title: 'Transit', description: '5 min walk to Midtown MARTA station' },
    { icon: '🛒', title: 'Shopping', description: 'Whole Foods, Target within 0.5 miles' },
    { icon: '🌳', title: 'Parks', description: 'Piedmont Park 10 min walk' },
  ]

  it('renders title', () => {
    render(<LocationSection nearby={nearby} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Location')
  })

  it('renders custom title', () => {
    render(<LocationSection nearby={nearby} title="Area Info" />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Area Info')
  })

  it('renders map placeholder', () => {
    render(<LocationSection nearby={nearby} />)
    expect(document.querySelector('.location-section__map')).toBeInTheDocument()
    expect(document.querySelector('.location-section__map-marker')).toBeInTheDocument()
  })

  it('renders nearby details', () => {
    render(<LocationSection nearby={nearby} />)
    expect(screen.getByText('Transit')).toBeInTheDocument()
    expect(screen.getByText('5 min walk to Midtown MARTA station')).toBeInTheDocument()
    expect(screen.getByText('Shopping')).toBeInTheDocument()
    expect(screen.getByText('Parks')).toBeInTheDocument()
  })

  it('renders icons', () => {
    render(<LocationSection nearby={nearby} />)
    expect(screen.getByText('🚇')).toBeInTheDocument()
    expect(screen.getByText('🛒')).toBeInTheDocument()
    expect(screen.getByText('🌳')).toBeInTheDocument()
  })

  it('renders without nearby details', () => {
    render(<LocationSection nearby={[]} />)
    expect(document.querySelector('.location-section__details')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<LocationSection nearby={nearby} className="custom-location" />)
    expect(document.querySelector('.location-section')).toHaveClass('custom-location')
  })
})
