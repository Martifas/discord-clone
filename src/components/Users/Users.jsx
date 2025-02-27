import UserCard from './UserCard'
import './Users.css'

function Users({ userList }) {
  if (!userList) return <p>Loading users...</p>

  const onlineUsers = userList.filter(user => user.connected)
  const offlineUsers = userList.filter(user => !user.connected)

  return (
    <div className="userContainer">
      <div className="headingContainer headingNoShadow">
        <h3 className="heading">Users</h3>
      </div>
      <h4>ONLINE - {onlineUsers.length}</h4>
      {onlineUsers.length > 0 ? (
        onlineUsers.map(user => <UserCard key={user.userId} user={user} />)
      ) : (
        <p></p>
      )}

      <h4>OFFLINE - {offlineUsers.length}</h4>
      {offlineUsers.length > 0 ? (
        offlineUsers.map(user => <UserCard key={user.userId} user={user} />)
      ) : (
        <p></p>
      )}
    </div>
  )
}

export default Users
