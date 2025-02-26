import { useState, useEffect } from 'react'
import { socket } from '@/libs/socket'
import Channels from './Channels/Channels'
import Messages from './Messages/Messages'
import Users from './Users/Users'

import './App.css'

function App() {
  const [channelList, setChannelList] = useState(null)
  const [userList, setUserList] = useState(null)
  const [activeChannelIndex, setActiveChannelIndex] = useState(0)

  useEffect(() => {
    socket.connect()

    socket.on('users', users => {
      setUserList(users)
    })

    socket.on('channels', channels => {
      setChannelList(channels)
      if (channels.length > 0) {
        setActiveChannelIndex(0)
      }
    })

    socket.on('user:join', user => {
      setUserList(prevUsers => [...(prevUsers || []), user])
    })

    socket.on('user:leave', user => {
      setUserList(prevUsers => prevUsers?.filter(u => u.userId !== user.userId) || [])
    })

    socket.on('user:disconnect', user => {
      setUserList(
        prevUsers =>
          prevUsers?.map(u => (u.userId === user.userId ? { ...u, connected: false } : u)) || [],
      )
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
      socket.off('users')
      socket.off('user:join')
      socket.off('user:leave')
      socket.off('user:disconnect')
      socket.off('channels')
      socket.off('message:channel')
      socket.off('disconnect')
      socket.off('connect')
    }
  }, [])

  const activeChannel = channelList?.[activeChannelIndex] || null

  const handleChannelSelect = channelName => {
    if (!channelList) return
    const index = channelList.findIndex(channel => channel.name === channelName)
    if (index !== -1) {
      setActiveChannelIndex(index)
    }
  }

  return (
    <div className="container">
      {channelList === null ? (
        <p>Loading channels...</p>
      ) : channelList.length === 0 ? (
        <p>No channels available.</p>
      ) : (
        <>
          <Channels channelList={channelList} onSelectChannel={handleChannelSelect} />
          <Messages channel={activeChannel} />
          <Users userList={userList} />
        </>
      )}
    </div>
  )
}

export default App
