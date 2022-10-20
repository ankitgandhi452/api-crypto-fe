import { v4 } from 'uuid'

export default class HeaderManager {
  constructor (CONSTANTS = {}) {
    const {
      ACCESS_TOKEN_REQUEST_HEADER_KEY,
      ACCESS_TOKEN_RESPONSE_HEADER_KEY,

      SESSION_ID_REQUEST_HEADER_KEY,
      SESSION_ID_RESPONSE_HEADER_KEY,

      APP_UID_REQUEST_HEADER_KEY,
      APP_UID_RESPONSE_HEADER_KEY
    } = CONSTANTS

    const STORE_KEYS_MAP = {
      SESSION_ID: 'SESSION_ID',
      ACCESS_TOKEN: 'ACCESS_TOKEN',
      APP_UID: 'APP_UID',
      PUBLIC_KEY: 'PUBLIC_KEY'
    }

    const CUSTOM_HEADER_CONFIG = [
      {
        REQUEST_HEADER_KEY: SESSION_ID_REQUEST_HEADER_KEY,
        RESPONSE_HEADER_KEY: SESSION_ID_RESPONSE_HEADER_KEY,
        STORE_KEY: STORE_KEYS_MAP.SESSION_ID
      },
      {
        REQUEST_HEADER_KEY: ACCESS_TOKEN_REQUEST_HEADER_KEY,
        RESPONSE_HEADER_KEY: ACCESS_TOKEN_RESPONSE_HEADER_KEY,
        STORE_KEY: STORE_KEYS_MAP.ACCESS_TOKEN
      },
      {
        REQUEST_HEADER_KEY: APP_UID_REQUEST_HEADER_KEY,
        RESPONSE_HEADER_KEY: APP_UID_RESPONSE_HEADER_KEY,
        STORE_KEY: STORE_KEYS_MAP.APP_UID
      }
    ]

    this.headerStore = {}
    this.CONSTANTS = CONSTANTS
    this.CUSTOM_HEADER_CONFIG = CUSTOM_HEADER_CONFIG
    this.STORE_KEYS_MAP = STORE_KEYS_MAP

    this.appendCustomHeader = this.appendCustomHeader.bind(this)
    this.storeResponseHeaderValues = this.storeResponseHeaderValues.bind(this)
    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.del = this.del.bind(this)
  }

  appendCustomHeader (data, headers) {
    const requestHeaders = {}
    this.CUSTOM_HEADER_CONFIG.forEach((config) => {
      const { REQUEST_HEADER_KEY, STORE_KEY } = config
      const headerValue = this.headerStore[STORE_KEY]
      if (headerValue) {
        requestHeaders[REQUEST_HEADER_KEY.toLowerCase()] = headerValue
      }
    })

    // Set Request Id
    const { REQUEST_ID_REQUEST_HEADER_KEY } = this.CONSTANTS
    const requestId = v4()
    requestHeaders[REQUEST_ID_REQUEST_HEADER_KEY.toLowerCase()] = requestId

    // Keeping user specified headers priority
    headers = { ...requestHeaders, ...headers }

    return data
  }

  storeResponseHeaderValues (resHeaders = {}) {
    this.CUSTOM_HEADER_CONFIG.forEach((config) => {
      const { RESPONSE_HEADER_KEY, STORE_KEY } = config
      const headerValue = resHeaders[RESPONSE_HEADER_KEY.toLowerCase()]
      if (STORE_KEY && headerValue) { this.headerStore[STORE_KEY] = headerValue }
    })
  }

  set (key = '', value = '', force = false) {
    const storeKey = this.STORE_KEYS_MAP[key]

    if (!storeKey || (!value && !force)) { return }

    this.headerStore[storeKey] = value
    return value
  }

  get (key = '') {
    const storeKey = this.STORE_KEYS_MAP[key]

    if (!storeKey) { return }

    return this.headerStore[storeKey]
  }

  del (key = '') {
    const storeKey = this.STORE_KEYS_MAP[key]

    if (!storeKey) { return }

    const currentValue = this.headerStore[storeKey]
    delete this.headerStore[storeKey]
    return currentValue
  }
}
