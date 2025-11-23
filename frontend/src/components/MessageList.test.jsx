import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MessageList from './MessageList'

describe('MessageList', () => {
  it('displays loading state', () => {
    render(<MessageList messages={[]} loading={true} error={null} />)

    expect(screen.getByText('Loading messages...')).toBeInTheDocument()
    expect(screen.getByText('Loading messages...').className).toBe('loading')
  })

  it('displays error state', () => {
    render(<MessageList messages={[]} loading={false} error="Connection failed" />)

    expect(screen.getByText('Error: Connection failed')).toBeInTheDocument()
    expect(screen.getByText('Error: Connection failed').className).toBe('error')
  })

  it('displays no messages state when array is empty', () => {
    render(<MessageList messages={[]} loading={false} error={null} />)

    expect(screen.getByText('No messages found')).toBeInTheDocument()
    expect(screen.getByText('No messages found').className).toBe('no-messages')
  })

  it('displays no messages state when messages is null', () => {
    render(<MessageList messages={null} loading={false} error={null} />)

    expect(screen.getByText('No messages found')).toBeInTheDocument()
  })

  it('renders message cards when messages are provided', () => {
    const messages = [
      { id: 1, content: 'Message 1', createdAt: '2025-01-15T10:00:00Z' },
      { id: 2, content: 'Message 2', createdAt: '2025-01-15T11:00:00Z' },
      { id: 3, content: 'Message 3', createdAt: '2025-01-15T12:00:00Z' },
    ]

    render(<MessageList messages={messages} loading={false} error={null} />)

    expect(screen.getByText('Message 1')).toBeInTheDocument()
    expect(screen.getByText('Message 2')).toBeInTheDocument()
    expect(screen.getByText('Message 3')).toBeInTheDocument()
  })

  it('applies correct CSS class to container', () => {
    const messages = [{ id: 1, content: 'Message 1', createdAt: '2025-01-15T10:00:00Z' }]

    const { container } = render(<MessageList messages={messages} loading={false} error={null} />)

    const messageList = container.querySelector('.message-list')
    expect(messageList).toBeInTheDocument()
  })

  it('renders correct number of message cards', () => {
    const messages = [
      { id: 1, content: 'Message 1', createdAt: '2025-01-15T10:00:00Z' },
      { id: 2, content: 'Message 2', createdAt: '2025-01-15T11:00:00Z' },
    ]

    const { container } = render(<MessageList messages={messages} loading={false} error={null} />)

    const messageCards = container.querySelectorAll('.message-card')
    expect(messageCards).toHaveLength(2)
  })
})
