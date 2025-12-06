import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Skeleton from './Skeleton'

describe('Skeleton', () => {
  it('renders with aria-hidden', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies default variant class', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('skeleton--text')
  })

  it.each(['text', 'circle', 'rect'])('applies %s variant class', (variant) => {
    const { container } = render(<Skeleton variant={variant} />)
    expect(container.firstChild).toHaveClass(`skeleton--${variant}`)
  })

  it('animates by default', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('skeleton--animate')
  })

  it('can disable animation', () => {
    const { container } = render(<Skeleton animate={false} />)
    expect(container.firstChild).not.toHaveClass('skeleton--animate')
  })

  it('applies width as number', () => {
    const { container } = render(<Skeleton width={100} />)
    expect(container.firstChild).toHaveStyle({ width: '100px' })
  })

  it('applies width as string', () => {
    const { container } = render(<Skeleton width="50%" />)
    expect(container.firstChild).toHaveStyle({ width: '50%' })
  })

  it('applies height as number', () => {
    const { container } = render(<Skeleton height={20} />)
    expect(container.firstChild).toHaveStyle({ height: '20px' })
  })

  it('accepts additional className', () => {
    const { container } = render(<Skeleton className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
