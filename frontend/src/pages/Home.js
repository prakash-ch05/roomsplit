import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyExpenses, getExpenses, addExpense, updateExpense, deleteExpense } from '../services/api'
import socket from '../services/socket'

function Home() {
  const navigate = useNavigate()
  const [viewAll, setViewAll] = useState(false)
  const [myExpenses, setMyExpenses] = useState([])
  const [allExpenses, setAllExpenses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [editDescription, setEditDescription] = useState('')
  const [editAmount, setEditAmount] = useState('')

  const roomCode = localStorage.getItem('roomCode')
  const memberName = localStorage.getItem('memberName')
  const roomName = localStorage.getItem('roomName')

  // If not logged in go to welcome
  useEffect(() => {
    if (!roomCode || !memberName) {
      navigate('/')
    }
  }, [roomCode, memberName, navigate])

  // Load expenses on start
  useEffect(() => {
    loadMyExpenses()
    loadAllExpenses()

    // Join socket room
    socket.emit('join-room', roomCode)

    // Listen for new expenses
    socket.on('new-expense', (expense) => {
      setAllExpenses(prev => [expense, ...prev])
      if (expense.memberName === memberName) {
        setMyExpenses(prev => [expense, ...prev])
      }
    })

    socket.on('update-expense', (expense) => {
  setAllExpenses(prev =>
    prev.map(e => e._id === expense._id ? expense : e)
  )
  if (expense.memberName === memberName) {
    setMyExpenses(prev =>
      prev.map(e => e._id === expense._id ? expense : e)
    )
  }
})

socket.on('delete-expense', (expenseId) => {
  setAllExpenses(prev => prev.filter(e => e._id !== expenseId))
  setMyExpenses(prev => prev.filter(e => e._id !== expenseId))
})
  return () => {
  socket.off('new-expense')
  socket.off('update-expense')
  socket.off('delete-expense')
}
  }, [])

  const loadMyExpenses = async () => {
    try {
      const data = await getMyExpenses(roomCode, memberName)
      if (data.success) setMyExpenses(data.expenses)
    } catch (err) {
      console.log(err)
    }
  }

  const loadAllExpenses = async () => {
    try {
      const data = await getExpenses(roomCode)
      if (data.success) setAllExpenses(data.expenses)
    } catch (err) {
      console.log(err)
    }
  }

  const handleAddExpense = async () => {
    if (!description) { setError('Enter description'); return }
    if (!amount || amount <= 0) { setError('Enter valid amount'); return }

    try {
      setLoading(true)
      const data = await addExpense(roomCode, memberName, description, Number(amount))
      if (data.success) {
        setDescription('')
        setAmount('')
        setError('')
        setShowModal(false)
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleLongPress = (exp) => {
  if (exp.memberName !== memberName) return
  setSelectedExpense(exp)
  setShowActionModal(true)
}

const handleEdit = () => {
  setEditDescription(selectedExpense.description)
  setEditAmount(selectedExpense.amount.toString())
  setShowActionModal(false)
  setShowEditModal(true)
}

const handleUpdate = async () => {
  if (!editDescription) { setError('Enter description'); return }
  if (!editAmount || editAmount <= 0) { setError('Enter valid amount'); return }
  try {
    setLoading(true)
    const data = await updateExpense(
      selectedExpense._id,
      editDescription,
      Number(editAmount)
    )
    if (data.success) {
      setShowEditModal(false)
      setSelectedExpense(null)
      setError('')
    }
  } catch (err) {
    setError('Something went wrong')
  } finally {
    setLoading(false)
  }
}

const handleDelete = async () => {
  try {
    setLoading(true)
    const data = await deleteExpense(selectedExpense._id)
    if (data.success) {
      setShowActionModal(false)
      setSelectedExpense(null)
    }
  } catch (err) {
    console.log(err)
  } finally {
    setLoading(false)
  }
}

let pressTimer = null
const onTouchStart = (exp) => {
  pressTimer = setTimeout(() => handleLongPress(exp), 600)
}
const onTouchEnd = () => {
  clearTimeout(pressTimer)
}

  const myTotal = myExpenses.reduce((sum, e) => sum + e.amount, 0)

  const COLORS = ['#f0c040','#5be4a0','#ff6b6b','#60a5fa','#c084fc']
  const getColor = (name) => {
    const allNames = [...new Set(allExpenses.map(e => e.memberName))]
    return COLORS[allNames.indexOf(name) % COLORS.length] || '#888'
  }

  const initials = (name) => name.slice(0, 2).toUpperCase()

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short'
    })
  }

  return (
    <div style={styles.container}>
    {/* Header */}
<div style={styles.header}>
  <button
    onClick={() => {
      const confirm =window.confirm('Leave Room? You will need to rejoin.')
      if (confirm){
      localStorage.clear()
      navigate('/')
      }
    }}
    style={styles.backBtn}
  >
    ←
  </button>
  <div style={{flex:1}}>
    <div style={styles.roomName}>{roomName}</div>
    <div style={styles.codeBadge}>Code: {roomCode}</div>
  </div>
     <button
  style={styles.toggleBtn}
  onClick={() => setViewAll(!viewAll)}
>
  {viewAll ? '👤' : '👥'}
</button>
<button
  style={styles.toggleBtn}
  onClick={() => navigate('/members')}
>
  👨‍👩‍👧
</button>
   </div>

      {/* View Label */}
      <div style={styles.viewLabel}>
        {viewAll
          ? '🔒 All Expenses — Read Only'
          : `Hi ${memberName} 👋 — My Expenses`}
      </div>

      {/* Expense List */}
      <div style={styles.listContainer}>
        {viewAll ? (
          allExpenses.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🧾</div>
              <div>No expenses yet</div>
            </div>
          ) : (
            allExpenses.map(exp => (
              <div key={exp._id} style={styles.expenseRow}>
                <div style={{
                  ...styles.avatar,
                  background: getColor(exp.memberName)
                }}>
                  {initials(exp.memberName)}
                </div>
                <div style={styles.expenseInfo}>
                  <div style={styles.expenseDesc}>{exp.description}</div>
                  <div style={styles.expenseMeta}>
                    {exp.memberName} · {formatDate(exp.date)}
                  </div>
                </div>
                <div style={styles.expenseAmount}>
                  ₹{exp.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )
        ) : (
          myExpenses.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>💸</div>
              <div>No expenses yet.<br/>Tap + to add one!</div>
            </div>
          ) : (
            myExpenses.map(exp => (
           <div
           key={exp._id}
           style={styles.expenseRow}
           onTouchStart={() => onTouchStart(exp)}
           onTouchEnd={onTouchEnd}
           onMouseDown={() => onTouchStart(exp)}
          onMouseUp={onTouchEnd}
  >
                <div style={{
                  ...styles.avatar,
                  background: getColor(memberName)
                }}>
                  {initials(memberName)}
                </div>
                <div style={styles.expenseInfo}>
                  <div style={styles.expenseDesc}>{exp.description}</div>
                  <div style={styles.expenseMeta}>
                    {formatDate(exp.date)}
                  </div>
                </div>
                <div style={styles.expenseAmount}>
                  ₹{exp.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* My Total — only on my view */}
{!viewAll && (
  <div style={styles.totalStrip}>
    <div>
      <div style={styles.totalLabel}>My Total Paid</div>
      <div style={styles.totalAmount}>
        ₹{myTotal.toLocaleString('en-IN')}
      </div>
    </div>
    <button
      style={styles.splitBtn}
      onClick={() => navigate('/split')}
    >
      ⚡ Split
    </button>
  </div>
)}

      {/* Add Button — only on my view */}
      {!viewAll && (
        <button
          style={styles.addBtn}
          onClick={() => setShowModal(true)}
        >
          +
        </button>
      )}
        

        {/* Action Modal — Long Press */}
{showActionModal && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <div style={styles.modalTitle}>
        {selectedExpense?.description}
      </div>
      <div style={{fontSize:'24px', fontWeight:'800', color:'#5be4a0', marginBottom:'20px'}}>
        ₹{selectedExpense?.amount.toLocaleString('en-IN')}
      </div>
      <button style={styles.editBtn} onClick={handleEdit}>
        ✏️ Edit Expense
      </button>
      <button style={styles.deleteBtn} onClick={handleDelete}>
        🗑️ Delete Expense
      </button>
      <button
        style={styles.cancelBtn}
        onClick={() => {
          setShowActionModal(false)
          setSelectedExpense(null)
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}

{/* Edit Modal */}
{showEditModal && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <div style={styles.modalTitle}>Edit Expense</div>
      {error ? <div style={styles.error}>{error}</div> : null}
      <div style={styles.inputGroup}>
        <label style={styles.label}>DESCRIPTION</label>
        <input
          style={styles.input}
          type="text"
          value={editDescription}
          onChange={e => setEditDescription(e.target.value)}
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>AMOUNT (₹)</label>
        <input
          style={styles.input}
          type="number"
          value={editAmount}
          onChange={e => setEditAmount(e.target.value)}
          min="1"
        />
      </div>
      <div style={styles.modalBtns}>
        <button
          style={loading ? styles.btnDisabled : styles.primaryBtn}
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          style={styles.cancelBtn}
          onClick={() => {
            setShowEditModal(false)
            setError('')
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)} 
      {/* Add Expense Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalTitle}>Add Expense</div>
            <div style={styles.myNameBadge}>You: {memberName}</div>

            {error ? <div style={styles.error}>{error}</div> : null}

            <div style={styles.inputGroup}>
              <label style={styles.label}>DESCRIPTION</label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Electricity bill"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>AMOUNT (₹)</label>
              <input
                style={styles.input}
                type="number"
                placeholder="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="1"
              />
            </div>

            <div style={styles.modalBtns}>
              <button
                style={loading ? styles.btnDisabled : styles.primaryBtn}
                onClick={handleAddExpense}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Expense'}
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => {
                  setShowModal(false)
                  setError('')
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container:{
     minHeight:'100vh',
     background:'#0e0e11',
     width:'100%',
     display:'flex',
     flexDirection:'column', 
     position:'relative'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 20px 12px',
    borderBottom: '1px solid #2e2e3a'
  },
  roomName: {
    fontFamily: 'sans-serif',
    fontSize: '20px',
    fontWeight: '800',
    color: '#f0c040'
  },
  codeBadge: {
    fontSize: '11px',
    color: '#7a7a9a',
    marginTop: '4px'
  },
  backBtn: {
  background: 'none',
  border: 'none',
  color: '#7a7a9a',
  fontSize: '22px',
  cursor: 'pointer',
  padding: '0',
  marginRight: '12px'
},
  toggleBtn: {
    background: '#1f1f27',
    border: '1.5px solid #2e2e3a',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:'10px'
  },
  viewLabel: {
    padding: '12px 20px',
    fontSize: '13px',
    color: '#7a7a9a',
    borderBottom: '1px solid #2e2e3a'
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 20px 100px'
  },
  expenseRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 0',
    borderBottom: '1px solid #1f1f27'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    color: '#0e0e11',
    flexShrink: 0
  },
  expenseInfo: {
    flex: 1
  },
  expenseDesc: {
    fontSize: '14px',
    color: '#f0eeff',
    marginBottom: '3px'
  },
  expenseMeta: {
    fontSize: '11px',
    color: '#7a7a9a'
  },
  expenseAmount: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#5be4a0',
    whiteSpace: 'nowrap'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#7a7a9a',
    fontSize: '14px',
    lineHeight: '1.8'
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '12px'
  },
  totalStrip: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: '#1f1f27',
    borderTop: '1px solid #2e2e3a',
    position: 'sticky',
    bottom: '0'
  },
  splitBtn: {
  padding: '10px 20px',
  background: '#f0c040',
  color: '#0e0e11',
  border: 'none',
  borderRadius: '50px',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer'
},
  totalLabel: {
    fontSize: '12px',
    color: '#7a7a9a',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  totalAmount: {
    fontFamily: 'sans-serif',
    fontSize: '22px',
    fontWeight: '800',
    color: '#f0c040'
  },
  addBtn: {
  position: 'fixed',
  bottom: '80px',
  right: '20px',
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: '#f0c040',
  color: '#0e0e11',
  fontSize: '32px',
  fontWeight: '400',
  lineHeight: '1',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 4px 20px rgba(240,192,64,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: '100'
},
  modalOverlay: {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: '200'
  },
  modal: {
    background: '#17171c',
    borderRadius: '20px 20px 0 0',
    padding: '24px 20px 40px',
    width: '100%',
    maxWidth: '420px'
  },
  modalTitle: {
    fontFamily: 'sans-serif',
    fontSize: '20px',
    fontWeight: '800',
    color: '#f0eeff',
    marginBottom: '16px'
  },
  myNameBadge: {
    background: 'rgba(240,192,64,0.1)',
    border: '1.5px solid #f0c040',
    borderRadius: '50px',
    padding: '8px 20px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#f0c040',
    textAlign: 'center',
    marginBottom: '20px'
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
    marginBottom: '16px'
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
  modalBtns: {
    display: 'flex',
    gap: '10px',
    marginTop: '8px'
  },
  primaryBtn: {
    flex: 1,
    padding: '14px',
    background: '#f0c040',
    color: '#0e0e11',
    border: 'none',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  btnDisabled: {
    flex: 1,
    padding: '14px',
    background: '#2e2e3a',
    color: '#7a7a9a',
    border: 'none',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'not-allowed'
  },
  cancelBtn: {
    flex: 0.5,
    padding: '14px',
    background: '#1f1f27',
    color: '#f0eeff',
    border: '1.5px solid #2e2e3a',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  editBtn: {
  width: '100%',
  padding: '14px',
  background: '#1f1f27',
  color: '#f0eeff',
  border: '1.5px solid #2e2e3a',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: '700',
  cursor: 'pointer',
  marginBottom: '10px'
},
deleteBtn: {
  width: '100%',
  padding: '14px',
  background: 'rgba(255,107,107,0.1)',
  color: '#ff6b6b',
  border: '1.5px solid #ff6b6b',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: '700',
  cursor: 'pointer',
  marginBottom: '10px'
}
}

export default Home