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

  const currentSession = {
    userId: 'user1',
    username: 'Alice',
    connected: true,
  }

  useEffect(() => {
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
      socket.off('message:channel')
    }
  }, [])

  const handleMessageSend = (channelName, message) => {
    setChannelList(prevChannels =>
      prevChannels.map(channel =>
        channel.name === channelName
          ? { ...channel, messages: [...channel.messages, message] }
          : channel,
      ),
    )
  }

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
      <div>
        <Messages messages={activeChannel.messages} channel={activeChannel} session={currentSession} onMessageSend={handleMessageSend} />
      </div>
    </div>
  )
}

export default App
