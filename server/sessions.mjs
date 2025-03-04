export const initializeStore = () => {
  const sessionStorage = new Map()

  function getSessionById(sessionId) {
    return sessionStorage.get(sessionId)
  }

  function getSessionByUserId(userId) {
    for (const session of sessionStorage.values()) {
      if (session.userId === userId) {
        return session
      }
    }
    return null
  }

  function getSessionByUsername(username) {
    for (const session of sessionStorage.values()) {
      if (session.username === username) {
        return session
      }
    }
    return null
  }

  function getAllSessions() {
    return Array.from(sessionStorage.values())
  }

  function getAllUsers() {
    return getAllSessions().map(session => ({
      userId: session.userId,
      username: session.username,
      connected: session.connected,
    }))
  }

  function setSession(sessionId, session) {
    sessionStorage.set(sessionId, session)
  }

  function deleteSession(sessionId) {
    sessionStorage.delete(sessionId)
  }

  return {
    getSessionById,
    getSessionByUserId,
    getSessionByUsername,
    getAllSessions,
    getAllUsers,
    setSession,
    deleteSession,
  }
}
