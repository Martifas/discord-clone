import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import process from 'process'

import { generateRandomId } from './server/utils.mjs'
import { initializeStore } from './server/sessions.mjs'
import { initializeChannel } from './server/channels.mjs'
import { buildMessage } from './server/messages.mjs'

const app = express()

const server = http.createServer(app)
const port = process.env.PORT || 8181

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:4173', 'https://piehost.com'],
  },
})

const CHANNEL_NAMES = ['welcome', 'general', 'react', 'learners', 'casual']
const WELCOME_CHANNEL = 'welcome'

const sessions = initializeStore()
const channels = CHANNEL_NAMES.map(channel => initializeChannel(channel))

// Custom middleware to prepare the session.
io.use(async (socket, next) => {
  const sessionId = socket.handshake.auth.sessionId
  const username = socket.handshake.auth.username

  if (sessionId) {
    const session = sessions.getSessionById(sessionId)

    if (session) {
      socket.sessionId = sessionId
      socket.userId = session.userId
      socket.username = session.username
      return next()
    }
  }

  if (username) {
    const existingSession = sessions.getSessionByUsername(username)

    if (existingSession) {
      socket.sessionId = existingSession.sessionId
      socket.userId = existingSession.userId
      socket.username = existingSession.username
      return next()
    }
  }

  socket.sessionId = generateRandomId()
  socket.userId = generateRandomId()
  socket.username = username ? username : `anonymous_${generateRandomId(2)}`

  next()
})

io.on('connection', socket => {
  const userSession = sessions.getSessionByUserId(socket.userId)

  const currentSession = {
    sessionId: socket.sessionId,
    userId: socket.userId,
    username: socket.username,
    connected: true,
  }

  sessions.setSession(socket.sessionId, currentSession)
  socket.emit('session', currentSession)

  socket.broadcast.emit('user:connect', {
    userId: currentSession.userId,
    username: currentSession.username,
    connected: false,
  })

  channels.forEach(channel => socket.join(channel.name))
  socket.join(currentSession.userId)

  if (!userSession) {
    socket.in(WELCOME_CHANNEL).emit('user:join', {
      userId: currentSession.userId,
      username: currentSession.username,
      connected: true,
    })
  }

  socket.emit('channels', channels)
  socket.emit('users', sessions.getAllUsers())

  socket.on('user:leave', () => {
    socket.in(WELCOME_CHANNEL).emit('user:leave', {
      userId: currentSession.userId,
      username: currentSession.username,
      connected: false,
    })

    sessions.deleteSession(socket.sessionId)
    socket.disconnect()
  })

  socket.on('message:channel:send', (channel, message) => {
    const registeredChannel = channels.find(it => it.name === channel)

    if (!registeredChannel) return

    const builtMessage = buildMessage(currentSession, message)

    registeredChannel.messages.push(builtMessage)

    socket.to(channel).emit('message:channel', channel, builtMessage)
    socket.emit('message:channel', channel, builtMessage)
  })

  socket.on('disconnect', () => {
    const session = sessions.getSessionById(socket.sessionId)

    if (!session) return

    

    sessions.setSession(socket.sessionId, {
      ...session,
      connected: false,
    })

    socket.broadcast.emit('user:disconnect', {
      userId: session.userId,
      username: session.username,
      connected: false,
    })
  })
})

server.listen(port, () => {
  console.log('Server listening at port %d', port)
})
