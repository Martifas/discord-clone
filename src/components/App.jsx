import { useState, useEffect } from 'react';
import { socket } from '@/libs/socket';
import Channels from './Channels/Channels';
import { initializeChannel } from '../../server/channels.mjs'

function App() {

  const defaultChannels = [
    initializeChannel('general'),
    initializeChannel('random'),
    initializeChannel('tech'),
  ];

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [channelList, setChannelList] = useState(defaultChannels);

  useEffect(() => {
    socket.on('channelList', channels => {
      setChannelList(channels);
    });

    return () => {
      socket.off('channelList');
    };
  }, []);

  return (
    <div>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
      <Channels channelList={channelList} />
    </div>
  );
}

export default App;
