import { useEffect, useRef, useState } from 'react'
import MessageCard from './MessageCard'
import MessageInput from './MessageInput'
import './Messages.css'

function Messages({ channel, avatar }) {
  
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [isUserAtBottom, setIsUserAtBottom] = useState(true)

  const handleScroll = () => {
    if (!messagesContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const atBottom = scrollHeight - scrollTop <= clientHeight + 50
    setIsUserAtBottom(atBottom)
  }

  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (isUserAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [channel.messages, isUserAtBottom])
  

  return (
    <div className="messageContainer">
      <div className='headingContainer'><h3 className="heading"># {channel.name}</h3></div>
      
      <div className="messageList" ref={messagesContainerRef}>
        {channel.messages.map(msg => (
          <MessageCard key={msg.id} username={msg.username} message={msg.message.message} date={msg.message.date} avatar={msg.message.avatar} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {!isUserAtBottom && (
        <button
          className="scrollToBottom"
          onClick={() => messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })}
        >
          ⬇ Scroll to Bottom
        </button>
      )}
      <MessageInput channel={channel} avatar={avatar} />
    </div>
  )
}

export default Messages
