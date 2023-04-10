const crypto = require('crypto')

function encryptData(data, key, iv) {
  const cipher = crypto.createCipher('chacha20-poly1305', key, iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

// Example usage:
const dataToEncrypt = `4313dc310cba681a6059a6c2d6d6900088640f8a634b5ef38cefac7fdf5b7ef1ef20a9a9c3d0b4249f03d397841cd82695b4542ab331bfbb2111f23cd3b00c14cf727fa222f3f134eead041ad136673ed3ec0438
b3ae1ced8c4812f0135c0c49f773db762795676084112c79a3ded20fafece15b4b8faee3bf04847729400920e01979949dff9fed82042f5eff61e8864fee2f0cb2f76ad13a9645ba`
const encryptionKey = 'abcedefghijklmnopqrstuvwxyz'
const initializationVector = crypto.randomBytes(16)

const encryptedData = encryptData(
  dataToEncrypt,
  encryptionKey,
  initializationVector
)

console.log(encryptedData)
// let currentPassword = encryptData(
//   'Hello, world',
//   'ThisIsASecretKey123',
//   initializationVector
// )

// function decryptData(encryptedData, key, iv) {
//   const decipher = crypto.createDecipher('aes-256-cbc', key, iv)
//   let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
//   decrypted += decipher.final('utf8')
//   return decrypted
// }

// // Example usage:
// const decryptedData = decryptData(
//   encryptedData,
//   'ThisIsASecretKey123',
//   initializationVector
// )
// Divide string into two parts
// function divideString(str) {
//   if (typeof str !== 'string') {
//     throw new Error('Input must be a string.')
//   }
//   const midIndex = Math.ceil(str.length / 2)
//   const firstHalf = str.slice(0, midIndex)
//   const secondHalf = str.slice(midIndex)
//   return [firstHalf, secondHalf]
// }

// const [firstHalf, secondHalf] = divideString(encryptedData)
// const [currfirstHalf, currSecondHalf] = divideString(currentPassword)

// function stableString(divideHash) {
//   return crypto.createHash('sha256').update(String(divideHash)).digest('hex')
// }

// console.log()

// const first =
//   'cde8e1edba14b61be175311a65cde6fb2af71ff8cb97b2857043fd1671cd4a75ee0ab1eef27213461ed0ac346d44c6a5'
// const middle =
//   '64565592de6b3eca7fcacc0be1af32a08ae7ea4b3db370f4140edadfe041ab7674da53ddae2f617f70597b2d2092f62b516e9982ac5f9e0a26b72d8844734ff2500218048c959402b086af5bcad0ba622cf2b796dbd12cba0cc07321445527a9c9d75f646c82b981d5b07d86582f8286cedd75433e5a7a890904c8bf7d8e02dee6a5fc802a0859cbe21ddfeb75a440ed7401e84d8fd45faf6335ddcc4d0bdf6f70fffaa3f0c82e63432967e0bcbf690f74f1d02b535548aecc680d092b01172bac13ef3d440ab8495dbfc3b945d33f1fcd6b49f8fb585f7263701955f0f900f0b5a328ce20795cddef38620e847139c7a658451207700b35121f35c70798a3feabdeaaa184521cf6c2e24c582c401b18b0d5748bf0f31666842f962fd79e15f5b992f8fe5b0ac962041c50c1a1fc925e299540be1d11150cba5b55c7813cad3569860973303b6fbed5658f2af0f811468b2c7a9bf02cba2849a416a80cba11ea79422656d2f4bfc7fd30994c3fdfd1e645bbb4c0e8f2199a6463bdb88f8222cd09666d0592eb34781fa287cfed343b0699d0186a909c2869e745eea9741eb24614e27d27ef40f35935d2f0695f6ff4d9efa22dc5e6090e06abe61115dcac0c9a16cb3799a4336461d421966355b70de74f75fed85aa206faa41b7889a42e18532672fdca2ffca88a283c5c36b5041c51870140fcf34f93d4901d18315a1867c0b003f01daa830253a7d7a1ae29381ed82d14206dcb8ffe98176bc22e4cf515295ef0e1ca4d5f1a7ad80e174a695c25a8bb13f6ffa5fb363b411bc4d44a03f8d6103f0339ffa9734ba662789c4fc64a76307b840ca8cc935437be7c2275a629c94b02802c52397532889296a4d2473331fa49608b4b68055a0d0edc02f76df365af06426e707e7e33e105dda8bb9931e938927d11fbbdc8bcee4b326aeb01dcc7d1bb43f69d912bcaab7cb06a37e624da5ef459fd0c73c530f7e8d4ce54cdd899'
// const third =
//   '814ff80b34040cfe7188b854c71668ea91fbbd581c2a25f8dfcd6fd46e8b07a4ac44103fb958a172fcc2a40e86cfdad7'
// console.log(
//   decryptData(first, 'ThisIsASecretKey123', initializationVector) +
//     '.' +
//     decryptData(middle, 'ThisIsASecretKey123', initializationVector) +
//     '.' +
//     decryptData(third, 'ThisIsASecretKey123', initializationVector)
// )
