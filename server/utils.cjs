const crypto = require('crypto')

module.exports = {
  generateRandomId: (length = 8) => crypto.randomBytes(length).toString('hex'),
}
