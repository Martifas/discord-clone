import { useState, useEffect } from 'react'
import { socket } from '@/libs/socket'
import Channels from './Channels/Channels'
import Messages from './Messages/Messages'
import Users from './Users/Users'
import Login from './Login/Login'
import { generateAvatar } from '@/libs/avatar'

import './App.css'
import { CHAT_STATE } from '@/libs/constants'

function App() {
  const [channelList, setChannelList] = useState(null)
  const [userList, setUserList] = useState(null)
  const [activeChannelIndex, setActiveChannelIndex] = useState(0)
  const [chatState, setChatState] = useState(CHAT_STATE.LOGIN)
  const [username, setUsername] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId')

    if (storedSessionId) {
      socket.auth = { sessionId: storedSessionId }
      socket.connect()

      socket.on('session', session => {
        localStorage.setItem('sessionId', session.sessionId)
        setUsername(session.username)
        setChatState(CHAT_STATE.CHAT)
        setLoading(false)
      })

      return () => {
        socket.off('session')
      }
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    socket.on('users', users => {
      setUserList(users)
    })

    socket.on('channels', channels => {
      setChannelList(channels)
      if (channels.length > 0) {
        setActiveChannelIndex(0)
      }
    })

    socket.on('message:channel', (channelName, message) => {
      setChannelList(prevChannels =>
        prevChannels
          ? prevChannels.map(channel =>
              channel.name === channelName
                ? { ...channel, messages: [...channel.messages, message] }
                : channel,
            )
          : [],
      )
    })

    socket.on('user:join', ({ userId, username }) => {
      console.log(`[DEBUG] New user joined: ${username} (${userId})`)

      setUserList(prevUsers =>
        prevUsers
          ? [...prevUsers, { userId, username, connected: true }]
          : [{ userId, username, connected: true }],
      )
    })

    socket.on('user:connect', ({ userId }) => {
      console.log(`[DEBUG] User reconnected: ${userId}`)

      setUserList(prevUsers =>
        prevUsers
          ? prevUsers.map(user => (user.userId === userId ? { ...user, connected: true } : user))
          : [],
      )
    })

    socket.on('user:disconnect', ({ userId }) => {
      setUserList(prevUsers =>
        prevUsers
          ? prevUsers.map(user => (user.userId === userId ? { ...user, connected: false } : user))
          : [],
      )
    })

    return () => {
      socket.off('channels')
      socket.off('users')
      socket.off('user:connect')
      socket.off('message:channel')
      socket.off('user:disconnect')
      socket.off('user:join')
    }
  }, [username])

  const handleUsernameSubmit = name => {
    socket.auth = { username: name }
    socket.connect()

    socket.on('session', session => {
      localStorage.setItem('sessionId', session.sessionId)
      setUsername(session.username)
      setUserAvatar(generateAvatar(session.username))
    })

    setChatState(CHAT_STATE.CHAT)
  }

  const handleLogout = () => {
    localStorage.clear('sessionId')
    socket.disconnect()
    setChatState(CHAT_STATE.LOGIN)
  }

  const activeChannel = channelList?.[activeChannelIndex] || null

  const handleChannelSelect = channelName => {
    if (!channelList) return
    const index = channelList.findIndex(channel => channel.name === channelName)
    if (index !== -1) {
      setActiveChannelIndex(index)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (chatState === CHAT_STATE.LOGIN) {
    return (
      <div>
        <Login onUsernameSubmit={handleUsernameSubmit} />
      </div>
    )
  }

  return (
    <div className="container">
      {channelList === null ? (
        <p>Loading channels...</p>
      ) : channelList.length === 0 ? (
        <p>No channels available.</p>
      ) : (
        <>
          <Channels
            channelList={channelList}
            onSelectChannel={handleChannelSelect}
            username={username}
            onLogout={handleLogout}
          />
          <Messages channel={activeChannel} avatar={userAvatar} />
          <Users userList={userList} />
        </>
      )}
    </div>
  )
}

export default App
