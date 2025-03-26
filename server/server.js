


const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())

// Serve React build
// app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Simple FAQ-based bot logic
const faqBot = (text) => {
  const msg = text.toLowerCase()
  if (msg.includes('hello') || msg.includes('hi')) return 'Hi there! How can I assist you today?'
  if (msg.includes('how are you')) return "I'm just code, but I'm functioning perfectly! 😄"
  if (msg.includes('your name')) return "I'm ChatBot 1.0, your virtual assistant."
  if (msg.includes('help')) return 'You can ask me about my name, say hello, or ask how I am.'
  return "I'm not sure how to respond to that yet. Try asking something else!"
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('send_message', (data) => {
    const botText = faqBot(data.text)
    const botReply = { text: botText, sender: 'Bot' }
    socket.emit('receive_message', botReply)
    socket.broadcast.emit('receive_message', data)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
// })

server.listen(5000, () => {
  console.log('Server running on port 5000')
})
