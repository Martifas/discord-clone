import './Channels.css'

function Channels({ channelList, activeChannel, onSelectChannel }) {
  return (
    <div className="channelList">
      <h2>{activeChannel}</h2>
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
