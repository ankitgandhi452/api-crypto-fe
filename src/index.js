import axios from 'axios'
import DEFAULT_CONSTANTS from './defaults/CONSTANTS'
import DEFAULT_CONFIG from './defaults/CONFIG'
import ApiCryptoFE from './ApiCryptoFe'
import ApiError from './ApiError'
import { formatRequestOptions } from './helper'
import HeaderManager from './HeaderManager'

const { ERROR_CLASSIFICATIONS } = ApiError

export default function HttpClientCreator(CONFIG, CONSTANTS = {}) {
  const _CONFIG = { ...DEFAULT_CONFIG, ...CONFIG }
  const _CONSTANTS = { ...DEFAULT_CONSTANTS, ...CONSTANTS }

  const {
    TIMEOUT,
    API_KEY_REQUEST_HEADER_KEY,
    CLIENT_ID_KEY_REQUEST_HEADER,
    CLIENT_ID

  } = _CONSTANTS
  const { API_KEY, API_ROUTES } = _CONFIG

  const { _BASE, ...ROUTE_PATHS } = API_ROUTES
  const routesPresent = !!Object.keys(ROUTE_PATHS || {}).length
  if (!_BASE && routesPresent) {
    console.warn('HttpClientCreator: _BASE is not passed in API_ROUTES')
  }

  const axiosInstance = axios.create({
    baseURL: _BASE,
    timeout: TIMEOUT,
    headers: {
      [API_KEY_REQUEST_HEADER_KEY]: API_KEY,
      [CLIENT_ID_KEY_REQUEST_HEADER]: CLIENT_ID
    }
  })

  const headerManger = new HeaderManager(_CONSTANTS)

  async function request(options = {}) {
    const _options = formatRequestOptions(options)
    const { transformRequest = [], transformResponse = [] } = options
    const publicKey = headerManger.get('PUBLIC_KEY')
    const apiCryptoFE = new ApiCryptoFE(publicKey, _CONFIG, _CONSTANTS)
    const requestOptions = {
      ..._options,
      transformRequest: [
        ...transformRequest,
        headerManger.appendCustomHeader,
        apiCryptoFE.generateAndWrapKey,
        apiCryptoFE.encryptData,
        ...axios.defaults.transformRequest
      ],
      transformResponse: [
        ...axios.defaults.transformResponse,
        apiCryptoFE.decryptData,
        ...transformResponse
      ]
    }

    try {
      const response = await axiosInstance.request(requestOptions)
      response.data = await response.data
      headerManger.storeResponseHeaderValues(response.headers)
      return response
    } catch (error) {
      const { request, response } = error
      // Handle Axios Response Error
      if (response) {
        const { status, data: body } = response
        const { statusCode, message } = body
        const classification = ERROR_CLASSIFICATIONS.API_CALL

        const errorParams = {
          statusCode: (statusCode || status),
          message: (message || undefined),
          classification
        }
        const errorObj = body
        const err = new ApiError(errorObj, errorParams)
        throw err
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
        const err = new ApiError(error, errorParams)
        // logger.error(err.message, err)
        delete err.error.stack
        throw err
      }

      // Handle any other form of error
      const classification = ERROR_CLASSIFICATIONS.CODE
      const errorParams = {
        statusCode: -2,
        classification
      }
      const err = new ApiError(error, errorParams)
      // logger.error(err.message, err)
      throw err
    }
  }

  return {
    request,
    get: headerManger.get,
    set: headerManger.set,
    del: headerManger.del
  }
}

const context = {
  CONFIG: {},
  CONSTANTS: {},
  STORE_KEY_MAP: {},
  store: {},
}
