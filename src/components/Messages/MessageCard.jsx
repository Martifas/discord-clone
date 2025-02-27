function MessageCard({ username, message, avatar, date }) {
  return (
    <div className="messageCard">
      <div className="avatar" dangerouslySetInnerHTML={{ __html: avatar }}></div>
      <div className="message">
        <div>
          <strong>{username} </strong> {date}
        </div>
        {message}
      </div>
    </div>
  )
}

export default MessageCard
