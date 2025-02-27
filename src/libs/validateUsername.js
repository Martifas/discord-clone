export const validateUsername = username => {
  if (username.trim().length > 9) {
    return 'Username must not be longer than 9 characters'
  }

  return null
}
