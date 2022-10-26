import { v4 } from 'uuid'
import { STORE_KEYS_MAP } from './Context'
import Crypto from './Crypto'

export default class Interceptors {
  constructor (context = {}) {
    const { CONSTANTS } = context

    const {
      ACCESS_TOKEN_REQUEST_HEADER_KEY,
      ACCESS_TOKEN_RESPONSE_HEADER_KEY,

      SESSION_ID_REQUEST_HEADER_KEY,
      SESSION_ID_RESPONSE_HEADER_KEY,

      APP_UID_REQUEST_HEADER_KEY,
      APP_UID_RESPONSE_HEADER_KEY
    } = CONSTANTS

    this.context = context
    this.encryptionKey = ''
    this.requestId = v4()

    this.CUSTOM_HEADER_CONFIG = [
      {
        REQUEST_HEADER_KEY: SESSION_ID_REQUEST_HEADER_KEY.toLowerCase(),
        RESPONSE_HEADER_KEY: SESSION_ID_RESPONSE_HEADER_KEY.toLowerCase(),
        STORE_KEY: STORE_KEYS_MAP.SESSION_ID
      },
      {
        REQUEST_HEADER_KEY: ACCESS_TOKEN_REQUEST_HEADER_KEY.toLowerCase(),
        RESPONSE_HEADER_KEY: ACCESS_TOKEN_RESPONSE_HEADER_KEY.toLowerCase(),
        STORE_KEY: STORE_KEYS_MAP.ACCESS_TOKEN
      },
      {
        REQUEST_HEADER_KEY: APP_UID_REQUEST_HEADER_KEY.toLowerCase(),
        RESPONSE_HEADER_KEY: APP_UID_RESPONSE_HEADER_KEY.toLowerCase(),
        STORE_KEY: STORE_KEYS_MAP.APP_UID
      }
    ]

    this.requestInterceptor = this.requestInterceptor.bind(this)
    this.responseInterceptor = this.responseInterceptor.bind(this)

    this._addCustomHeader = this._addCustomHeader.bind(this)
    this._encryptData = this._encryptData.bind(this)
  }

  async requestInterceptor (request) {
    let req = request
    req = this._addCustomHeader(req)
    req = await this._encryptData(req)
    return req
  }

  async responseInterceptor (response) {
    let res = response
    res = await this._decryptData(response)
    return res
  }

  _addCustomHeader (request) {
    const { CONSTANTS } = this.context
    const requestHeaders = {}
    this.CUSTOM_HEADER_CONFIG.forEach((config) => {
      const { REQUEST_HEADER_KEY, STORE_KEY } = config
      const headerValue = this.context.get(STORE_KEY)
      if (headerValue) {
        requestHeaders[REQUEST_HEADER_KEY] = headerValue
      }
    })

    // Set Request Id
    const { REQUEST_ID_REQUEST_HEADER_KEY } = CONSTANTS
    requestHeaders[REQUEST_ID_REQUEST_HEADER_KEY.toLowerCase()] = this.requestId

    // Keeping user specified headers priority
    request.headers = { ...requestHeaders, ...request.headers }
    return request
  }

  async _encryptData (request = {}) {
    const { CONSTANTS, CONFIG } = this.context
    const { ENCRYPTION_KEY_REQUEST_HEADER } = CONSTANTS
    const { DISABLE_CRPTOGRAPHY } = CONFIG

    const publicKey = this.context.get(STORE_KEYS_MAP.PUBLIC_KEY)

    if (DISABLE_CRPTOGRAPHY) { return request }

    const { encryptionKey, encryptedEncryptionKey } = await Crypto.generateAndWrapKey(publicKey)
    this.encryptionKey = encryptionKey

    const requestHeaders = {
      [ENCRYPTION_KEY_REQUEST_HEADER]: encryptedEncryptionKey
    }

    const { data } = request
    const payload = await Crypto.encryptData(data, encryptionKey)

    // Keeping user specified headers priority
    request.headers = { ...requestHeaders, ...request.headers }
    request.data = { payload }
    return request
  }

  async _decryptData (response = {}) {
    const { CONFIG } = this.context
    const { DISABLE_CRPTOGRAPHY } = CONFIG
    const { data: body = {} } = response
    const { data = {}, error } = body
    const { payload } = data

    if (DISABLE_CRPTOGRAPHY || error) { return response }

    const decryptedData = await Crypto.decryptData(payload, this.encryptionKey)
    response.data = decryptedData
    return response
  }
}
