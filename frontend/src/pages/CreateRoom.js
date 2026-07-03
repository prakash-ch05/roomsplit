import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoom } from '../services/api'

function CreateRoom() {
  const navigate = useNavigate()
  const [roomName, setRoomName] = useState('')
  const [memberName, setMemberName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!roomName) { setError('Enter room name'); return }
    if (!memberName) { setError('Enter your name'); return }

    try {
      setLoading(true)
      const data = await createRoom(roomName, memberName)

      if (data.success) {
        // Save to localStorage
        localStorage.setItem('roomCode', data.roomCode)
        localStorage.setItem('roomName', data.roomName)
        localStorage.setItem('memberName', memberName)

        // Go to home screen
        navigate('/home')
      }
    } catch (err) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>
        ← Back
      </button>

      <h1 style={styles.title}>Create Room</h1>
      <p style={styles.subtitle}>Set up your shared room</p>

      {error ? <div style={styles.error}>{error}</div> : null}

      <div style={styles.inputGroup}>
        <label style={styles.label}>ROOM NAME</label>
        <input
          style={styles.input}
          type="text"
          placeholder="e.g. 201 Sunrise Apartments"
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
          maxLength={40}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>YOUR NAME</label>
        <input
          style={styles.input}
          type="text"
          placeholder="e.g. Rahul"
          value={memberName}
          onChange={e => setMemberName(e.target.value)}
          maxLength={20}
        />
      </div>

      <button
        style={loading ? styles.btnDisabled : styles.primaryBtn}
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Room →'}
      </button>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0e0e11',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#7a7a9a',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '24px',
    textAlign: 'left',
    padding: '0'
  },
  title: {
    fontFamily: 'sans-serif',
    fontSize: '28px',
    fontWeight: '800',
    color: '#f0c040',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: '#7a7a9a',
    fontSize: '13px',
    marginBottom: '32px'
  },
  error: {
    background: 'rgba(255,107,107,0.1)',
    border: '1px solid #ff6b6b',
    color: '#ff6b6b',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '13px',
    marginBottom: '16px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '11px',
    color: '#7a7a9a',
    letterSpacing: '1.5px',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '14px',
    background: '#1f1f27',
    border: '1.5px solid #2e2e3a',
    borderRadius: '14px',
    color: '#f0eeff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  primaryBtn: {
    width: '100%',
    padding: '16px',
    background: '#f0c040',
    color: '#0e0e11',
    border: 'none',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px'
  },
  btnDisabled: {
    width: '100%',
    padding: '16px',
    background: '#2e2e3a',
    color: '#7a7a9a',
    border: 'none',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'not-allowed',
    marginTop: '8px'
  }
}

export default CreateRoom