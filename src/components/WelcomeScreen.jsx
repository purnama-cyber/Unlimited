import { useState, useRef } from 'react'
import styles from './WelcomeScreen.module.css'

const SUGGESTIONS = [
  { icon: '✦', label: 'Write code', prompt: 'Help me write a function that' },
  { icon: '⊕', label: 'Analyze data', prompt: 'Analyze this data and give insights:' },
  { icon: '↗', label: 'Summarize', prompt: 'Summarize the following text:' },
  { icon: '⊙', label: 'Brainstorm', prompt: 'Help me brainstorm ideas for' },
]

export default function WelcomeScreen({ greeting, onSendMessage }) {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const textareaRef = useRef(null)

  const handleSend = async () => {
    const msg = input.trim()
    if (!msg || sending) return
    setSending(true)
    setInput('')
    onSendMessage(msg)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestion = (prompt) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.greeting}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#ff6b35">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
          </svg>
          {greeting}, Hassan
        </div>

        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            className={styles.input}
            placeholder="How can I help you today?"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <div className={styles.inputActions}>
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={!input.trim() || sending}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.suggestions}>
          {SUGGESTIONS.map((s) => (
            <button key={s.label} className={styles.suggestionBtn} onClick={() => handleSuggestion(s.prompt)}>
              <span className={styles.suggestionIcon}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.notice}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          Powered by Puter.js — AI responses use claude-sonnet-4-5 via Puter's free API
        </div>
      </div>
    </div>
  )
}
