export const validateUsername = username => {
  if (username.trim().length > 8) {
    return 'Username must not be longer than 8 characters'
  }

  return null
}
