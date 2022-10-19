import {
  AES_256_GCM_CONSTANTS,
  RSA_CONSTANTS
} from './CONSTANTS'
import * as utils from './utils'

const {
  ALGORITHM: AES_ALGORITHM,
  KEY_BIT_LENGTH: AES_KEY_BIT_LENGTH,
  KEY_USAGE: AES_KEY_USAGE,
  IV_LENGTH: AES_IV_LENGTH,
  CIPHER_TEXT_FORMAT: AES_CIPHER_TEXT_FORMAT,
  PLAIN_TEXT_FORMAT: AES_PLAIN_TEXT_FORMAT,
  AUTH_TAG_LENGTH: AES_AUTH_TAG_LENGTH,
  IV_FORMAT: AES_IV_FORMAT,
  DATA_SEPARATOR: AES_DATA_SEPARATOR
} = AES_256_GCM_CONSTANTS

const {
  ALGORITHM: RSA_ALGORITHM,
  KEY_WRAP_FORMAT: RSA_KEY_WRAP_FORMAT,
  KEY_FORMAT: RSA_KEY_FORMAT,
  KEY_IMPORT_FORMAT: RSA_KEY_IMPORT_FORMAT,
  KEY_OPTIONS: RSA_KEY_OPTIONS,
  KEY_USAGE: RSA_KEY_USAGE
} = RSA_CONSTANTS

const Crypto = {
  generateAndWrapKey,
  encryptData,
  decryptData
}

export default Crypto

const aesKeyObject = { name: AES_ALGORITHM, length: AES_KEY_BIT_LENGTH }
const rsaKeyKeyObject = { name: RSA_ALGORITHM, ...RSA_KEY_OPTIONS }

async function generateAndWrapKey (publicKey = '') {
  const encryptionKey = await crypto.subtle.generateKey(aesKeyObject, true, AES_KEY_USAGE)
  const publicKeyBuffer = utils.toBuffer(publicKey, RSA_KEY_FORMAT)
  const puclicKey = await crypto.subtle.importKey(RSA_KEY_IMPORT_FORMAT, publicKeyBuffer, rsaKeyKeyObject, true, RSA_KEY_USAGE)
  const encryptedEncryptionKeyBuffer = await crypto.subtle.wrapKey(RSA_KEY_WRAP_FORMAT, encryptionKey, puclicKey, rsaKeyKeyObject)
  const encryptedEncryptionKey = utils.toString(encryptedEncryptionKeyBuffer, RSA_KEY_FORMAT)
  return { encryptionKey, encryptedEncryptionKey }
}

async function encryptData (data, key) {
  const ivBuffer = crypto.getRandomValues(new Uint8Array(AES_IV_LENGTH))
  const aesGcmParams = { ...aesKeyObject, iv: ivBuffer }
  const stringifiedData = JSON.stringify({ data })
  const plainTextBuffer = utils.toBuffer(stringifiedData, AES_PLAIN_TEXT_FORMAT)

  const encryptedBuffer = await crypto.subtle.encrypt(aesGcmParams, key, plainTextBuffer)

  const cipherTextBuffer = encryptedBuffer.slice(0, (encryptedBuffer.byteLength - AES_AUTH_TAG_LENGTH))
  const authTagBuffer = encryptedBuffer.slice((encryptedBuffer.byteLength - AES_AUTH_TAG_LENGTH), encryptedBuffer.byteLength)

  const ivString = utils.toString(ivBuffer, AES_IV_FORMAT)
  const cipherTextString = utils.toString(cipherTextBuffer, AES_CIPHER_TEXT_FORMAT)
  const authTagString = utils.toString(authTagBuffer, AES_CIPHER_TEXT_FORMAT)

  const payload = [ivString, authTagString, cipherTextString].join(AES_DATA_SEPARATOR)
  return payload
}

async function decryptData (payload, key) {
  const [ivString, authTagString, cipherTextString] = payload.split(AES_DATA_SEPARATOR)

  const ivBuffer = utils.toBuffer(ivString, AES_IV_FORMAT)
  const authTagBuffer = utils.toBuffer(authTagString, AES_CIPHER_TEXT_FORMAT)
  const cipherTextBuffer = utils.toBuffer(cipherTextString, AES_CIPHER_TEXT_FORMAT)
  const encryptedBuffer = utils.concatBuffer([cipherTextBuffer, authTagBuffer])

  const aesGcmParams = { ...aesKeyObject, iv: ivBuffer }
  const plainTextBuffer = await crypto.subtle.decrypt(aesGcmParams, key, encryptedBuffer)

  const plainTextString = utils.toString(plainTextBuffer, AES_PLAIN_TEXT_FORMAT)
  const { data } = JSON.parse(plainTextString)

  return data
}

// function _validateEncryptionParams (source = '', key) {
//   if (!key) {
//     const { message, code } = INVALID_ENCRYPTION_PARAMS
//     throw { source, message, code } // eslint-disable-line no-throw-literal
//   }

//   if (key.length !== KEY_STRING_LENGTH) {
//     const { message, code } = INVALID_KEY_STRING_LENGTH
//     throw { source, message, code } // eslint-disable-line no-throw-literal
//   }
// }

// function _validateDecryptionParams (source = '', key, payload) {
//   if (!key || !payload) {
//     const { message, code } = INVALID_DECRYPTION_PARAMS
//     throw { source, message, code } // eslint-disable-line no-throw-literal
//   }

//   if (key.length !== KEY_STRING_LENGTH) {
//     const { message, code } = INVALID_KEY_STRING_LENGTH
//     throw { source, message, code } // eslint-disable-line no-throw-literal
//   }

//   if (payload.split(DATA_SEPARATOR).length !== 3) {
//     const { message, code } = INVALID_DECRYPTION_PAYLOAD
//     throw { source, message, code } // eslint-disable-line no-throw-literal
//   }
// }
