const crypto = require('crypto')

function encryptData(data, key, iv) {
  const cipher = crypto.createCipher('aes-256-cbc', key, iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

// Example usage:
const dataToEncrypt = 'Hello, world!'
const encryptionKey = 'ThisIsASecretKey123'
const initializationVector = crypto.randomBytes(16)

const encryptedData = encryptData(
  dataToEncrypt,
  encryptionKey,
  initializationVector
)

let currentPassword = encryptData(
  'Hello, world',
  'ThisIsASecretKey123',
  initializationVector
)

function decryptData(encryptedData, key, iv) {
  const decipher = crypto.createDecipher('aes-256-cbc', key, iv)
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// Example usage:
const decryptedData = decryptData(
  encryptedData,
  'ThisIsASecretKey123',
  initializationVector
)
// Divide string into two parts
function divideString(str) {
  if (typeof str !== 'string') {
    throw new Error('Input must be a string.')
  }
  const midIndex = Math.ceil(str.length / 2)
  const firstHalf = str.slice(0, midIndex)
  const secondHalf = str.slice(midIndex)
  return [firstHalf, secondHalf]
}

const [firstHalf, secondHalf] = divideString(encryptedData)
const [currfirstHalf, currSecondHalf] = divideString(currentPassword)

function stableString(divideHash) {
  return crypto.createHash('sha256').update(String(divideHash)).digest('hex')
}

console.log(
  stableString([currfirstHalf, currSecondHalf]) ===
    stableString([firstHalf, secondHalf])
)
