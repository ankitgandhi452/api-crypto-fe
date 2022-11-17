"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _uuid = require("uuid");
var _Store = _interopRequireDefault(require("./Store"));
var _ApiError = _interopRequireDefault(require("./ApiError"));
var _helper = require("./helper");
var _CONFIG2 = _interopRequireDefault(require("./defaults/CONFIG"));
var _CONSTANTS2 = _interopRequireWildcard(require("./defaults/CONSTANTS"));
var _ClientManager = _interopRequireDefault(require("./ClientManager"));
var _excluded = ["_BASE"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
var {
  ERROR_CLASSIFICATIONS
} = _ApiError.default;

// Custom Context Keys
var REQUEST_CONTEXT_MAP = {
  REQUEST_OPTIONS: 'REQUEST_OPTIONS'
};
var _context = /*#__PURE__*/new WeakMap();
var _saveRotateKeys = /*#__PURE__*/new WeakSet();
class HttpClient {
  // Http Client Store

  constructor() {
    var _CONFIG = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _CONSTANTS = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classPrivateMethodInitSpec(this, _saveRotateKeys);
    _classPrivateFieldInitSpec(this, _context, {
      writable: true,
      value: new _Store.default()
    });
    // Merge Config & Constants
    var CONFIG = _objectSpread(_objectSpread({}, _CONFIG2.default), _CONFIG);
    var CONSTANTS = _objectSpread(_objectSpread({}, _CONSTANTS2.default), _CONSTANTS);
    var {
      API_ROUTES,
      API_KEY
    } = CONFIG;
    var {
        _BASE
      } = API_ROUTES,
      ROUTE_PATHS = _objectWithoutProperties(API_ROUTES, _excluded);
    var routesPresent = !!Object.keys(ROUTE_PATHS || {}).length;

    // Warn Integrater for issues
    if (!_BASE && routesPresent) {
      console.warn('HttpClientCreator: _BASE is not passed in API_ROUTES');
    }

    // Init Context
    var {
      CLIENT_ID
    } = CONSTANTS;
    var sessionId = (0, _uuid.v4)().replaceAll('-', '');
    _classPrivateFieldGet(this, _context).set(_CONSTANTS2.CONTEXT_MAP.CONFIG, CONFIG);
    _classPrivateFieldGet(this, _context).set(_CONSTANTS2.CONTEXT_MAP.CONSTANTS, CONSTANTS);
    _classPrivateFieldGet(this, _context).set(_CONSTANTS2.CONTEXT_MAP.API_KEY, API_KEY);
    _classPrivateFieldGet(this, _context).set(_CONSTANTS2.CONTEXT_MAP.CLIENT_ID, CLIENT_ID);
    _classPrivateFieldGet(this, _context).set(_CONSTANTS2.CONTEXT_MAP.SESSION_ID, sessionId);

    // Bind Functions
    this.set = _classPrivateFieldGet(this, _context).set;
    this.get = _classPrivateFieldGet(this, _context).get;
    this.del = _classPrivateFieldGet(this, _context).del;
  }
  request() {
    var _arguments = arguments,
      _this = this;
    return _asyncToGenerator(function* () {
      var options = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : {};
      // Create a local context for all interceptos
      var requestContext = _classPrivateFieldGet(_this, _context).clone();
      var CONFIG = requestContext.get(_CONSTANTS2.CONTEXT_MAP.CONFIG);

      // Feature to use apiPath option
      var requestOptions = (0, _helper.formatRequestOptions)(options, CONFIG.API_ROUTES);

      // Set Options to local context for all interceptors
      requestContext.set(REQUEST_CONTEXT_MAP.REQUEST_OPTIONS, requestOptions);

      // Create new axios client with interceptors attached
      var client = new _ClientManager.default(requestContext);
      try {
        var response = yield client.request(requestOptions);

        // Store all keys which can rotate per request
        _classPrivateMethodGet(_this, _saveRotateKeys, _saveRotateKeys2).call(_this, requestContext);
        return response;
      } catch (error) {
        // Store all keys which can rotate per request
        _classPrivateMethodGet(_this, _saveRotateKeys, _saveRotateKeys2).call(_this, requestContext);
        var {
          request,
          response: _response
        } = error;
        // Handle Axios Response Error
        if (_response) {
          var {
            status,
            data: body
          } = _response;
          var {
            statusCode,
            message,
            error: err
          } = body;
          var {
            code,
            publicKey
          } = err;
          if (code === 'API_CRYPTO::PRIVATE_KEY_NOT_FOUND') {
            _classPrivateFieldGet(_this, _context).set(_CONSTANTS2.CONTEXT_MAP.PUBLIC_KEY, publicKey);
            return yield _this.request(options);
          }
          var _classification = ERROR_CLASSIFICATIONS.API_CALL;
          var _errorParams = {
            statusCode: statusCode || status,
            message: message || undefined,
            classification: _classification
          };
          var errorObj = body;
          var _apiError = new _ApiError.default(errorObj, _errorParams);
          throw _apiError;
        }

        // Handle Axios Request Error
        if (request) {
          var _classification2 = ERROR_CLASSIFICATIONS.NETWORK_ERROR;
          var {
            message: _message
          } = error;
          var _errorParams2 = {
            statusCode: -1,
            message: _message,
            classification: _classification2
          };
          var _apiError2 = new _ApiError.default(error, _errorParams2);
          // logger.error(err.message, err)
          delete _apiError2.error.stack;
          throw _apiError2;
        }

        // Handle any other form of error
        var classification = ERROR_CLASSIFICATIONS.CODE;
        var errorParams = {
          statusCode: -2,
          classification
        };
        var apiError = new _ApiError.default(error, errorParams);
        // logger.error(err.message, err)
        throw apiError;
      }
    })();
  }

  // Store keys which can rotate per request
}
exports.default = HttpClient;
function _saveRotateKeys2(requestContext) {
  _CONSTANTS2.ROTATE_VALUE_KEYS.forEach(key => {
    var value = requestContext.get(key);
    _classPrivateFieldGet(this, _context).set(key, value);
  });
}