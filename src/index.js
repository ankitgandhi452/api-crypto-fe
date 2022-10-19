import Crypto from './Crypto'

export default class ApiCryptoFE {
  constructor (publicKey = '') {
    this.encryptionKey = ''
    this.encryptedEncryptionKey = ''
    this.publicKey = publicKey

    this.generateAndWrapKey = this.generateAndWrapKey.bind(this)
    this.encryptData = this.encryptData.bind(this)
    this.decryptData = this.decryptData.bind(this)
  }

  async generateAndWrapKey (data, headers) {
    const { encryptionKey, encryptedEncryptionKey } = await Crypto.generateAndWrapKey(this.publicKey)
    this.encryptionKey = encryptionKey
    this.encryptedEncryptionKey = encryptedEncryptionKey
    headers['X-API-Encrtion-Key'] = encryptedEncryptionKey
    return data
  }

  async encryptData (data, headers) {
    const payload = await Crypto.encryptData(data, this.encryptionKey)
    return { payload }
  }

  async decryptData ({ payload }) {
    const data = await Crypto.decryptData(payload, this.encryptionKey)
    return data
  }
}
