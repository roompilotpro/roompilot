import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Toast, ToastContainer } from './Toast'
import { ToastProvider, useToast } from '../../../contexts/ToastContext'

describe('Toast', () => {
  // Basic rendering
  it('renders message', () => {
    render(<Toast message="Hello World" />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders with status role', () => {
    render(<Toast message="Hello" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has aria-live polite', () => {
    render(<Toast message="Hello" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  // Types
  it('applies info type by default', () => {
    const { container } = render(<Toast message="Hello" />)
    expect(container.querySelector('.toast--info')).toBeInTheDocument()
  })

  it('applies success type', () => {
    const { container } = render(<Toast message="Hello" type="success" />)
    expect(container.querySelector('.toast--success')).toBeInTheDocument()
  })

  it('applies warning type', () => {
    const { container } = render(<Toast message="Hello" type="warning" />)
    expect(container.querySelector('.toast--warning')).toBeInTheDocument()
  })

  it('applies error type', () => {
    const { container } = render(<Toast message="Hello" type="error" />)
    expect(container.querySelector('.toast--error')).toBeInTheDocument()
  })

  // Icons
  it('renders icon for info type', () => {
    render(<Toast message="Hello" type="info" />)
    expect(screen.getByText('ℹ️')).toBeInTheDocument()
  })

  it('renders icon for success type', () => {
    render(<Toast message="Hello" type="success" />)
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('marks icon as aria-hidden', () => {
    const { container } = render(<Toast message="Hello" />)
    const icon = container.querySelector('.toast__icon')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  // Dismissible
  it('shows dismiss button by default', () => {
    render(<Toast message="Hello" />)
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument()
  })

  it('hides dismiss button when dismissible is false', () => {
    render(<Toast message="Hello" dismissible={false} />)
    expect(screen.queryByRole('button', { name: 'Dismiss notification' })).not.toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', async () => {
    vi.useFakeTimers()
    const handleDismiss = vi.fn()
    render(<Toast message="Hello" onDismiss={handleDismiss} />)

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))

    // Wait for animation timeout
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(handleDismiss).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  // Custom className
  it('accepts custom className', () => {
    const { container } = render(<Toast message="Hello" className="custom-toast" />)
    expect(container.querySelector('.toast')).toHaveClass('custom-toast')
  })

  // Ref forwarding
  it('forwards ref to container', () => {
    const ref = { current: null }
    render(<Toast ref={ref} message="Hello" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current).toHaveClass('toast')
  })
})

describe('ToastContainer', () => {
  const mockToasts = [
    { id: '1', message: 'First toast', type: 'info', dismissible: true },
    { id: '2', message: 'Second toast', type: 'success', dismissible: true },
  ]

  it('renders all toasts', () => {
    render(<ToastContainer toasts={mockToasts} />)
    expect(screen.getByText('First toast')).toBeInTheDocument()
    expect(screen.getByText('Second toast')).toBeInTheDocument()
  })

  it('returns null when no toasts', () => {
    const { container } = render(<ToastContainer toasts={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('applies position class', () => {
    const { container } = render(<ToastContainer toasts={mockToasts} position="top-right" />)
    expect(container.querySelector('.toast-container--top-right')).toBeInTheDocument()
  })

  it('applies bottom-center position by default', () => {
    const { container } = render(<ToastContainer toasts={mockToasts} />)
    expect(container.querySelector('.toast-container--bottom-center')).toBeInTheDocument()
  })

  it('calls onDismiss with toast id', async () => {
    vi.useFakeTimers()
    const handleDismiss = vi.fn()
    render(<ToastContainer toasts={mockToasts} onDismiss={handleDismiss} />)

    const dismissButtons = screen.getAllByRole('button', { name: 'Dismiss notification' })
    fireEvent.click(dismissButtons[0])

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(handleDismiss).toHaveBeenCalledWith('1')
    vi.useRealTimers()
  })
})

describe('ToastContext', () => {
  // Helper component to test the hook
  function TestComponent() {
    const { toasts, showToast, hideToast, clearToasts } = useToast()
    return (
      <div>
        <button onClick={() => showToast({ message: 'Test toast', type: 'success' })}>
          Show Toast
        </button>
        <button onClick={() => clearToasts()}>Clear All</button>
        <div data-testid="toast-count">{toasts.length}</div>
        {toasts.map((t) => (
          <div key={t.id} data-testid={`toast-${t.id}`}>
            {t.message}
            <button onClick={() => hideToast(t.id)}>Hide</button>
          </div>
        ))}
      </div>
    )
  }

  it('provides toast context', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0')
  })

  it('adds toast when showToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }))
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1')
    expect(screen.getByText('Test toast')).toBeInTheDocument()
  })

  it('removes toast when hideToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }))
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1')

    fireEvent.click(screen.getByRole('button', { name: 'Hide' }))
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0')
  })

  it('clears all toasts when clearToasts is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }))
    fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }))
    expect(screen.getByTestId('toast-count')).toHaveTextContent('2')

    fireEvent.click(screen.getByRole('button', { name: 'Clear All' }))
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0')
  })

  it('auto-dismisses toast after duration', () => {
    vi.useFakeTimers()

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }))
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1')

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0')
    vi.useRealTimers()
  })

  it('throws error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useToast must be used within a ToastProvider')

    consoleSpy.mockRestore()
  })
})
