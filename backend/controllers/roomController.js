const Room = require('../models/Room')

// Generate random 6 digit room code
const generateCode = () => {
  return Math.random().toString(36).substr(2, 6).toUpperCase()
}

// Create new room
const createRoom = async (req, res) => {
  try {
    const { roomName, memberName } = req.body

    // Generate unique code
    const roomCode = generateCode()

    // Create room
    const room = new Room({
      roomCode,
      roomName,
      members: [{ name: memberName }]
    })

    await room.save()

    res.status(201).json({
      success: true,
      roomCode,
      roomName,
      message: 'Room created successfully'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Join existing room
const joinRoom = async (req, res) => {
  try {
    const { roomCode, memberName } = req.body

    // Find room
    const room = await Room.findOne({ roomCode })

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      })
    }

    // Check if member already exists
    const exists = room.members.find(m => m.name === memberName)

    if (!exists) {
      room.members.push({ name: memberName })
      await room.save()
    }

    res.status(200).json({
      success: true,
      roomCode: room.roomCode,
      roomName: room.roomName,
      members: room.members,
      message: 'Joined successfully'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Get room details
const getRoom = async (req, res) => {
  try {
    const { roomCode } = req.params

    const room = await Room.findOne({ roomCode })

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      })
    }

    res.status(200).json({
      success: true,
      room
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = { createRoom, joinRoom, getRoom }