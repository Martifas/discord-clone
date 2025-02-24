import crypto from 'crypto'

export const generateRandomId = (length = 8) => {
  return crypto.randomBytes(length).toString('hex')
}