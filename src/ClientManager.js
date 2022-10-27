import axios from 'axios'
import { CONTEXT_MAP } from './defaults/CONSTANTS'
import INTERCEPTORS from './Interceptors'

export default class ClientManager {
  constructor (context = {}) {
    this.context = context

    const CONFIG = this.context.get(CONTEXT_MAP.CONFIG)
    const CONSTANTS = this.context.get(CONTEXT_MAP.CONSTANTS)

    const { TIMEOUT } = CONSTANTS
    const { API_ROUTES } = CONFIG
    const { _BASE } = API_ROUTES

    const clientProps = { baseURL: _BASE, timeout: TIMEOUT }
    const client = axios.create(clientProps)

    INTERCEPTORS.forEach(INTERCEPTOR => {
      const interceptor = new INTERCEPTOR(this.context)

      if (interceptor.request) {
        client.interceptors.request.use(interceptor.request)
      }

      if (interceptor.response) {
        client.interceptors.response.use(interceptor.response)
      }
    })
    return client
  }
}
