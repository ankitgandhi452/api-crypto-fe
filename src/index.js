import axios from 'axios'
import ApiError from './ApiError'
import { formatRequestOptions } from './helper'
import Context, { STORE_KEYS_MAP } from './Context'
import Interceptors from './Interceptors'

const { ERROR_CLASSIFICATIONS } = ApiError

export default class HttpClient extends Context {
  constructor (_CONFIG = {}, _CONSTANTS = {}) {
    super(_CONFIG, _CONSTANTS)
  }

  async request (options = {}) {
    const { CONFIG } = this
    const client = axios.create(this.axiosProps)
    const requestOptions = formatRequestOptions(options, CONFIG.API_ROUTES)
    const interceptors = new Interceptors(this)
    client.interceptors.request.use(interceptors.requestInterceptor)
    client.interceptors.response.use(interceptors.responseInterceptor)

    try {
      const response = await client.request(requestOptions)
      return response
    } catch (error) {
      const { request, response } = error
      // Handle Axios Response Error
      if (response) {
        const { status, data: body } = response
        const { statusCode, message, error: err } = body
        const { code, publicKey } = err

        if (code === 'API_CRYPTO::PRIVATE_KEY_NOT_FOUND') {
          this.set(STORE_KEYS_MAP.PUBLIC_KEY, publicKey)
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
}
