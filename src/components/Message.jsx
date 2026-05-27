import { useState } from 'react'
import { parseMarkdown } from '../utils'
import styles from './Message.module.css'

export default function Message({ message, isStreaming }) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}>
      <div className={`${styles.avatar} ${isUser ? styles.userAvatar : styles.assistantAvatar}`}>
        {isUser ? 'H' : 'C'}
      </div>
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble} ${message.isError ? styles.errorBubble : ''}`}>
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
            />
            {isStreaming && <span className={styles.cursor} />}
          </>
        )}
        {!isUser && !isStreaming && (
          <button className={styles.copyBtn} onClick={handleCopy} title="Copy">
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
