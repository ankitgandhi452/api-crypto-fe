"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CONSTANTS = require("./CONSTANTS");
var utils = _interopRequireWildcard(require("./utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var {
  ALGORITHM: AES_ALGORITHM,
  KEY_BIT_LENGTH: AES_KEY_BIT_LENGTH,
  KEY_USAGE: AES_KEY_USAGE,
  IV_LENGTH: AES_IV_LENGTH,
  CIPHER_TEXT_FORMAT: AES_CIPHER_TEXT_FORMAT,
  PLAIN_TEXT_FORMAT: AES_PLAIN_TEXT_FORMAT,
  AUTH_TAG_LENGTH: AES_AUTH_TAG_LENGTH,
  IV_FORMAT: AES_IV_FORMAT,
  DATA_SEPARATOR: AES_DATA_SEPARATOR,
  ERRORS: AES_ERRORS
} = _CONSTANTS.AES_256_GCM_CONSTANTS;
var {
  ALGORITHM: RSA_ALGORITHM,
  KEY_WRAP_FORMAT: RSA_KEY_WRAP_FORMAT,
  KEY_FORMAT: RSA_KEY_FORMAT,
  KEY_IMPORT_FORMAT: RSA_KEY_IMPORT_FORMAT,
  KEY_OPTIONS: RSA_KEY_OPTIONS,
  KEY_USAGE: RSA_KEY_USAGE,
  ERRORS: RSA_ERRORS
} = _CONSTANTS.RSA_CONSTANTS;
var {
  INVALID_ENCRYPTION_KEY: RSA_INVALID_ENCRYPTION_KEY
} = RSA_ERRORS;
var {
  INVALID_ENCRYPTION_PARAMS: AES_INVALID_ENCRYPTION_PARAMS,
  INVALID_DECRYPTION_PARAMS: AES_INVALID_DECRYPTION_PARAMS
} = AES_ERRORS;
var Crypto = {
  generateAndWrapKey,
  encryptData,
  decryptData
};
var _default = Crypto;
exports.default = _default;
var aesKeyObject = {
  name: AES_ALGORITHM,
  length: AES_KEY_BIT_LENGTH
};
var rsaKeyKeyObject = _objectSpread({
  name: RSA_ALGORITHM
}, RSA_KEY_OPTIONS);
function generateAndWrapKey() {
  return _generateAndWrapKey.apply(this, arguments);
}
function _generateAndWrapKey() {
  _generateAndWrapKey = _asyncToGenerator(function* () {
    var publicKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var source = 'APICryptoFE::generateAndWrapKey';
    _validategenerateAndWrapKeyParams(source, publicKey);
    var encryptionKey = yield window.crypto.subtle.generateKey(aesKeyObject, true, AES_KEY_USAGE);
    var publicKeyBuffer = utils.toBuffer(publicKey, RSA_KEY_FORMAT);
    var puclicKey = yield window.crypto.subtle.importKey(RSA_KEY_IMPORT_FORMAT, publicKeyBuffer, rsaKeyKeyObject, true, RSA_KEY_USAGE);
    var encryptedEncryptionKeyBuffer = yield window.crypto.subtle.wrapKey(RSA_KEY_WRAP_FORMAT, encryptionKey, puclicKey, rsaKeyKeyObject);
    var encryptedEncryptionKey = utils.toString(encryptedEncryptionKeyBuffer, RSA_KEY_FORMAT);
    return {
      encryptionKey,
      encryptedEncryptionKey
    };
  });
  return _generateAndWrapKey.apply(this, arguments);
}
function encryptData(_x, _x2) {
  return _encryptData.apply(this, arguments);
}
function _encryptData() {
  _encryptData = _asyncToGenerator(function* (data, key) {
    var source = 'APICryptoFE::encryptData';
    _validateEncryptParams(source, key);
    var ivBuffer = window.crypto.getRandomValues(new Uint8Array(AES_IV_LENGTH));
    var aesGcmParams = _objectSpread(_objectSpread({}, aesKeyObject), {}, {
      iv: ivBuffer
    });
    var stringifiedData = JSON.stringify({
      data
    });
    var plainTextBuffer = utils.toBuffer(stringifiedData, AES_PLAIN_TEXT_FORMAT);
    var encryptedBuffer = yield window.crypto.subtle.encrypt(aesGcmParams, key, plainTextBuffer);
    var cipherTextBuffer = encryptedBuffer.slice(0, encryptedBuffer.byteLength - AES_AUTH_TAG_LENGTH);
    var authTagBuffer = encryptedBuffer.slice(encryptedBuffer.byteLength - AES_AUTH_TAG_LENGTH, encryptedBuffer.byteLength);
    var ivString = utils.toString(ivBuffer, AES_IV_FORMAT);
    var cipherTextString = utils.toString(cipherTextBuffer, AES_CIPHER_TEXT_FORMAT);
    var authTagString = utils.toString(authTagBuffer, AES_CIPHER_TEXT_FORMAT);
    var payload = [ivString, authTagString, cipherTextString].join(AES_DATA_SEPARATOR);
    return payload;
  });
  return _encryptData.apply(this, arguments);
}
function decryptData(_x3, _x4) {
  return _decryptData.apply(this, arguments);
}
function _decryptData() {
  _decryptData = _asyncToGenerator(function* (payload, key) {
    var source = 'APICryptoFE::decryptData';
    _validateDecryptParams(source, payload, key);
    var [ivString, authTagString, cipherTextString] = payload.split(AES_DATA_SEPARATOR);
    var ivBuffer = utils.toBuffer(ivString, AES_IV_FORMAT);
    var authTagBuffer = utils.toBuffer(authTagString, AES_CIPHER_TEXT_FORMAT);
    var cipherTextBuffer = utils.toBuffer(cipherTextString, AES_CIPHER_TEXT_FORMAT);
    var encryptedBuffer = utils.concatBuffer([cipherTextBuffer, authTagBuffer]);
    var aesGcmParams = _objectSpread(_objectSpread({}, aesKeyObject), {}, {
      iv: ivBuffer
    });
    var plainTextBuffer = yield window.crypto.subtle.decrypt(aesGcmParams, key, encryptedBuffer);
    var plainTextString = utils.toString(plainTextBuffer, AES_PLAIN_TEXT_FORMAT);
    var {
      data
    } = JSON.parse(plainTextString);
    return data;
  });
  return _decryptData.apply(this, arguments);
}
function _validategenerateAndWrapKeyParams() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var publicKey = arguments.length > 1 ? arguments[1] : undefined;
  if (!publicKey) {
    var {
      message,
      code
    } = RSA_INVALID_ENCRYPTION_KEY;
    throw {
      source,
      message,
      code
    }; // eslint-disable-line no-throw-literal
  }
}

function _validateEncryptParams() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var key = arguments.length > 1 ? arguments[1] : undefined;
  if (!key) {
    var {
      message,
      code
    } = AES_INVALID_ENCRYPTION_PARAMS;
    throw {
      source,
      message,
      code
    }; // eslint-disable-line no-throw-literal
  }
}

function _validateDecryptParams() {
  var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var payload = arguments.length > 1 ? arguments[1] : undefined;
  var key = arguments.length > 2 ? arguments[2] : undefined;
  if (!payload || typeof payload !== 'string' || payload.split(AES_DATA_SEPARATOR).length !== 3 || !key) {
    var {
      message,
      code
    } = AES_INVALID_DECRYPTION_PARAMS;
    throw {
      source,
      message,
      code
    }; // eslint-disable-line no-throw-literal
  }
}