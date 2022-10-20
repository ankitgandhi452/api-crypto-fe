import Crypto from './Crypto'

export default class ApiCryptoFE {
  constructor (publicKey = '', CONFIG = {}, CONSTANTS = {}) {
    const { DISABLE_CRPTOGRAPHY = false } = CONFIG
    const { ENCRYPTION_KEY_REQUEST_HEADER } = CONSTANTS

    this.encryptionKey = ''
    this.encryptedEncryptionKey = ''
    this.publicKey = publicKey
    this.ENCRYPTION_KEY_REQUEST_HEADER = ENCRYPTION_KEY_REQUEST_HEADER
    this.DISABLE_CRPTOGRAPHY = DISABLE_CRPTOGRAPHY

    this.generateAndWrapKey = this.generateAndWrapKey.bind(this)
    this.encryptData = this.encryptData.bind(this)
    this.decryptData = this.decryptData.bind(this)
  }

  async generateAndWrapKey (reqData, headers) {
    const { DISABLE_CRPTOGRAPHY, ENCRYPTION_KEY_REQUEST_HEADER } = this

    if (DISABLE_CRPTOGRAPHY || !this.publicKey) { return reqData }

    const { encryptionKey, encryptedEncryptionKey } = await Crypto.generateAndWrapKey(this.publicKey)
    this.encryptionKey = encryptionKey
    this.encryptedEncryptionKey = encryptedEncryptionKey
    headers[ENCRYPTION_KEY_REQUEST_HEADER] = encryptedEncryptionKey
    return reqData
  }

  async encryptData (reqData, headers) {
    const { DISABLE_CRPTOGRAPHY } = this

    if (DISABLE_CRPTOGRAPHY || !this.publicKey) { return reqData }

    const payload = await Crypto.encryptData(reqData, this.encryptionKey)
    return { payload }
  }

  async decryptData (resData) {
    const { DISABLE_CRPTOGRAPHY } = this

    if (DISABLE_CRPTOGRAPHY || !this.publicKey) { return resData }

    const { payload } = resData
    const data = await Crypto.decryptData(payload, this.encryptionKey)
    return data
  }
}
