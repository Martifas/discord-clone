import './Channels.css'

function Channels({ channelList }) {
  return (
    <div className="channelList">
      {channelList.map((channel, index) => (
        <a className="channel" key={index}># {channel.name} </a>
      ))}
    </div>
  )
}

export default Channels
