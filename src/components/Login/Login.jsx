import { useState, useEffect } from 'react'
import background from '../../../assets/dark_background.jpg'
import './Login.css'
import { validateUsername } from '@/libs/validateUsername'

function Login({ onUsernameSubmit }) {
  const [username, setUsername] = useState('')
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const img = new Image()
    img.src = background
    img.onload = () => setBackgroundLoaded(true)
  }, [])

  const handleNameInput = e => {
    e.preventDefault()

    const validationError = validateUsername(username)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    onUsernameSubmit(username)
  }

  return (
    <div className={`loginContainer ${backgroundLoaded ? 'loaded' : ''}`}>
      <form onSubmit={handleNameInput}>
        <label htmlFor="username">Choose a username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="e.g., Pixel9"
          aria-label="Enter your chat username"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Join the chat</button>
      </form>
    </div>
  )
}

export default Login
