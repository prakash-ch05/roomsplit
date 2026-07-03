import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { joinRoom } from '../services/api'


function JoinRoom() {
  const navigate = useNavigate()
  const [memberName, setMemberName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()

useEffect(() => {
  const code = searchParams.get('code')
  if (code) setRoomCode(code.toUpperCase())
}, [searchParams])
const handleJoin = async () => {
  if (!memberName) { setError('Enter your name'); return }
  if (!roomCode) { setError('Enter room code'); return }

  console.log('Room code being sent:', roomCode)
  console.log('Member name:', memberName)

  try {
    setLoading(true)
    const data = await joinRoom(roomCode.toUpperCase(), memberName)
    console.log('Response from server:', data)

    if (data.success) {
      localStorage.setItem('roomCode', data.roomCode)
      localStorage.setItem('roomName', data.roomName)
      localStorage.setItem('memberName', memberName)
      navigate('/home')
    } else {
      setError(data.message || 'Room not found')
    }
  } catch (err) {
    console.log('Error:', err)
    setError(err.response?.data?.message || 'Room not found')
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.backBtn}>
        ← Back
      </button>

      <h1 style={styles.title}>Join Room</h1>
      <p style={styles.subtitle}>Enter your room details</p>

      {error ? <div style={styles.error}>{error}</div> : null}

      <div style={styles.inputGroup}>
        <label style={styles.label}>YOUR NAME</label>
        <input
          style={styles.input}
          type="text"
          placeholder="e.g. Priya"
          value={memberName}
          onChange={e => setMemberName(e.target.value)}
          maxLength={20}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>ROOM CODE</label>
        <input
          style={styles.input}
          type="text"
          placeholder="e.g. AB12CD"
          value={roomCode}
          onChange={e => setRoomCode(e.target.value.toUpperCase())}
          maxLength={8}
        />
      </div>

      <button
        style={loading ? styles.btnDisabled : styles.primaryBtn}
        onClick={handleJoin}
        disabled={loading}
      >
        {loading ? 'Joining...' : 'Join Room →'}
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

export default JoinRoom