import styles from './Sidebar.module.css'

export default function Sidebar({ conversations, activeConversationId, onNewChat, onSelectConversation, greeting }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Claude
        </div>
        <button className={styles.newChatBtn} onClick={onNewChat}>
          <span className={styles.plusIcon}>+</span>
          New chat
        </button>
      </div>

      <div className={styles.nav}>
        <div className={styles.navItem}>
          <svg className={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
          Chats
        </div>
        <div className={styles.navItem}>
          <svg className={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Projects
        </div>
        <div className={styles.navItem}>
          <svg className={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Artifacts
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionTitle}>Recents</div>
        <div className={styles.recentList}>
          {conversations.length === 0 ? (
            <div className={styles.emptyState}>No recent conversations</div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                className={`${styles.recentItem} ${conv.id === activeConversationId ? styles.active : ''}`}
                onClick={() => onSelectConversation(conv.id)}
              >
                {conv.title}
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>H</div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>Hassan</div>
            <div className={styles.userPlan}>Pro plan</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.5 }}>
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
