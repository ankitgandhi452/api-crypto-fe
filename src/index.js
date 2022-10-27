import { v4 } from 'uuid'

import Store from './Store'
import ApiError from './ApiError'

import { formatRequestOptions } from './helper'
import DEFAULT_CONFIG from './defaults/CONFIG'
import DEFAULT_CONSTANTS, { CONTEXT_MAP, ROTATE_VALUE_KEYS } from './defaults/CONSTANTS'
import ClientManager from './ClientManager'

const { ERROR_CLASSIFICATIONS } = ApiError

const REQUEST_CONTEXT_MAP = {
  REQUEST_OPTIONS: 'REQUEST_OPTIONS'
}

export default class HttpClient {
  #context = new Store()
  constructor (_CONFIG = {}, _CONSTANTS = {}) {
    const CONFIG = { ...DEFAULT_CONFIG, ..._CONFIG }
    const CONSTANTS = { ...DEFAULT_CONSTANTS, ..._CONSTANTS }

    const { API_ROUTES, API_KEY } = CONFIG
    const { _BASE, ...ROUTE_PATHS } = API_ROUTES
    const routesPresent = !!Object.keys(ROUTE_PATHS || {}).length
    if (!_BASE && routesPresent) {
      console.warn('HttpClientCreator: _BASE is not passed in API_ROUTES')
    }

    // Init Context
    const { CLIENT_ID } = CONSTANTS
    const sessionId = v4()
    this.#context.set(CONTEXT_MAP.CONFIG, CONFIG)
    this.#context.set(CONTEXT_MAP.CONSTANTS, CONSTANTS)
    this.#context.set(CONTEXT_MAP.API_KEY, API_KEY)
    this.#context.set(CONTEXT_MAP.CLIENT_ID, CLIENT_ID)
    this.#context.set(CONTEXT_MAP.SESSION_ID, sessionId)

    this.set = this.#context.set
    this.get = this.#context.get
    this.del = this.#context.del
  }

  async request (options = {}) {
    const requestContext = this.#context.clone()
    const CONFIG = requestContext.get(CONTEXT_MAP.CONFIG)
    const requestOptions = formatRequestOptions(options, CONFIG.API_ROUTES)

    requestContext.set(REQUEST_CONTEXT_MAP.REQUEST_OPTIONS, requestOptions)
    const client = new ClientManager(requestContext)

    try {
      const response = await client.request(requestOptions)
      this.#saveRotateKeys(requestContext)
      return response
    } catch (error) {
      this.#saveRotateKeys(requestContext)
      const { request, response } = error
      // Handle Axios Response Error
      if (response) {
        const { status, data: body } = response
        const { statusCode, message, error: err } = body
        const { code, publicKey } = err

        if (code === 'API_CRYPTO::PRIVATE_KEY_NOT_FOUND') {
          this.#context.set(CONTEXT_MAP.PUBLIC_KEY, publicKey)
          return await this.request(options)
        }

        const classification = ERROR_CLASSIFICATIONS.API_CALL
        const errorParams = {
          statusCode: (statusCode || status),
          message: (message || undefined),
          classification
        }
        const errorObj = body
        const apiError = new ApiError(errorObj, errorParams)
        throw apiError
      }

      // Handle Axios Request Error
      if (request) {
        const classification = ERROR_CLASSIFICATIONS.NETWORK_ERROR
        const { message } = error
        const errorParams = {
          statusCode: -1,
          message,
          classification
        }
        const apiError = new ApiError(error, errorParams)
        // logger.error(err.message, err)
        delete apiError.error.stack
        throw apiError
      }

      // Handle any other form of error
      const classification = ERROR_CLASSIFICATIONS.CODE
      const errorParams = {
        statusCode: -2,
        classification
      }
      const apiError = new ApiError(error, errorParams)
      // logger.error(err.message, err)
      throw apiError
    }
  }

  #saveRotateKeys (requestContext) {
    ROTATE_VALUE_KEYS.forEach(key => {
      const value = requestContext.get(key)
      this.#context.set(key, value)
    })
  }
}
