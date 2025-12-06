import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HouseRulesGrid from './HouseRulesGrid'

describe('HouseRulesGrid', () => {
  const rules = [
    { label: 'Guests allowed (notify host)', allowed: true },
    { label: 'Quiet hours: 10pm - 7am', allowed: true },
    { label: 'No smoking', allowed: false },
    { label: 'No pets', allowed: false },
  ]

  it('renders title', () => {
    render(<HouseRulesGrid rules={rules} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('House rules')
  })

  it('renders custom title', () => {
    render(<HouseRulesGrid rules={rules} title="Rules" />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Rules')
  })

  it('renders rule items', () => {
    render(<HouseRulesGrid rules={rules} />)
    expect(screen.getByText('Guests allowed (notify host)')).toBeInTheDocument()
    expect(screen.getByText('No smoking')).toBeInTheDocument()
  })

  it('renders allowed rules with correct styling', () => {
    render(<HouseRulesGrid rules={rules} />)
    const allowedItem = screen
      .getByText('Guests allowed (notify host)')
      .closest('.house-rules-grid__item')
    expect(allowedItem).toHaveClass('house-rules-grid__item--allowed')
  })

  it('renders not-allowed rules with correct styling', () => {
    render(<HouseRulesGrid rules={rules} />)
    const notAllowedItem = screen.getByText('No smoking').closest('.house-rules-grid__item')
    expect(notAllowedItem).toHaveClass('house-rules-grid__item--not-allowed')
  })

  it('shows check icon for allowed rules', () => {
    render(<HouseRulesGrid rules={[{ label: 'Test allowed', allowed: true }]} />)
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('shows X icon for not-allowed rules', () => {
    render(<HouseRulesGrid rules={[{ label: 'Test not allowed', allowed: false }]} />)
    expect(screen.getByText('✗')).toBeInTheDocument()
  })

  it('renders empty when no rules provided', () => {
    render(<HouseRulesGrid rules={[]} />)
    expect(document.querySelector('.house-rules-grid__list').children).toHaveLength(0)
  })

  it('applies custom className', () => {
    render(<HouseRulesGrid rules={rules} className="custom-rules" />)
    expect(document.querySelector('.house-rules-grid')).toHaveClass('custom-rules')
  })
})
