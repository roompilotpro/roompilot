import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLandlordLayout } from '../../hooks/useLandlordLayout'
import { AppShell } from '../../components/layout'
import { Button } from '../../components/primitives'
import { classNames } from '../../utils'

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
      <div className="h-full flex flex-col">
        <div className="flex flex-1 overflow-hidden bg-snow rounded-xl">
          {/* Conversation List */}
          <div className="w-[400px] bg-white border-r border-cloud flex flex-col md:absolute md:w-full md:z-10 md:hidden">
            <div className="p-5 border-b border-cloud">
              <input
                type="text"
                className="w-full py-2.5 px-4 border border-cloud rounded-lg font-body text-sm mb-3"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="w-full py-2.5 px-4 border border-cloud rounded-lg font-body text-sm bg-white cursor-pointer"
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
              >
                <option value="all">All Properties</option>
                <option value="sunset">Sunset Villa</option>
                <option value="oak">Oak Street Apartments</option>
                <option value="downtown">Downtown Loft</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={classNames(
                    'py-4 px-5 border-b border-cloud cursor-pointer transition-colors duration-200 flex gap-3 items-start',
                    conv.id === activeConversation &&
                      'bg-primary-bg border-l-[3px] border-l-primary',
                    conv.isUnread && 'bg-warm-bg',
                    conv.id !== activeConversation && !conv.isUnread && 'hover:bg-snow'
                  )}
                  onClick={() => setActiveConversation(conv.id)}
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold shrink-0 text-base">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-midnight text-sm">{conv.name}</span>
                      <span className="text-xs text-slate">{conv.time}</span>
                    </div>
                    <div className="text-sm text-slate whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                      {conv.preview}
                    </div>
                    <div className="text-xs text-slate">{conv.property}</div>
                  </div>
                  {conv.unread > 0 && (
                    <span className="bg-primary text-white text-[11px] py-0.5 px-2 rounded-xl font-semibold min-w-[20px] text-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat View */}
          <div className="flex-1 flex flex-col bg-snow">
            <div className="bg-white py-5 px-6 border-b border-cloud">
              <div className="font-bold text-lg text-midnight mb-1">{activeConv?.name}</div>
              <div className="text-sm text-slate">{activeConv?.property}</div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div className="text-center text-slate text-xs my-4">Today</div>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={classNames(
                    'max-w-[70%] py-3 px-4 rounded-2xl relative',
                    message.type === 'received' && 'bg-white self-start rounded-bl',
                    message.type === 'sent' && 'bg-primary text-white self-end rounded-br'
                  )}
                >
                  <div className="mb-1 leading-relaxed">{message.text}</div>
                  {message.hasImage && message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt="Attachment"
                      className="max-w-full rounded-lg mt-2 block"
                    />
                  )}
                  <div className="text-[11px] opacity-70">{message.timestamp}</div>
                </div>
              ))}
            </div>

            <div className="bg-white py-5 px-6 border-t border-cloud">
              <div className="mb-3">
                <select
                  className="py-2 px-3 border border-cloud rounded-md font-body text-[13px] bg-snow cursor-pointer"
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
              <div className="flex gap-3 items-end">
                <textarea
                  className="flex-1 py-3 px-4 border border-cloud rounded-3xl font-body text-sm resize-none min-h-[48px] max-h-[120px]"
                  placeholder="Type a message..."
                  rows="1"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                ></textarea>
                <button
                  className="bg-primary text-white border-none py-3 px-6 rounded-3xl font-semibold cursor-pointer transition-colors duration-200 font-body text-sm hover:bg-primary-dark"
                  onClick={handleSendMessage}
                >
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
