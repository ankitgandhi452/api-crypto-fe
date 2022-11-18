const { API_TIMEOUT } = process.env

const TIMEOUT = API_TIMEOUT || 3000

const HTTP_CLIENT_CONSTANTS = {
  TIMEOUT
}

export default HTTP_CLIENT_CONSTANTS
