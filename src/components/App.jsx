import { useState, useEffect } from 'react'
import { socket } from '@/libs/socket'
import Channels from './Channels/Channels'
import Messages from './Messages/Messages'
import { initializeChannel } from '../../server/channels.mjs'

import './App.css'

function App() {
  const [channelList, setChannelList] = useState([
    initializeChannel('general'),
    initializeChannel('random'),
    initializeChannel('tech'),
  ])
  const [activeChannelIndex, setActiveChannelIndex] = useState(0)


  useEffect(() => {

    socket.connect()

    socket.on('connect', () => {
      console.log('✅ Connected to server! ID:', socket.id);
    });

    socket.on('channels', channels => {
      setChannelList(channels)
    })

    socket.on('connect_error', (err) => {
      console.error('❌ Connection error:', err);
    });

    socket.on('disconnect', () => {
      console.warn('⚠️ Disconnected from server!');
    });

    socket.on('message:channel', (channelName, message) => {
      setChannelList(prevChannels =>
        prevChannels.map(channel =>
          channel.name === channelName
            ? {
              ...channel,
              messages: [...channel.messages, message],
            }
            : channel,
        ),
      )
    })

    return () => {
      socket.off('channels')
      socket.off('message:channel')
      socket.off('disconnect')
      socket.off('connect')
    }
  }, [])


  const activeChannel = channelList[activeChannelIndex]

  const handleChannelSelect = channelName => {
    const index = channelList.findIndex(channel => channel.name === channelName)
    if (index !== -1) {
      setActiveChannelIndex(index)
    }
  }

  return (
    <div className="container">
      <Channels
        channelList={channelList}
        activeChannel={activeChannel.name}
        onSelectChannel={handleChannelSelect}
      />
      <Messages messages={activeChannel.messages} channel={activeChannel} />
    </div>
  )
}

export default App
