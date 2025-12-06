import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Avatar from './Avatar'

describe('Avatar', () => {
  it('renders initials when no src provided', () => {
    render(<Avatar name="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders single initial for single word name', () => {
    render(<Avatar name="John" />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('renders ? for empty name', () => {
    render(<Avatar />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('renders image when src provided', () => {
    render(<Avatar src="/test.jpg" alt="Test user" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/test.jpg')
    expect(img).toHaveAttribute('alt', 'Test user')
  })

  it('uses name as alt when alt not provided', () => {
    render(<Avatar src="/test.jpg" name="John Doe" />)
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'John Doe')
  })

  it('applies default size class', () => {
    render(<Avatar name="John" />)
    expect(screen.getByText('J').closest('.avatar')).toHaveClass('avatar--md')
  })

  it.each(['xs', 'sm', 'md', 'lg', 'xl', '2xl'])('applies %s size class', (size) => {
    render(<Avatar name="John" size={size} />)
    expect(screen.getByText('J').closest('.avatar')).toHaveClass(`avatar--${size}`)
  })

  it('accepts additional className', () => {
    render(<Avatar name="John" className="custom-class" />)
    expect(screen.getByText('J').closest('.avatar')).toHaveClass('custom-class')
  })

  it('generates initials from first and last name', () => {
    render(<Avatar name="John Michael Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })
})
