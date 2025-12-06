import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  // Rendering tests
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('renders with default props', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn', 'btn--primary', 'btn--md')
    expect(button).toHaveAttribute('type', 'button')
  })

  // Variant tests
  it.each(['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'white'])(
    'applies %s variant class',
    (variant) => {
      render(<Button variant={variant}>Test</Button>)
      expect(screen.getByRole('button')).toHaveClass(`btn--${variant}`)
    }
  )

  // Size tests
  it.each(['sm', 'md', 'lg'])('applies %s size class', (size) => {
    render(<Button size={size}>Test</Button>)
    expect(screen.getByRole('button')).toHaveClass(`btn--${size}`)
  })

  // State tests
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Test</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading spinner when loading', () => {
    render(<Button loading>Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn--loading')
    expect(button).toBeDisabled()
    expect(button.querySelector('.btn__spinner')).toBeInTheDocument()
  })

  it('applies full-width class when fullWidth is true', () => {
    render(<Button fullWidth>Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn--full-width')
  })

  // Icon tests
  it('renders left icon', () => {
    render(<Button leftIcon={<span data-testid="left-icon">+</span>}>Test</Button>)
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders right icon', () => {
    render(<Button rightIcon={<span data-testid="right-icon">→</span>}>Test</Button>)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('hides icons when loading', () => {
    render(
      <Button
        loading
        leftIcon={<span data-testid="left-icon">+</span>}
        rightIcon={<span data-testid="right-icon">→</span>}
      >
        Test
      </Button>
    )
    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument()
  })

  // Event tests
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when loading', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Button loading onClick={handleClick}>
        Click me
      </Button>
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  // Type tests
  it.each(['button', 'submit', 'reset'])('accepts type="%s"', (type) => {
    render(<Button type={type}>Test</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', type)
  })

  // Custom className test
  it('accepts additional className', () => {
    render(<Button className="custom-class">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  // Ref forwarding test
  it('forwards ref to button element', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Test</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  // Accessibility tests
  it('is focusable via keyboard', async () => {
    const user = userEvent.setup()
    render(<Button>Test</Button>)

    await user.tab()
    expect(screen.getByRole('button')).toHaveFocus()
  })

  it('is not focusable when disabled', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button>Before</button>
        <Button disabled>Test</Button>
        <button>After</button>
      </>
    )

    await user.tab()
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
  })
})
