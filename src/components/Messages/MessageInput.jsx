import { useState } from 'react'
import { socket } from '@/libs/socket'

import './Messages.css'

function MessageInput({ channel, avatar }) {
  const [messageText, setMessageText] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (!messageText.trim()) return

    const messageData = {
      date: new Date().toLocaleString(),
      message: messageText,
      avatar:avatar,
    }

    socket.emit('message:channel:send', channel.name, messageData)

    setMessageText('')
  }

  return (
    <div className="inputContainer">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder={`Message #${channel.name}`}
        />
      </form>
    </div>
  )
}

export default MessageInput
