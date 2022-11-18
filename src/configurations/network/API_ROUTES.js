const { REACT_APP_API_BASE_URL = '' } = process.env

const apiRoutes = {
  _BASE: REACT_APP_API_BASE_URL,
  API_CRYPTO: {
    HANDSHAKE: {
      GET: '/handshake'
    },
    SERVICE: {
      POST: '/api-crypto-sample/service'
    }
  }
}

export default apiRoutes
