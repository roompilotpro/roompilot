import React from 'react'

const MessageCard = ({ message }) => {
  return (
    <div className="message-card">
      <h3>{message.content}</h3>
      <p className="timestamp">Created: {new Date(message.createdAt).toLocaleString()}</p>
    </div>
  )
}

export default MessageCard
