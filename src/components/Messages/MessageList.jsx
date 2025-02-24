function MessageList({ messages }) {
  return (
    <ul>
      {messages.map(msg => (
        <li key={msg.id}>
          <strong>{msg.username}:</strong> {msg.message}
        </li>
      ))}
    </ul>
  )
}

export default MessageList
