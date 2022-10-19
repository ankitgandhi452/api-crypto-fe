const crypto = require('node:crypto').webcrypto
global.crypto = crypto
const ApiCryptoFE = require('../dist/index').default
const Crypto = require('../dist/Crypto/index').default
const utils = require('../dist/Crypto/utils')
const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnWhQNjFr0YNgVZcye2EU5ZPNCoLiTH55M3IzK8ba7ZnJBn1LritHqvJMvEikIaQd3CJB3JEhJeFFNz8utKdbCGiQMsvPUWRU3ldP1E7I6Wd2dhmzll/GElNUuc8sqzEpBcSCVwMtCQdvn0jBbTQw8/Qi2c31Q+vAn5fqGRroANUMMwQtMVk/DIi3MRo8IUkcemlhtZVEnszgKJE77onLIpq80+7MECl34cWvwZvUeJYm99ML4cGUua1AMTbbGlLiZXm68iXp6p+eAe4MLDUWicqRg1Zl3DfNjGkN0TuJmX1HFY7Teeh6YnhpPyL67BgqV24Q5FuDJkl6UXRtqrQ4sQIDAQAB'

const data = { test: 'test' };
// let encryptionKey, encryptedEncryptionKey

(async () => {
  const apiCryptoFEInstance = new ApiCryptoFE(publicKey)
  await apiCryptoFEInstance.generateAndWrapKey(data, {})
  console.log('apiCryptoFEInstance', apiCryptoFEInstance)
  const encryptedData = await apiCryptoFEInstance.encryptData(data, {})
  console.log('encryptedData', encryptedData)
  const decryptedData = await apiCryptoFEInstance.decryptData(encryptedData, {})
  console.log('decryptedData', decryptedData)

  // const encryptionKey = 'ZYna53GLd3KPmEvy+ZPF+ETAxGNdA6a/JgRTXQLq5EY='
  // const encryptedData = 'Xw4uP20NrCns3OEzJokGvw==.vl4ObeKQZ062oTUfpBe/SQ==.Z5fYnLOMX1/rUlCN7WoN6/IOlstsb62s/QmaT/eCz4A5UK42NcimJEGAYTvhSzSQwQ1oZo5kfCv+E08JptRNnaU2I+O5X35ilBcM7I3K9TlVB01OT96dFsKPj1X5iXHQetum8D0LXuDqHCTCz1eeyI1UVAastCTOJmp4xlXeR1otLilLvusQeVG9evw+4/sM27kmsBTeH4xw'
  // const encryptionKeyObject = await crypto.subtle.importKey('raw', utils.toBuffer(encryptionKey), { name: 'AES-GCM' }, false, ['decrypt'])
  // console.log('encryptionKeyObject', encryptionKeyObject)
  // const decryptedData = await Crypto.decryptData(encryptedData, encryptionKeyObject)
  // console.log('decryptedData', decryptedData)
})()

// (async () => {
// const keyData = await Crypto.generateAndWrapKey(publicKey)
// encryptionKey = keyData.encryptionKey
// encryptedEncryptionKey = keyData.encryptedEncryptionKey
// console.log('encryptionKey', encryptionKey)
// console.log('encryptedEncryptionKey', encryptedEncryptionKey)
// const encryptedData = await Crypto.encryptData(data, encryptionKey)
// console.log('encryptedData', encryptedData)
// const decryptedData = await Crypto.decryptData(encryptedData, encryptionKey)
// console.log('decryptedData', decryptedData)
// })()
