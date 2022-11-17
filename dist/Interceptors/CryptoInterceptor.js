"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _Crypto = _interopRequireDefault(require("../Crypto"));
var _CONSTANTS = require("../defaults/CONSTANTS");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
var _encryptionKey = /*#__PURE__*/new WeakMap();
class CryptoInterceptor {
  constructor() {
    var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classPrivateFieldInitSpec(this, _encryptionKey, {
      writable: true,
      value: void 0
    });
    this.context = context;
    this.request = this.request.bind(this);
    this.response = this.response.bind(this);
  }
  request() {
    var _arguments = arguments,
      _this = this;
    return _asyncToGenerator(function* () {
      var request = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : {};
      var CONFIG = _this.context.get(_CONSTANTS.CONTEXT_MAP.CONFIG);
      var CONSTANTS = _this.context.get(_CONSTANTS.CONTEXT_MAP.CONSTANTS);
      var {
        ENCRYPTION_KEY_REQUEST_HEADER
      } = CONSTANTS;
      var {
        ENABLE_CRPTOGRAPHY
      } = CONFIG;
      var publicKey = _this.context.get(_CONSTANTS.CONTEXT_MAP.PUBLIC_KEY);
      var {
        disableCrypto = false
      } = _this.context.get(_CONSTANTS.CONTEXT_MAP.REQUEST_OPTIONS);
      if (!ENABLE_CRPTOGRAPHY || disableCrypto) {
        return request;
      }
      var {
        encryptionKey,
        encryptedEncryptionKey
      } = yield _Crypto.default.generateAndWrapKey(publicKey);
      _classPrivateFieldSet(_this, _encryptionKey, encryptionKey);
      var requestHeaders = {
        [ENCRYPTION_KEY_REQUEST_HEADER.toLowerCase()]: encryptedEncryptionKey
      };
      var {
        data
      } = request;
      var payload = yield _Crypto.default.encryptData(data, encryptionKey);

      // Keeping user specified headers priority
      request.headers = _objectSpread(_objectSpread({}, requestHeaders), request.headers);
      request.data = {
        payload
      };
      return request;
    })();
  }
  response() {
    var _arguments2 = arguments,
      _this2 = this;
    return _asyncToGenerator(function* () {
      var response = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : {};
      var CONFIG = _this2.context.get(_CONSTANTS.CONTEXT_MAP.CONFIG);
      var {
        ENABLE_CRPTOGRAPHY
      } = CONFIG;
      var {
        data: body = {}
      } = response;
      var {
        data = {},
        error
      } = body;
      var {
        payload
      } = data;
      var {
        disableCrypto = false
      } = _this2.context.get(_CONSTANTS.CONTEXT_MAP.REQUEST_OPTIONS);
      if (!ENABLE_CRPTOGRAPHY || disableCrypto || error) {
        return response;
      }
      var decryptedData = yield _Crypto.default.decryptData(payload, _classPrivateFieldGet(_this2, _encryptionKey));
      response.data = decryptedData;
      return response;
    })();
  }
}
exports.default = CryptoInterceptor;