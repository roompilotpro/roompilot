import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button } from '../../components/primitives'
import './MessagesPage.css'

function MessagesPage() {
  const navigate = useNavigate()
  const { navLinks, user, logoBadge } = useLandlordLayout()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProperty, setSelectedProperty] = useState('all')
  const [activeConversation, setActiveConversation] = useState('sarah')
  const [messageInput, setMessageInput] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')

  // Mock conversations
  const conversations = [
    {
      id: 'sarah',
      name: 'Sarah Martinez',
      avatar: 'SM',
      preview: 'Thanks for fixing that so quickly!',
      time: '2m',
      property: 'Sunset Villa - Room 3A',
      unread: 0,
      isActive: true,
    },
    {
      id: 'james',
      name: 'James Chen',
      avatar: 'JC',
      preview: 'Hi, I have a question about the lease...',
      time: '15m',
      property: 'Oak Street Apartments - Room 2B',
      unread: 2,
      isUnread: true,
    },
    {
      id: 'house-chat',
      name: 'Sunset Villa House Chat',
      avatar: '🏠',
      preview: 'Alex: Anyone want to split an Uber?',
      time: '1h',
      property: 'Group Chat - 6 members',
      unread: 0,
    },
    {
      id: 'emily',
      name: 'Emily Parker',
      avatar: 'EP',
      preview: 'Perfect, see you then!',
      time: '3h',
      property: 'Downtown Loft - Room 1A',
      unread: 0,
    },
    {
      id: 'system',
      name: 'System Notification',
      avatar: '🔔',
      preview: 'New application received for Oak Street',
      time: '1d',
      property: 'Automated message',
      unread: 0,
    },
    {
      id: 'marcus',
      name: 'Marcus Rodriguez',
      avatar: 'MR',
      preview: 'Sounds good, thank you!',
      time: '2d',
      property: 'Sunset Villa - Room 1B',
      unread: 0,
    },
  ]

  // Mock messages for active conversation
  const messages = [
    {
      id: 1,
      type: 'received',
      text: "Hi! The heater in my room isn't working properly. It's been making a weird noise.",
      timestamp: '10:30 AM',
      hasImage: false,
    },
    {
      id: 2,
      type: 'received',
      text: "Here's a photo of the thermostat settings:",
      timestamp: '10:32 AM',
      hasImage: true,
      imageUrl: 'https://via.placeholder.com/300x200',
    },
    {
      id: 3,
      type: 'sent',
      text: "Thanks for letting me know, Sarah. I'll send someone to take a look at it today.",
      timestamp: '10:45 AM',
      hasImage: false,
    },
    {
      id: 4,
      type: 'sent',
      text: 'Will between 2-4 PM work for you?',
      timestamp: '10:45 AM',
      hasImage: false,
    },
    {
      id: 5,
      type: 'received',
      text: 'Yes, that works perfectly! Thank you.',
      timestamp: '10:50 AM',
      hasImage: false,
    },
    {
      id: 6,
      type: 'sent',
      text: 'Great! The technician just finished. Everything should be working now.',
      timestamp: '3:15 PM',
      hasImage: false,
    },
    {
      id: 7,
      type: 'received',
      text: 'Thanks for fixing that so quickly!',
      timestamp: '3:20 PM',
      hasImage: false,
    },
  ]

  const handleTemplateSelect = (e) => {
    const template = e.target.value
    setSelectedTemplate(template)
    if (template && template !== 'Quick replies...') {
      setMessageInput(template)
    }
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', messageInput)
      setMessageInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const activeConv = conversations.find((c) => c.id === activeConversation)

  const headerContent = (
    <Button variant="success" onClick={() => navigate('/landlord/announcement')}>
      Announce to All
    </Button>
  )

  return (
    <AppShell
      sidebar={{ links: navLinks, user, logoBadge }}
      header={{
        title: 'Messages',
        rightContent: headerContent,
      }}
    >
      <div className="messages-page">
        <div className="messages-container">
          {/* Conversation List */}
          <div className="conversation-list">
            <div className="conversation-filters">
              <input
                type="text"
                className="search-box"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="property-filter-select"
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
              >
                <option value="all">All Properties</option>
                <option value="sunset">Sunset Villa</option>
                <option value="oak">Oak Street Apartments</option>
                <option value="downtown">Downtown Loft</option>
              </select>
            </div>

            <div className="conversation-items">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`conversation-item ${conv.id === activeConversation ? 'active' : ''} ${
                    conv.isUnread ? 'unread' : ''
                  }`}
                  onClick={() => setActiveConversation(conv.id)}
                >
                  <div className="conversation-avatar">{conv.avatar}</div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <span className="conversation-name">{conv.name}</span>
                      <span className="conversation-time">{conv.time}</span>
                    </div>
                    <div className="conversation-preview">{conv.preview}</div>
                    <div className="conversation-property">{conv.property}</div>
                  </div>
                  {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Chat View */}
          <div className="chat-view">
            <div className="chat-header">
              <div className="chat-tenant-name">{activeConv?.name}</div>
              <div className="chat-property-context">{activeConv?.property}</div>
            </div>

            <div className="chat-messages">
              <div className="date-divider">Today</div>

              {messages.map((message) => (
                <div key={message.id} className={`message-bubble ${message.type}`}>
                  <div className="message-text">{message.text}</div>
                  {message.hasImage && message.imageUrl && (
                    <img src={message.imageUrl} alt="Attachment" className="message-image" />
                  )}
                  <div className="message-timestamp">{message.timestamp}</div>
                </div>
              ))}
            </div>

            <div className="chat-input-container">
              <div className="template-selector">
                <select
                  className="template-dropdown"
                  value={selectedTemplate}
                  onChange={handleTemplateSelect}
                >
                  <option>Quick replies...</option>
                  <option>I'll look into that</option>
                  <option>Maintenance scheduled</option>
                  <option>Thank you for letting me know</option>
                  <option>Will get back to you soon</option>
                </select>
              </div>
              <div className="chat-input-wrapper">
                <textarea
                  className="chat-input"
                  placeholder="Type a message..."
                  rows="1"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                ></textarea>
                <button className="send-btn" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export default MessagesPage
