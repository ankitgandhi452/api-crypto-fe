import axios from 'axios'
import ApiError from './ApiError'
import { formatRequestOptions } from './helper'
import Context, { STORE_KEYS_MAP } from './Context'
import Interceptors from './Interceptors'

const { ERROR_CLASSIFICATIONS } = ApiError

export default class HttpClient {
  constructor (_CONFIG = {}, _CONSTANTS = {}) {
    this.context = new Context(_CONFIG, _CONSTANTS)
    this.client = axios.create(this.context.axiosProps)

    this.request = this.request.bind(this)

    this.setStore = this.context.set
    this.getStore = this.context.get
    this.delStore = this.context.del
  }

  async request (options = {}) {
    const requestOptions = formatRequestOptions(options)
    const interceptors = new Interceptors(this.context)
    this.client.interceptors.request.use(interceptors.requestInterceptor)
    this.client.interceptors.response.use(interceptors.responseInterceptor)

    try {
      const response = await this.client.request(requestOptions)
      return response
    } catch (error) {
      console.log('error', error)
      const { request, response } = error
      // Handle Axios Response Error
      if (response) {
        const { status, data: body } = response
        const { statusCode, message, error: err } = body
        const { code, publicKey } = err

        if (code === 'API_CRYPTO::PRIVATE_KEY_NOT_FOUND') {
          this.setStore(STORE_KEYS_MAP.PUBLIC_KEY, publicKey)
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
