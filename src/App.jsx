import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import WelcomeScreen from './components/WelcomeScreen'
import ChatContainer from './components/ChatContainer'
import { generateId, getGreeting } from './utils'

export default function App() {
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null

  const startNewChat = useCallback((initialMessage = null) => {
    const id = generateId()
    const newConv = { id, title: 'New conversation', messages: [], createdAt: Date.now() }
    setConversations(prev => [newConv, ...prev])
    setActiveConversationId(id)
    return { id, initialMessage }
  }, [])

  const updateConversation = useCallback((id, updater) => {
    setConversations(prev => prev.map(c => c.id === id ? updater(c) : c))
  }, [])

  const handleNewChat = useCallback(() => {
    const id = generateId()
    const newConv = { id, title: 'New conversation', messages: [], createdAt: Date.now() }
    setConversations(prev => [newConv, ...prev])
    setActiveConversationId(id)
  }, [])

  const handleSelectConversation = useCallback((id) => {
    setActiveConversationId(id)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        greeting={getGreeting()}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#1a1a1a' }}>
        {!activeConversation ? (
          <WelcomeScreen
            greeting={getGreeting()}
            onSendMessage={(msg) => {
              const { id } = startNewChat()
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('send-initial-message', { detail: { convId: id, message: msg } }))
              }, 50)
            }}
          />
        ) : (
          <ChatContainer
            key={activeConversation.id}
            conversation={activeConversation}
            onUpdateConversation={updateConversation}
          />
        )}
      </div>
    </div>
  )
}
