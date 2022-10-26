import DEFAULT_CONSTANTS from './defaults/CONSTANTS'
import DEFAULT_CONFIG from './defaults/CONFIG'

export const STORE_KEYS_MAP = {
  SESSION_ID: 'SESSION_ID',
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  APP_UID: 'APP_UID',
  PUBLIC_KEY: 'PUBLIC_KEY'
}
export default class Context {
  constructor (CONFIG = {}, CONSTANTS = {}) {
    const _CONFIG = { ...DEFAULT_CONFIG, ...CONFIG }
    const _CONSTANTS = { ...DEFAULT_CONSTANTS, ...CONSTANTS }

    const { API_ROUTES, API_KEY } = _CONFIG
    const { _BASE, ...ROUTE_PATHS } = API_ROUTES
    const routesPresent = !!Object.keys(ROUTE_PATHS || {}).length
    if (!_BASE && routesPresent) {
      console.warn('HttpClientCreator: _BASE is not passed in API_ROUTES')
    }

    this.CONFIG = _CONFIG
    this.CONSTANTS = _CONSTANTS

    const {
      TIMEOUT,

      API_KEY_REQUEST_HEADER_KEY,
      CLIENT_ID_KEY_REQUEST_HEADER,

      CLIENT_ID
    } = _CONSTANTS

    this.axiosProps = {
      baseURL: _BASE,
      timeout: TIMEOUT,
      headers: {
        [API_KEY_REQUEST_HEADER_KEY]: API_KEY,
        [CLIENT_ID_KEY_REQUEST_HEADER]: CLIENT_ID
      }
    }

    this.store = {}

    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
    this.del = this.del.bind(this)
  }

  set (key = '', value = '') {
    const storeKey = STORE_KEYS_MAP[key]

    if (!storeKey) { return }

    this.store[storeKey] = value
  }

  get (key = '') {
    const storeKey = STORE_KEYS_MAP[key]

    if (!storeKey) { return }

    return this.store[storeKey]
  }

  del (key = '') {
    const storeKey = STORE_KEYS_MAP[key]

    if (!storeKey) { return }

    const value = this.store[storeKey]
    delete this.store[storeKey]
    return value
  }
}
