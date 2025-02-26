import './Channels.css'

function Channels({ channelList, user, onSelectChannel }) {
  return (
    <div className="channelContainer">
      <h3>TEXT CHANNELS</h3>
      {channelList.map((channel, index) => (
        <a className="channel" onClick={() => onSelectChannel(channel.name)} key={index}>
          # {channel.name}
        </a>
      ))}
      <div className='username'>{user}</div>
    </div>
  )
}

export default Channels
