import './Channels.css'

function Channels({ channelList, onSelectChannel, username, onLogout }) {
  return (
    <div className="channelContainer">
      <div className="headingContainer headingNoShadow">
        <h3 className="heading">Text Channels</h3>
      </div>

      {channelList.map((channel, index) => (
        <a className="channel" onClick={() => onSelectChannel(channel.name)} key={index}>
          # {channel.name}
        </a>
      ))}
      <div className="userContainer">
        <div className="username">{username}</div>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Channels
