import './Channels.css'

function Channels({ channelList, onSelectChannel }) {
  return (
    <div className="channelList">
      <h3>TEXT CHANNELS</h3>
      {channelList.map((channel, index) => (
        <a
          className="channel"
          onClick={() => onSelectChannel(channel.name)}
          key={index}
        >
          # {channel.name}
        </a>
      ))}
    </div>
  )
}


export default Channels
