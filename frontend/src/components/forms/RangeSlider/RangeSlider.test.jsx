import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RangeSlider from './RangeSlider'

describe('RangeSlider', () => {
  it('renders basic slider', () => {
    render(<RangeSlider label="Volume" />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
    expect(screen.getByText('Volume')).toBeInTheDocument()
  })

  it('renders without label', () => {
    render(<RangeSlider />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('displays current value', () => {
    render(<RangeSlider value={50} onChange={() => {}} />)
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('displays min and max limits', () => {
    const { container } = render(<RangeSlider min={0} max={100} />)
    expect(container.querySelector('.range-slider__min')).toHaveTextContent('0')
    expect(container.querySelector('.range-slider__max')).toHaveTextContent('100')
  })

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn()
    render(<RangeSlider onChange={handleChange} />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '50' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('formats displayed value with custom formatter', () => {
    const { container } = render(
      <RangeSlider value={100} formatValue={(v) => `$${v}`} onChange={() => {}} />
    )
    expect(container.querySelector('.range-slider__value')).toHaveTextContent('$100')
  })

  it('formats min/max with custom formatter', () => {
    const { container } = render(<RangeSlider min={0} max={1000} formatValue={(v) => `$${v}`} />)
    expect(container.querySelector('.range-slider__min')).toHaveTextContent('$0')
    expect(container.querySelector('.range-slider__max')).toHaveTextContent('$1000')
  })

  it('hides value when showValue is false', () => {
    render(<RangeSlider value={50} showValue={false} onChange={() => {}} />)
    expect(screen.queryByText('50')).not.toBeInTheDocument()
  })

  // Range mode
  it('renders dual sliders in range mode', () => {
    render(<RangeSlider range value={[20, 80]} onChange={() => {}} />)
    const sliders = screen.getAllByRole('slider')
    expect(sliders).toHaveLength(2)
  })

  it('displays range values', () => {
    render(<RangeSlider range value={[20, 80]} onChange={() => {}} />)
    expect(screen.getByText('20 - 80')).toBeInTheDocument()
  })

  it('calls onChange with array in range mode', () => {
    const handleChange = vi.fn()
    render(<RangeSlider range value={[20, 80]} onChange={handleChange} />)
    const sliders = screen.getAllByRole('slider')
    fireEvent.change(sliders[1], { target: { value: '90' } })
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: expect.arrayContaining([20, 90]),
        }),
      })
    )
  })

  // Min/Max/Step
  it('respects min value', () => {
    render(<RangeSlider min={10} />)
    expect(screen.getByRole('slider')).toHaveAttribute('min', '10')
  })

  it('respects max value', () => {
    render(<RangeSlider max={200} />)
    expect(screen.getByRole('slider')).toHaveAttribute('max', '200')
  })

  it('respects step value', () => {
    render(<RangeSlider step={5} />)
    expect(screen.getByRole('slider')).toHaveAttribute('step', '5')
  })

  // Default value
  it('uses defaultValue for uncontrolled slider', () => {
    render(<RangeSlider defaultValue={30} />)
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('uses defaultValue for uncontrolled range slider', () => {
    render(<RangeSlider range defaultValue={[25, 75]} />)
    expect(screen.getByText('25 - 75')).toBeInTheDocument()
  })

  // Disabled state
  it('disables slider when disabled prop is true', () => {
    render(<RangeSlider disabled />)
    expect(screen.getByRole('slider')).toBeDisabled()
  })

  it('disables both sliders in range mode', () => {
    render(<RangeSlider range value={[20, 80]} disabled onChange={() => {}} />)
    const sliders = screen.getAllByRole('slider')
    sliders.forEach((slider) => expect(slider).toBeDisabled())
  })

  it('applies disabled styling', () => {
    const { container } = render(<RangeSlider disabled />)
    expect(container.querySelector('.range-slider--disabled')).toBeInTheDocument()
  })

  // Accessibility
  it('associates label with slider', () => {
    render(<RangeSlider id="volume" label="Volume" />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('id', 'volume')
  })

  it('has aria-label in range mode', () => {
    render(<RangeSlider range label="Price" value={[0, 100]} onChange={() => {}} />)
    const sliders = screen.getAllByRole('slider')
    expect(sliders[0]).toHaveAttribute('aria-label', 'Price minimum')
    expect(sliders[1]).toHaveAttribute('aria-label', 'Price maximum')
  })

  // Additional className
  it('accepts additional className', () => {
    const { container } = render(<RangeSlider className="custom-class" />)
    expect(container.querySelector('.range-slider')).toHaveClass('custom-class')
  })

  // Forwarded ref
  it('forwards ref to container element', () => {
    const ref = { current: null }
    render(<RangeSlider ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
