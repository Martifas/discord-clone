import MessageCard from "./MessageCard"
import MessageInput from "./MessageInput"

function Messages({ messages, channel }) {
  return (
    <div>
      {messages.map(msg => (
        <MessageCard key={msg.id} username={msg.username} message={msg.message} />
      ))}
      <MessageInput channel={channel} />
    </div>

  )
}

export default Messages
