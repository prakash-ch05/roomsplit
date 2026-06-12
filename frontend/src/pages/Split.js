import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExpenses } from '../services/api'

function Split() {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [settlements, setSettlements] = useState([])
  const [balances, setBalances] = useState([])
  const [calculated, setCalculated] = useState(false)

  const roomCode = localStorage.getItem('roomCode')
  const roomName = localStorage.getItem('roomName')
  const memberName = localStorage.getItem('memberName')

  useEffect(() => {
    if (!roomCode) { navigate('/'); return }
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    try {
      const data = await getExpenses(roomCode)
      if (data.success) setExpenses(data.expenses)
    } catch (err) {
      console.log(err)
    }
  }

  const calculateSplit = () => {
    if (!expenses.length) return

    const total = expenses.reduce((s, e) => s + e.amount, 0)
    const members = [...new Set(expenses.map(e => e.memberName))]
    const share = total / members.length

    // Paid per person
    const paid = {}
    members.forEach(m => paid[m] = 0)
    expenses.forEach(e => {
      paid[e.memberName] = (paid[e.memberName] || 0) + e.amount
    })

    // Balance = paid - share
    const balance = {}
    members.forEach(m => balance[m] = (paid[m] || 0) - share)

    // Calculate settlements
    const debtors = members
      .filter(m => balance[m] < -0.5)
      .map(m => ({ name: m, amt: -balance[m] }))
    const creditors = members
      .filter(m => balance[m] > 0.5)
      .map(m => ({ name: m, amt: balance[m] }))

    const result = []
    let i = 0, j = 0
    while (i < debtors.length && j < creditors.length) {
      const amt = Math.min(debtors[i].amt, creditors[j].amt)
      if (amt > 0.5) {
        result.push({
          from: debtors[i].name,
          to: creditors[j].name,
          amt: Math.round(amt)
        })
      }
      debtors[i].amt -= amt
      creditors[j].amt -= amt
      if (debtors[i].amt < 0.5) i++
      if (creditors[j].amt < 0.5) j++
    }

    // Member balances for display
    const balanceList = members.map(m => ({
      name: m,
      paid: paid[m] || 0,
      share: Math.round(share),
      balance: Math.round(balance[m])
    }))

    setSettlements(result)
    setBalances(balanceList)
    setCalculated(true)
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const members = [...new Set(expenses.map(e => e.memberName))]
  const perPerson = members.length ? Math.round(total / members.length) : 0

  const COLORS = ['#f0c040','#5be4a0','#ff6b6b','#60a5fa','#c084fc']
  const getColor = (name) => COLORS[members.indexOf(name) % COLORS.length]
  const initials = (name) => name.slice(0, 2).toUpperCase()

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
        <div style={styles.title}>Split</div>
      </div>

      <div style={styles.scroll}>

        {/* Total Strip */}
        <div style={styles.totalStrip}>
          <div>
            <div style={styles.totalLabel}>Total Spent</div>
            <div style={styles.totalAmount}>
              ₹{total.toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={styles.totalLabel}>Per Person</div>
            <div style={{...styles.totalAmount, fontSize:'20px'}}>
              ₹{perPerson.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          style={styles.primaryBtn}
          onClick={calculateSplit}
        >
          ⚡ Calculate Split
        </button>

        {/* Settlements */}
        {calculated && (
          <>
            <div style={styles.sectionTitle}>WHO OWES WHOM</div>
            <div style={styles.card}>
              {settlements.length === 0 ? (
                <div style={styles.settledText}>
                  ✅ Everyone is settled up!
                </div>
              ) : (
                settlements.map((s, i) => (
                  <div key={i} style={styles.settleRow}>
                    <div style={styles.settleLeft}>
                      <div style={{
                        ...styles.avatar,
                        background: getColor(s.from)
                      }}>
                        {initials(s.from)}
                      </div>
                      <span style={styles.settleName}>{s.from}</span>
                      <span style={styles.owesText}>owes</span>
                      <div style={{
                        ...styles.avatar,
                        background: getColor(s.to)
                      }}>
                        {initials(s.to)}
                      </div>
                      <span style={styles.settleName}>{s.to}</span>
                    </div>
                    <div style={styles.oweAmount}>
                      ₹{s.amt.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Member Breakdown */}
            <div style={styles.sectionTitle}>MEMBER BREAKDOWN</div>
            <div style={styles.card}>
              {balances.map((b, i) => (
                <div key={i} style={styles.memberRow}>
                  <div style={{
                    ...styles.avatar,
                    background: getColor(b.name)
                  }}>
                    {initials(b.name)}
                  </div>
                  <div style={styles.memberInfo}>
                    <div style={styles.memberName}>
                      {b.name}
                      {b.name === memberName ? ' (you)' : ''}
                    </div>
                    <div style={styles.memberMeta}>
                      Paid ₹{b.paid.toLocaleString('en-IN')} · Share ₹{b.share.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{
                    ...styles.balanceTag,
                    color: b.balance >= 0 ? '#5be4a0' : '#ff6b6b',
                    background: b.balance >= 0
                      ? 'rgba(91,228,160,0.1)'
                      : 'rgba(255,107,107,0.1)'
                  }}>
                    {b.balance >= 0 ? '+' : ''}
                    ₹{b.balance.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
  totalStrip: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#1f1f27',
    border: '1.5px solid #f0c040',
    borderRadius: '14px',
    padding: '16px 20px',
    marginBottom: '16px'
  },
  totalLabel: {
    fontSize: '11px',
    color: '#7a7a9a',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '4px'
  },
  totalAmount: {
    fontFamily: 'sans-serif',
    fontSize: '26px',
    fontWeight: '800',
    color: '#f0c040'
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
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '11px',
    color: '#7a7a9a',
    letterSpacing: '2px',
    marginBottom: '12px'
  },
  card: {
    background: '#1f1f27',
    border: '1.5px solid #2e2e3a',
    borderRadius: '14px',
    overflow: 'hidden',
    marginBottom: '24px'
  },
  settledText: {
    padding: '20px',
    textAlign: 'center',
    color: '#5be4a0',
    fontWeight: '700',
    fontSize: '15px'
  },
  settleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: '1px solid #2e2e3a'
  },
  settleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: '#0e0e11',
    flexShrink: 0
  },
  settleName: {
    fontSize: '13px',
    color: '#f0eeff'
  },
  owesText: {
    fontSize: '11px',
    color: '#7a7a9a'
  },
  oweAmount: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ff6b6b'
  },
  memberRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderBottom: '1px solid #2e2e3a'
  },
  memberInfo: {
    flex: 1
  },
  memberName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#f0eeff',
    marginBottom: '3px'
  },
  memberMeta: {
    fontSize: '11px',
    color: '#7a7a9a'
  },
  balanceTag: {
    padding: '4px 12px',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '700'
  }
}

export default Split