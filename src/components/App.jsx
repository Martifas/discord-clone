import { useState } from 'react'
import { socket } from '@/libs/socket'

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)

  return (
    <div>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
    </div>
  )
}

export default App
