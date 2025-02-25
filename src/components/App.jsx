import { useState, useEffect } from 'react'
import { socket } from '@/libs/socket'
import Channels from './Channels/Channels'
import Messages from './Messages/Messages'

import './App.css'

function App() {
  const [channelList, setChannelList] = useState(null)
  const [activeChannelIndex, setActiveChannelIndex] = useState(0)

  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      console.log('✅ Connected to server! ID:', socket.id)
    })

    socket.on('channels', channels => {
      setChannelList(channels)
      if (channels.length > 0) {
        setActiveChannelIndex(0)
      }
    })

    socket.on('connect_error', err => {
      console.error('❌ Connection error:', err)
    })

    socket.on('disconnect', () => {
      console.warn('⚠️ Disconnected from server!')
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
        </>
      )}
    </div>
  )
}

export default App
