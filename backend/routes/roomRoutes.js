const express = require('express')
const router = express.Router()
const {
  createRoom,
  joinRoom,
  getRoom
} = require('../controllers/roomController')

// Create new room
router.post('/create', createRoom)

// Join existing room
router.post('/join', joinRoom)

// Get room details
router.get('/:roomCode', getRoom)

module.exports = router