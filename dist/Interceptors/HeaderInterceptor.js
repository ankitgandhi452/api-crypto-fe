"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _uuid = require("uuid");
var _CONSTANTS = require("../defaults/CONSTANTS");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var REQUEST_HEADER_CONTEXT_MAP = {
  SESSION_ID_REQUEST_HEADER_KEY: _CONSTANTS.CONTEXT_MAP.SESSION_ID,
  REQUEST_ID_REQUEST_HEADER_KEY: _CONSTANTS.CONTEXT_MAP.REQUEST_ID,
  ACCESS_TOKEN_REQUEST_HEADER_KEY: _CONSTANTS.CONTEXT_MAP.ACCESS_TOKEN,
  API_KEY_REQUEST_HEADER_KEY: _CONSTANTS.CONTEXT_MAP.API_KEY,
  CLIENT_ID_KEY_REQUEST_HEADER: _CONSTANTS.CONTEXT_MAP.CLIENT_ID,
  APP_UID_REQUEST_HEADER_KEY: _CONSTANTS.CONTEXT_MAP.APP_UID
};
var RESPONSE_HEADER_CONTEXT_MAP = {
  SESSION_ID_RESPONSE_HEADER_KEY: _CONSTANTS.CONTEXT_MAP.SESSION_ID,
  ACCESS_TOKEN_RESPONSE_HEADER_KEY: _CONSTANTS.CONTEXT_MAP.ACCESS_TOKEN,
  APP_UID_RESPONSE_HEADER_KEY: _CONSTANTS.CONTEXT_MAP.APP_UID
};
class HeaderInterceptor {
  constructor() {
    var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.context = context;
    var requestId = (0, _uuid.v4)().replaceAll('-', '');
    var contextKey = REQUEST_HEADER_CONTEXT_MAP.REQUEST_ID_REQUEST_HEADER_KEY;
    this.context.set(contextKey, requestId);
    this.request = this.request.bind(this);
    this.response = this.response.bind(this);
  }
  request() {
    var request = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var constants = this.context.get(_CONSTANTS.CONTEXT_MAP.CONSTANTS);
    var headers = {};
    Object.keys(REQUEST_HEADER_CONTEXT_MAP).forEach(header => {
      var constextKey = REQUEST_HEADER_CONTEXT_MAP[header];
      var value = this.context.get(constextKey);
      var key = constants[header].toLowerCase();
      if (value) {
        headers[key] = value;
      }
    });
    request.headers = _objectSpread(_objectSpread({}, headers), request.headers);
    return request;
  }
  response() {
    var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var constants = this.context.get(_CONSTANTS.CONTEXT_MAP.CONSTANTS);
    var {
      headers
    } = response;
    Object.keys(RESPONSE_HEADER_CONTEXT_MAP).forEach(header => {
      var constextKey = RESPONSE_HEADER_CONTEXT_MAP[header];
      var key = constants[header].toLowerCase();
      var value = headers[key];
      this.context.set(constextKey, value);
    });
    return response;
  }
}
exports.default = HeaderInterceptor;