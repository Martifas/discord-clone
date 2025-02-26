import { useState } from 'react'
import './Login.css'

function Login({ onUsernameSubmit }) {
  const [username, setUsername] = useState('')

  const handleNameInput = e => {
    e.preventDefault()
    if (!username.trim()) return

    onUsernameSubmit(username)
    localStorage.setItem('currentUser', username)
  }

  return (
    <div className="loginContainer">
      <form onSubmit={handleNameInput}>
        <label htmlFor="username">Choose a username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="e.g., PixelWizard99"
          aria-label="Enter your chat username"
          required
        />

        <button type="submit">Join the chat</button>
      </form>
    </div>
  )
}

export default Login
