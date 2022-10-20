import axios from 'axios'
import DEFAULT_CONSTANTS from './defaults/CONSTANTS'
import DEFAULT_CONFIG from './defaults/CONFIG'
import ApiCryptoFE from './ApiCryptoFe'
import { formatRequestOptions } from './helper'
import HeaderManager from './HeaderManager'

export default function HttpClientCreator (CONFIG, CONSTANTS = {}) {
  const _CONFIG = { ...DEFAULT_CONFIG, ...CONFIG }
  const _CONSTANTS = { ...DEFAULT_CONSTANTS, ...CONSTANTS }

  const { TIMEOUT, API_KEY_REQUEST_HEADER_KEY, CLIENT_ID_KEY_REQUEST_HEADER, CLIENT_ID } = _CONSTANTS
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
  return class HttpClient {
    constructor () {
      this.request = this.request.bind(this)
    }

    async request (options = {}) {
      const _options = formatRequestOptions(options)
      const { transformRequest = [], transformResponse = [] } = options
      const apiCryptoFE = new ApiCryptoFE('', _CONFIG, _CONSTANTS)
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
        headerManger.storeResponseHeaderValues(response.headers)
        return response
      } catch (error) {

      }
    }
  }
}
