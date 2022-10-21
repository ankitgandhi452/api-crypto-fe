import { v4 } from 'uuid'
import Crypto from './Crypto'

export default function getInterceptos () {
  const {
    CONFIG = {},
    CONSTANTS = {},
    STORE_KEYS_MAP = {},
    store = {},
    CUSTOM_HEADER_CONFIG = []
  } = this

  const keyStore = {
    encryptionKey: '',
    encryptedEncryptionKey: '',
    publicKey: store[STORE_KEYS_MAP.PUBLIC_KEY]
  }

  const requestInteceptor = async (request) => {
    const _request = await encryptData(await addCustomHeader(request))
    return _request
  }
  const responseInteceptor = async (response) => {
    const _response = await decryptData(response)
    return _response
  }

  const response = {
    requestInteceptor,
    responseInteceptor
  }

  return response

  async function addCustomHeader (request = {}) {
    const requestHeaders = {}
    CUSTOM_HEADER_CONFIG.forEach((config) => {
      const { REQUEST_HEADER_KEY, STORE_KEY } = config
      const headerValue = store[STORE_KEY]
      if (headerValue) {
        requestHeaders[REQUEST_HEADER_KEY.toLowerCase()] = headerValue
      }
    })

    // Set Request Id
    const { REQUEST_ID_REQUEST_HEADER_KEY } = CONSTANTS
    const requestId = v4()
    requestHeaders[REQUEST_ID_REQUEST_HEADER_KEY.toLowerCase()] = requestId

    // Keeping user specified headers priority
    request.headers = { ...requestHeaders, ...request.headers }
    return request
  }

  async function encryptData (request = {}) {
    const { ENCRYPTION_KEY_REQUEST_HEADER } = CONSTANTS
    const { DISABLE_CRPTOGRAPHY } = CONFIG

    if (DISABLE_CRPTOGRAPHY || !keyStore.publicKey) { return request }

    const { encryptionKey, encryptedEncryptionKey } = await Crypto.generateAndWrapKey(keyStore.publicKey)
    keyStore.encryptionKey = encryptionKey
    keyStore.encryptedEncryptionKey = encryptedEncryptionKey

    const requestHeaders = {
      [ENCRYPTION_KEY_REQUEST_HEADER]: encryptedEncryptionKey
    }

    const payload = await Crypto.encryptData(request.data, keyStore.encryptionKey)

    // Keeping user specified headers priority
    request.headers = { ...requestHeaders, ...request.headers }
    request.data = { payload }
    return request
  }

  async function decryptData (response = {}) {
    const { DISABLE_CRPTOGRAPHY } = CONFIG
    const { data: body = {} } = response
    const { data = {} } = body
    const { payload } = data

    if (DISABLE_CRPTOGRAPHY || !keyStore.publicKey || !payload) { return response }

    const decryptedData = await Crypto.decryptData(payload, keyStore.encryptionKey)
    response.data = decryptedData
    return response
  }
}
