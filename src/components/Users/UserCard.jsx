import './Users.css'

function UserCard({ user }) {
  return (
    <div className="userCard">
      {user.connected ? '🟢' : '🔴'} {user.username}
    </div>
  )
}

export default UserCard
