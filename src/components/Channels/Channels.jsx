import './Channels.css'

function Channels({ channelList, onSelectChannel, username }) {
  return (
    <div className="channelContainer">
      <h3>TEXT CHANNELS</h3>
      {channelList.map((channel, index) => (
        <a className="channel" onClick={() => onSelectChannel(channel.name)} key={index}>
          # {channel.name}
        </a>
      ))}
      <div className="username">{username}</div>
    </div>
  )
}

export default Channels
