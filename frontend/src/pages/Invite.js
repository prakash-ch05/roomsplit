import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Invite() {
  const navigate = useNavigate()

  const roomCode = localStorage.getItem('roomCode')
  const roomName = localStorage.getItem('roomName')

  useEffect(() => {
    if (!roomCode) { navigate('/'); return }
  }, [])

  const inviteLink = `http://localhost:3000/join?code=${roomCode}`

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    alert('Link copied!')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode)
    alert('Code copied!')
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => navigate('/home')}
          style={styles.backBtn}
        >
          ←
        </button>
        <div style={styles.title}>Invite</div>
      </div>

      <div style={styles.scroll}>

        {/* Room Name */}
        <div style={styles.roomCard}>
          <div style={styles.roomLabel}>ROOM NAME</div>
          <div style={styles.roomName}>{roomName}</div>
        </div>

        {/* Room Code */}
        <div style={styles.sectionTitle}>ROOM CODE</div>
        <div style={styles.codeCard}>
          <div style={styles.codeText}>{roomCode}</div>
          <button
            style={styles.copyBtn}
            onClick={copyCode}
          >
            Copy
          </button>
        </div>

        {/* Instructions */}
        <div style={styles.sectionTitle}>HOW TO INVITE</div>
        <div style={styles.stepsCard}>
          <div style={styles.step}>
            <div style={styles.stepNum}>1</div>
            <div style={styles.stepText}>
              Copy the room code above
            </div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNum}>2</div>
            <div style={styles.stepText}>
              Share it on your WhatsApp group
            </div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNum}>3</div>
            <div style={styles.stepText}>
              Roommate opens app → Join Room → enters code
            </div>
          </div>
        </div>

        {/* Share Link */}
        <div style={styles.sectionTitle}>OR SHARE LINK</div>
        <div style={styles.linkBox}>
          <div style={styles.linkText}>{inviteLink}</div>
        </div>
        <button
          style={styles.primaryBtn}
          onClick={copyLink}
        >
          📋 Copy Invite Link
        </button>

        {/* WhatsApp Share */}
        <a
          href={`https://wa.me/?text=Join my RoomSplit room! Code: ${roomCode} Link: ${inviteLink}`}
          target="_blank"
          rel="noreferrer"
          style={styles.whatsappBtn}
        >
          💬 Share on WhatsApp
        </a>

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0e0e11',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px 20px 12px',
    borderBottom: '1px solid #2e2e3a'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#f0c040',
    fontSize: '28px',
    cursor: 'pointer',
    padding: '0',
    marginRight: '12px',
    lineHeight: '1',
    fontWeight: '700'
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: '20px',
    fontWeight: '800',
    color: '#f0c040'
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px'
  },
  roomCard: {
    background: '#1f1f27',
    border: '1.5px solid #2e2e3a',
    borderRadius: '14px',
    padding: '16px 20px',
    marginBottom: '24px'
  },
  roomLabel: {
    fontSize: '11px',
    color: '#7a7a9a',
    letterSpacing: '1.5px',
    marginBottom: '6px'
  },
  roomName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f0eeff'
  },
  sectionTitle: {
    fontSize: '11px',
    color: '#7a7a9a',
    letterSpacing: '2px',
    marginBottom: '12px'
  },
  codeCard: {
    background: '#1f1f27',
    border: '1.5px solid #2e2e3a',
    borderRadius: '14px',
    padding: '16px 20px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: '32px',
    fontWeight: '800',
    color: '#f0c040',
    letterSpacing: '8px'
  },
  copyBtn: {
    background: '#f0c040',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#0e0e11',
    cursor: 'pointer'
  },
  stepsCard: {
    background: '#1f1f27',
    border: '1.5px solid #2e2e3a',
    borderRadius: '14px',
    padding: '16px 20px',
    marginBottom: '24px'
  },
  step: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '14px'
  },
  stepNum: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#f0c040',
    color: '#0e0e11',
    fontSize: '12px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  stepText: {
    fontSize: '13px',
    color: '#f0eeff',
    lineHeight: '1.6'
  },
  linkBox: {
    background: '#1f1f27',
    border: '1.5px dashed #2e2e3a',
    borderRadius: '14px',
    padding: '14px 16px',
    marginBottom: '12px',
    wordBreak: 'break-all'
  },
  linkText: {
    fontSize: '12px',
    color: '#7a7a9a'
  },
  primaryBtn: {
    width: '100%',
    padding: '16px',
    background: '#f0c040',
    color: '#0e0e11',
    border: 'none',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '12px'
  },
  whatsappBtn: {
    display: 'block',
    width: '100%',
    padding: '16px',
    background: '#25D366',
    color: '#ffffff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    boxSizing: 'border-box'
  }
}

export default Invite