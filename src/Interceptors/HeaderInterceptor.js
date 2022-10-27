import { v4 } from 'uuid'
import { CONTEXT_MAP } from '../defaults/CONSTANTS'

const REQUEST_HEADER_CONTEXT_MAP = {
  SESSION_ID_REQUEST_HEADER_KEY: CONTEXT_MAP.SESSION_ID,
  REQUEST_ID_REQUEST_HEADER_KEY: CONTEXT_MAP.REQUEST_ID,

  ACCESS_TOKEN_REQUEST_HEADER_KEY: CONTEXT_MAP.ACCESS_TOKEN,
  API_KEY_REQUEST_HEADER_KEY: CONTEXT_MAP.API_KEY,

  CLIENT_ID_KEY_REQUEST_HEADER: CONTEXT_MAP.CLIENT_ID,
  APP_UID_REQUEST_HEADER_KEY: CONTEXT_MAP.APP_UID
}

const RESPONSE_HEADER_CONTEXT_MAP = {
  SESSION_ID_RESPONSE_HEADER_KEY: CONTEXT_MAP.SESSION_ID,
  ACCESS_TOKEN_RESPONSE_HEADER_KEY: CONTEXT_MAP.ACCESS_TOKEN,
  APP_UID_RESPONSE_HEADER_KEY: CONTEXT_MAP.APP_UID
}

export default class HeaderInterceptor {
  constructor (context = {}) {
    this.context = context

    const requestId = v4()
    const contextKey = REQUEST_HEADER_CONTEXT_MAP.REQUEST_ID_REQUEST_HEADER_KEY
    this.context.set(contextKey, requestId)

    this.request = this.request.bind(this)
    this.response = this.response.bind(this)
  }

  request (request = {}) {
    const constants = this.context.get(CONTEXT_MAP.CONSTANTS)
    const headers = {}
    Object.keys(REQUEST_HEADER_CONTEXT_MAP).forEach(header => {
      const constextKey = REQUEST_HEADER_CONTEXT_MAP[header]
      const value = this.context.get(constextKey)
      const key = constants[header].toLowerCase()

      if (value) {
        headers[key] = value
      }
    })

    request.headers = { ...headers, ...request.headers }
    return request
  }

  response (response = {}) {
    const constants = this.context.get(CONTEXT_MAP.CONSTANTS)
    const { headers } = response

    Object.keys(RESPONSE_HEADER_CONTEXT_MAP).forEach(header => {
      const constextKey = RESPONSE_HEADER_CONTEXT_MAP[header]
      const key = constants[header].toLowerCase()
      const value = headers[key]
      this.context.set(constextKey, value)
    })

    return response
  }
}
