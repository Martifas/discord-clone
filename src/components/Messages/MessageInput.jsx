import { useState } from 'react'
import { socket } from '@/libs/socket'
import './Messages.css'

function MessageInput({ channel }) {
  const [messageText, setMessageText] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (!messageText.trim()) return

    socket.emit('message:channel:send', channel.name, messageText)

      setMessageText('')
  }

  return (
    <div className="messageContainer">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder="Type your message here..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default MessageInput
