import Crypto from '../Crypto'
import { CONTEXT_MAP } from '../defaults/CONSTANTS'

export default class CryptoInterceptor {
  #encryptionKey

  constructor (context = {}) {
    this.context = context
    this.request = this.request.bind(this)
    this.response = this.response.bind(this)
  }

  async request (request = {}) {
    const CONFIG = this.context.get(CONTEXT_MAP.CONFIG)
    const CONSTANTS = this.context.get(CONTEXT_MAP.CONSTANTS)

    const { ENCRYPTION_KEY_REQUEST_HEADER } = CONSTANTS
    const { ENABLE_CRPTOGRAPHY } = CONFIG
    const { method } = request

    const publicKey = this.context.get(CONTEXT_MAP.PUBLIC_KEY)

    if (!ENABLE_CRPTOGRAPHY || method.toLowerCase() === 'get') { return request }

    const { encryptionKey, encryptedEncryptionKey } = await Crypto.generateAndWrapKey(publicKey)
    this.#encryptionKey = encryptionKey

    const requestHeaders = {
      [ENCRYPTION_KEY_REQUEST_HEADER.toLowerCase()]: encryptedEncryptionKey
    }

    const { data } = request
    const payload = await Crypto.encryptData(data, encryptionKey)

    // Keeping user specified headers priority
    request.headers = { ...requestHeaders, ...request.headers }
    request.data = { payload }
    return request
  }

  async response (response = {}) {
    const CONFIG = this.context.get(CONTEXT_MAP.CONFIG)
    const { ENABLE_CRPTOGRAPHY } = CONFIG
    const { data: body = {} } = response
    const { data = {}, error } = body
    const { payload } = data
    const { config = {} } = response
    const { method } = config

    if (!ENABLE_CRPTOGRAPHY || method.toLowerCase() === 'get' || error) { return response }

    const decryptedData = await Crypto.decryptData(payload, this.#encryptionKey)
    response.data = decryptedData
    return response
  }
}
