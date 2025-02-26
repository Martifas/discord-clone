import UserCard from './UserCard'

import './Users.css'

function Users({ userList }) {
  if (!userList) return <p>Loading users...</p>
  return (
    <div className="userContainer">
      <h3>Active Users</h3>
      <div>
        {userList.map(user => (
          <UserCard key={user.userId} user={user} />
        ))}
      </div>
    </div>
  )
}

export default Users
