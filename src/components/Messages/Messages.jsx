import MessageCard from "./MessageCard"
import MessageInput from "./MessageInput"

function Messages({ messages, channel, session, onMessageSend }) {
  return (
    <div>
      {messages.map(msg => (
        <MessageCard key={msg.id} username={msg.username} message={msg.message} />
      ))}
      <MessageInput channel={channel} session={session} onMessageSend={onMessageSend} />
    </div>

  )
}

export default Messages
