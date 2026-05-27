import { useState, useRef, useEffect, useCallback } from 'react'
import Message from './Message'
import ChatInput from './ChatInput'
import styles from './ChatContainer.module.css'

export default function ChatContainer({ conversation, onUpdateConversation }) {
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef(null)
  const pendingInitialRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [conversation.messages, streamingContent, scrollToBottom])

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return

    const userMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() }

    onUpdateConversation(conversation.id, (conv) => ({
      ...conv,
      title: conv.messages.length === 0 ? text.slice(0, 50) : conv.title,
      messages: [...conv.messages, userMessage],
    }))

    setLoading(true)
    setStreamingContent('')

    try {
      if (!window.puter) {
        throw new Error('Puter.js is still loading. Please wait a moment and try again.')
      }

      const history = conversation.messages.map(m => ({ role: m.role, content: m.content }))
      history.push({ role: 'user', content: text })

      let fullResponse = ''

      const response = await window.puter.ai.chat(history, {
        model: 'claude-sonnet-4-5',
        stream: true,
      })

      if (response && typeof response === 'string') {
        fullResponse = response
      } else if (Symbol.asyncIterator && response[Symbol.asyncIterator]) {
        for await (const chunk of response) {
          const delta = chunk?.text || chunk?.delta?.text || chunk?.choices?.[0]?.delta?.content || ''
          if (delta) {
            fullResponse += delta
            setStreamingContent(fullResponse)
          }
        }
      } else if (response?.message?.content) {
        fullResponse = response.message.content
      } else {
        fullResponse = JSON.stringify(response)
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: Date.now(),
      }

      onUpdateConversation(conversation.id, (conv) => ({
        ...conv,
        messages: [...conv.messages, assistantMessage],
      }))
    } catch (err) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message || 'Unknown error'}. Please make sure you are logged into Puter or try again.`,
        timestamp: Date.now(),
        isError: true,
      }
      onUpdateConversation(conversation.id, (conv) => ({
        ...conv,
        messages: [...conv.messages, errorMessage],
      }))
    } finally {
      setLoading(false)
      setStreamingContent('')
    }
  }, [conversation, loading, onUpdateConversation])

  useEffect(() => {
    const handler = (e) => {
      if (e.detail.convId === conversation.id && !pendingInitialRef.current) {
        pendingInitialRef.current = true
        sendMessage(e.detail.message)
      }
    }
    window.addEventListener('send-initial-message', handler)
    return () => window.removeEventListener('send-initial-message', handler)
  }, [conversation.id, sendMessage])

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {conversation.messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {loading && streamingContent && (
          <Message
            message={{ id: 'streaming', role: 'assistant', content: streamingContent }}
            isStreaming
          />
        )}
        {loading && !streamingContent && (
          <div className={styles.typingIndicator}>
            <div className={styles.avatar}>C</div>
            <div className={styles.dots}>
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  )
}
