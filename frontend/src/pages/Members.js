import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExpenses, getRoom } from '../services/api'

function Members() {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [expenses, setExpenses] = useState([])

  const roomCode = localStorage.getItem('roomCode')
  const roomName = localStorage.getItem('roomName')
  const memberName = localStorage.getItem('memberName')

  useEffect(() => {
    if (!roomCode) { navigate('/'); return }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const roomData = await getRoom(roomCode)
      if (roomData.success) setMembers(roomData.room.members)

      const expData = await getExpenses(roomCode)
      if (expData.success) setExpenses(expData.expenses)
    } catch (err) {
      console.log(err)
    }
  }

  const COLORS = ['#f0c040','#5be4a0','#ff6b6b','#60a5fa','#c084fc']
  const getColor = (index) => COLORS[index % COLORS.length]
  const initials = (name) => name.slice(0, 2).toUpperCase()

  const getPaid = (name) => {
    return expenses
      .filter(e => e.memberName === name)
      .reduce((s, e) => s + e.amount, 0)
  }

  const getCount = (name) => {
    return expenses.filter(e => e.memberName === name).length
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
        <div style={styles.title}>Members</div>
      </div>

      <div style={styles.scroll}>

        {/* Room Info */}
        <div style={styles.roomCard}>
          <div style={styles.roomName}>{roomName}</div>
          <div style={styles.roomCode}>Code: {roomCode}</div>
          <div style={styles.memberCount}>
            {members.length} member{members.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div style={styles.sectionTitle}>ALL MEMBERS</div>

        {/* Members List */}
        {members.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.memberCard,
              borderColor: m.name === memberName
                ? '#f0c040' : '#2e2e3a'
            }}
          >
            <div style={{
              ...styles.avatar,
              background: getColor(i)
            }}>
              {initials(m.name)}
            </div>
            <div style={styles.memberInfo}>
              <div style={styles.memberName}>
                {m.name}
                {m.name === memberName
                  ? <span style={styles.youBadge}> YOU</span>
                  : ''}
              </div>
              <div style={styles.memberMeta}>
                {getCount(m.name)} expense{getCount(m.name) !== 1 ? 's' : ''} · ₹{getPaid(m.name).toLocaleString('en-IN')} paid
              </div>
            </div>
          </div>
        ))}

        {/* Invite Button */}
        <button
          style={styles.inviteBtn}
          onClick={() => navigate('/invite')}
        >
          + Invite Roommate
        </button>

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
  roomName: {
    fontFamily: 'sans-serif',
    fontSize: '18px',
    fontWeight: '800',
    color: '#f0eeff',
    marginBottom: '4px'
  },
  roomCode: {
    fontSize: '12px',
    color: '#7a7a9a',
    marginBottom: '8px'
  },
  memberCount: {
    fontSize: '12px',
    color: '#5be4a0',
    fontWeight: '700'
  },
  sectionTitle: {
    fontSize: '11px',
    color: '#7a7a9a',
    letterSpacing: '2px',
    marginBottom: '12px'
  },
  memberCard: {
    background: '#1f1f27',
    border: '1.5px solid',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    color: '#0e0e11',
    flexShrink: 0
  },
  memberInfo: {
    flex: 1
  },
  memberName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#f0eeff',
    marginBottom: '4px'
  },
  youBadge: {
    background: 'rgba(240,192,64,0.15)',
    color: '#f0c040',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '50px',
    marginLeft: '6px'
  },
  memberMeta: {
    fontSize: '12px',
    color: '#7a7a9a'
  },
  inviteBtn: {
    width: '100%',
    padding: '16px',
    background: 'transparent',
    color: '#f0c040',
    border: '1.5px dashed #f0c040',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px'
  }
}

export default Members