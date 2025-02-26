import { useState, useEffect } from 'react'
import { socket } from '@/libs/socket'
import Channels from './Channels/Channels'
import Messages from './Messages/Messages'
import Users from './Users/Users'
import Login from './Login/Login'

import './App.css'
import { CHAT_STATE } from '@/libs/constants'

function App() {
  const [channelList, setChannelList] = useState(null)
  const [userList, setUserList] = useState(null)
  const [activeChannelIndex, setActiveChannelIndex] = useState(0)
  const [chatState, setChatState] = useState(CHAT_STATE.LOGIN)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true) // New loading state

  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId')

    if (storedSessionId) {
      socket.auth = { sessionId: storedSessionId }
      socket.connect()

      socket.on('session', session => {
        localStorage.setItem('sessionId', session.sessionId)
        setUsername(session.username)
        setChatState(CHAT_STATE.CHAT)
        setLoading(false) // Done loading
      })

      return () => {
        socket.off('session')
      }
    }

    setLoading(false) // If no session, show login form
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

    return () => {
      socket.off('channels')
      socket.off('users')
      socket.off('message:channel')
    }
  }, [])

  const handleUsernameSubmit = name => {
    socket.auth = { username: name }
    socket.connect()

    socket.on('session', session => {
      localStorage.setItem('sessionId', session.sessionId)
      setUsername(session.username)
    })

    setChatState(CHAT_STATE.CHAT)
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
    return <p>Loading...</p> // Prevent flashing login form
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
          <Channels channelList={channelList} onSelectChannel={handleChannelSelect} username={username} />
          <Messages channel={activeChannel} />
          <Users userList={userList} />
        </>
      )}
    </div>
  )
}

export default App
