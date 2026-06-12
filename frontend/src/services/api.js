import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL

// Room APIs
export const createRoom = async (roomName, memberName) => {
  const res = await axios.post(`${BASE_URL}/rooms/create`, {
    roomName,
    memberName
  })
  return res.data
}

export const joinRoom = async (roomCode, memberName) => {
  const res = await axios.post(`${BASE_URL}/rooms/join`, {
    roomCode,
    memberName
  })
  return res.data
}

export const getRoom = async (roomCode) => {
  const res = await axios.get(`${BASE_URL}/rooms/${roomCode}`)
  return res.data
}

// Expense APIs
export const addExpense = async (roomCode, memberName, description, amount) => {
  const res = await axios.post(`${BASE_URL}/expenses/add`, {
    roomCode,
    memberName,
    description,
    amount
  })
  return res.data
}

export const getExpenses = async (roomCode) => {
  const res = await axios.get(`${BASE_URL}/expenses/${roomCode}`)
  return res.data
}

export const getMyExpenses = async (roomCode, memberName) => {
  const res = await axios.get(`${BASE_URL}/expenses/${roomCode}/${memberName}`)
  return res.data
}
// Update expense
export const updateExpense = async (expenseId, description, amount) => {
  const res = await axios.put(`${BASE_URL}/expenses/${expenseId}`, {
    description,
    amount
  })
  return res.data
}

// Delete expense
export const deleteExpense = async (expenseId) => {
  const res = await axios.delete(`${BASE_URL}/expenses/${expenseId}`)
  return res.data
}