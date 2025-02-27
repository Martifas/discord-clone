import './Channels.css'

function Channels({ channelList, onSelectChannel, username, onLogout }) {
  if (!channelList || channelList.length === 0) {
    return <p>No channels available</p>
  }
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
      <div className="userInfo">        
        <div className="username">{username}</div>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Channels
