const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const socketio = require('socket.io')
require('dotenv').config()

const roomRoutes = require('./routes/roomRoutes')
const expenseRoutes = require('./routes/expenseRoutes')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: { origin: '*' }
})

// Middleware
app.use(cors())
app.use(express.json())

// Pass socket to controllers
app.use((req, res, next) => {
  req.io = io
  next()
})

// Routes
app.use('/api/rooms', roomRoutes)
app.use('/api/expenses', expenseRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'RoomSplit server is running!' })
})

// MongoDB connection
//mongoose.connect(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('DB Error:', err))
// mongoose.connect(process.env.MONGO_URI,{
//   serverSelectionTimeoutMS:30000,
//   socketTimeoutMS:45000,
//   family:4
// })
// .then(()=>console.log('MongoDB connected'))
// .catch(err=>console.log('DB Error:',err.message))
// Socket connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  socket.on('join-room', (roomCode) => {
    socket.join(roomCode)
    console.log(`User joined room: ${roomCode}`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})