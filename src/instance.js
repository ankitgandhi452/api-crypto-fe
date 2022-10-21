import axios from 'axios'

export default function getInstance (CONFIG, CONSTANTS) {
  const {
    TIMEOUT,
    API_KEY_REQUEST_HEADER_KEY,
    CLIENT_ID_KEY_REQUEST_HEADER,
    CLIENT_ID
  } = CONSTANTS
  const { API_KEY, API_ROUTES } = CONFIG
  const { _BASE } = API_ROUTES

  const axiosInstance = axios.create({
    baseURL: _BASE,
    timeout: TIMEOUT,
    headers: {
      [API_KEY_REQUEST_HEADER_KEY]: API_KEY,
      [CLIENT_ID_KEY_REQUEST_HEADER]: CLIENT_ID
    }
  })

  return axiosInstance
}
