function MessageCard({ username, message }) {
    return (
        <div className="messageCard">
            <strong>{username}:</strong> {message}
        </div>
    )
}

export default MessageCard