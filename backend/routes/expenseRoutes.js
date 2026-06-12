const express = require('express')
const router = express.Router()
const {
  addExpense,
  getExpenses,
  getMyExpenses,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController')
//const { updateExpense } = require('../../frontend/src/services/api')

// Add new expense
router.post('/add', addExpense)

// Get all expenses of room
router.get('/:roomCode', getExpenses)

// Get one member expenses
router.get('/:roomCode/:memberName', getMyExpenses)

// Update expense
router.put('/:expenseId', updateExpense)

// Delete expense
router.delete('/:expenseId', deleteExpense)

module.exports = router