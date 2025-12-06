import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FormRow from './FormRow'

describe('FormRow', () => {
  it('renders children', () => {
    render(
      <FormRow>
        <input type="text" placeholder="First" />
        <input type="text" placeholder="Second" />
      </FormRow>
    )
    expect(screen.getByPlaceholderText('First')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Second')).toBeInTheDocument()
  })

  it('applies grid layout', () => {
    const { container } = render(
      <FormRow>
        <input type="text" />
        <input type="text" />
      </FormRow>
    )
    expect(container.querySelector('.form-row')).toHaveStyle({
      display: 'grid',
    })
  })

  it('uses custom column count', () => {
    const { container } = render(
      <FormRow columns={3}>
        <input type="text" />
        <input type="text" />
        <input type="text" />
      </FormRow>
    )
    expect(container.querySelector('.form-row')).toHaveStyle({
      '--form-row-columns': 'repeat(3, 1fr)',
    })
  })

  it('uses custom grid template', () => {
    const { container } = render(
      <FormRow columns="1fr 2fr">
        <input type="text" />
        <input type="text" />
      </FormRow>
    )
    expect(container.querySelector('.form-row')).toHaveStyle({
      '--form-row-columns': '1fr 2fr',
    })
  })

  // Gap variants
  it.each(['sm', 'md', 'lg'])('applies %s gap class', (gap) => {
    const { container } = render(
      <FormRow gap={gap}>
        <input type="text" />
        <input type="text" />
      </FormRow>
    )
    expect(container.querySelector(`.form-row--gap-${gap}`)).toBeInTheDocument()
  })

  it('applies default md gap', () => {
    const { container } = render(
      <FormRow>
        <input type="text" />
        <input type="text" />
      </FormRow>
    )
    expect(container.querySelector('.form-row--gap-md')).toBeInTheDocument()
  })

  // Responsive
  it('applies responsive class by default', () => {
    const { container } = render(
      <FormRow>
        <input type="text" />
        <input type="text" />
      </FormRow>
    )
    expect(container.querySelector('.form-row--responsive')).toBeInTheDocument()
  })

  it('removes responsive class when disabled', () => {
    const { container } = render(
      <FormRow responsive={false}>
        <input type="text" />
        <input type="text" />
      </FormRow>
    )
    expect(container.querySelector('.form-row--responsive')).not.toBeInTheDocument()
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(
      <FormRow className="custom-class">
        <input type="text" />
        <input type="text" />
      </FormRow>
    )
    expect(container.querySelector('.form-row')).toHaveClass('custom-class')
  })

  // Forwarded ref
  it('forwards ref to container element', () => {
    const ref = { current: null }
    render(
      <FormRow ref={ref}>
        <input type="text" />
      </FormRow>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
