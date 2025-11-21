import React from 'react'
import MessageCard from './MessageCard'

const MessageList = ({ messages, loading, error }) => {
  if (loading) {
    return <div className="loading">Loading messages...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  if (!messages || messages.length === 0) {
    return <div className="no-messages">No messages found</div>
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  )
}

export default MessageList
