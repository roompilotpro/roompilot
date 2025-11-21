import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MessageCard from './MessageCard'

describe('MessageCard', () => {
  it('renders message content', () => {
    const message = {
      id: 1,
      content: 'Test message',
      createdAt: '2025-01-15T10:00:00Z',
    }

    render(<MessageCard message={message} />)

    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('formats and displays timestamp', () => {
    const message = {
      id: 1,
      content: 'Test message',
      createdAt: '2025-01-15T10:00:00Z',
    }

    render(<MessageCard message={message} />)

    const timestampElement = screen.getByText(/Created:/)
    expect(timestampElement).toBeInTheDocument()
    expect(timestampElement.className).toBe('timestamp')
  })

  it('applies correct CSS class', () => {
    const message = {
      id: 1,
      content: 'Test message',
      createdAt: '2025-01-15T10:00:00Z',
    }

    const { container } = render(<MessageCard message={message} />)

    const messageCard = container.querySelector('.message-card')
    expect(messageCard).toBeInTheDocument()
  })
})
