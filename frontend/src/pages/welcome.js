import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Welcome() {
  const navigate = useNavigate()
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    const roomCode = localStorage.getItem('roomCode')
    const memberName = localStorage.getItem('memberName')
    if (roomCode && memberName) {
      navigate('/home')
      return
    }

    // Detect device
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    const android = /android/.test(navigator.userAgent.toLowerCase())
    setIsIOS(ios)
    setIsAndroid(android)
  }, [navigate])

  const handleIOSInstall = () => {
    alert('📲 Install RoomSplit:\n\n1. Tap Share button at bottom\n2. Tap "Add to Home Screen"\n3. Tap "Add"\n\nDone! Opens like a real app ✅')
  }

  return (
    <div style={styles.container}>
      <div style={styles.emoji}>🏠</div>
      <h1 style={styles.title}>RoomSplit</h1>
      <p style={styles.tagline}>Shared expenses · Zero drama</p>

      <div style={styles.buttonContainer}>
        <button
          style={styles.primaryBtn}
          onClick={() => navigate('/create')}
        >
          🏠 Create a Room
        </button>
        <button
          style={styles.secondaryBtn}
          onClick={() => navigate('/join')}
        >
          🔗 Join a Room
        </button>

        {/* Android - APK Download */}
        {isAndroid && (
          <a
            href="https://drive.google.com/uc?export=download&id=1HCp9wbVuKxiLLnLWWc7nj9HfvGiO65sb"
            style={styles.downloadBtn}
          >
            📲 Download App (Android)
          </a>
        )}

        {/* iPhone - Install Instructions */}
        {isIOS && (
          <button
            style={styles.installBtn}
            onClick={handleIOSInstall}
          >
            📲 Install App (iPhone)
          </button>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0e0e11',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px'
  },
  emoji: {
    fontSize: '72px',
    marginBottom: '16px'
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: '36px',
    fontWeight: '800',
    color: '#f0c040',
    margin: '0 0 8px 0'
  },
  tagline: {
    color: '#7a7a9a',
    fontSize: '14px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '48px'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '320px'
  },
  primaryBtn: {
    padding: '16px',
    background: '#f0c040',
    color: '#0e0e11',
    border: 'none',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  secondaryBtn: {
    padding: '16px',
    background: 'transparent',
    color: '#f0f0f0',
    border: '1.5px solid #2e2e3a',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  downloadBtn: {
    display: 'block',
    padding: '16px',
    background: '#1f1f27',
    color: '#5be4a0',
    border: '1.5px solid #5be4a0',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none'
  },
  installBtn: {
    padding: '16px',
    background: '#1f1f27',
    color: '#5be4a0',
    border: '1.5px solid #5be4a0',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer'
  }
}

export default Welcome
