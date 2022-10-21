import DEFAULT_CONSTANTS from './defaults/CONSTANTS'
import DEFAULT_CONFIG from './defaults/CONFIG'
import ApiError from './ApiError'
import { formatRequestOptions } from './helper'
import getContext from './context'
import getInstance from './instance'
import getInterceptos from './Interceptors'

const { ERROR_CLASSIFICATIONS } = ApiError

export default function HttpClientCreator (CONFIG, CONSTANTS = {}) {
  const _CONFIG = { ...DEFAULT_CONFIG, ...CONFIG }
  const _CONSTANTS = { ...DEFAULT_CONSTANTS, ...CONSTANTS }

  const { API_ROUTES } = _CONFIG
  const { _BASE, ...ROUTE_PATHS } = API_ROUTES
  const routesPresent = !!Object.keys(ROUTE_PATHS || {}).length
  if (!_BASE && routesPresent) {
    console.warn('HttpClientCreator: _BASE is not passed in API_ROUTES')
  }

  const context = getContext(_CONFIG, _CONSTANTS)

  async function request (options = {}) {
    const axiosInstance = getInstance(_CONFIG, _CONSTANTS)
    const requestOptions = formatRequestOptions(options)
    const { requestInteceptor, responseInteceptor } = getInterceptos.call(context)
    axiosInstance.interceptors.request.use(requestInteceptor)
    axiosInstance.interceptors.response.use(responseInteceptor)
    try {
      const response = await axiosInstance.request(requestOptions)
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

  function set (key = '', value = '') {
    const storeKey = context.STORE_KEYS_MAP[key]

    if (!storeKey) { return }

    context.store[storeKey] = value
  }

  function get (key = '') {
    const storeKey = context.STORE_KEYS_MAP[key]

    if (!storeKey) { return }

    return context.store[storeKey]
  }

  return {
    request,
    set,
    get
  }
}
