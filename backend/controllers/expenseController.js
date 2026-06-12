const Expense = require('../models/Expense')

// Add expense
const addExpense = async (req, res) => {
  try {
    const { roomCode, memberName, description, amount } = req.body

    const expense = new Expense({
      roomCode,
      memberName,
      description,
      amount
    })

    await expense.save()

    // Emit to all users in room via socket
    req.io.to(roomCode).emit('new-expense', expense)

    res.status(201).json({
      success: true,
      expense,
      message: 'Expense added'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Get all expenses of a room
const getExpenses = async (req, res) => {
  try {
    const { roomCode } = req.params

    const expenses = await Expense.find({ roomCode })
      .sort({ date: -1 })

    res.status(200).json({
      success: true,
      expenses
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Get expenses of one member
const getMyExpenses = async (req, res) => {
  try {
    const { roomCode, memberName } = req.params

    const expenses = await Expense.find({
      roomCode,
      memberName
    }).sort({ date: -1 })

    res.status(200).json({
      success: true,
      expenses
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Update expense
const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params
    const { description, amount } = req.body

    const expense = await Expense.findByIdAndUpdate(
      expenseId,
      { description, amount },
      { new: true }
    )

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    req.io.to(expense.roomCode).emit('update-expense', expense)

    res.status(200).json({
      success: true,
      expense,
      message: 'Expense updated'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params

    const expense = await Expense.findByIdAndDelete(expenseId)

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    req.io.to(expense.roomCode).emit('delete-expense', expenseId)

    res.status(200).json({
      success: true,
      message: 'Expense deleted'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = { addExpense, getExpenses, getMyExpenses,updateExpense,deleteExpense}