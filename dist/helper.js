"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatRequestOptions = formatRequestOptions;
var _qs = _interopRequireDefault(require("qs"));
var _excluded = ["apiPath", "urlParams", "queryParams", "url", "method"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function formatRequestOptions(options) {
  var API_ROUTES = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var {
      apiPath = '',
      urlParams = {},
      queryParams = {},
      url,
      method
    } = options,
    requestOptions = _objectWithoutProperties(options, _excluded);
  var {
    path: _url = url,
    method: _method = method
  } = apiPath && getPathFromApiRoutes(apiPath, API_ROUTES) || {};
  _url = replaceUrlParams(_url, urlParams);
  var qsOptions = {
    arrayFormat: 'comma',
    allowDots: true,
    addQueryPrefix: true
  };
  _url += _qs.default.stringify(queryParams, qsOptions);
  var reqOptions = _objectSpread(_objectSpread({}, requestOptions), {}, {
    url: _url,
    method: _method
  });
  return reqOptions;
}
function getPathFromApiRoutes(apiPath, API_ROUTES) {
  var apiPathParts = apiPath.split('.');
  var apiPathPartsLength = apiPathParts.length;
  var path = JSON.parse(JSON.stringify(API_ROUTES));
  var method = 'GET';
  apiPathParts.forEach((key, index) => {
    path = path[key] || {};
    if (index === apiPathPartsLength - 1) {
      method = key;
    }
  });
  return {
    path,
    method
  };
}
function replaceUrlParams(pathWithParams, urlParams) {
  var url = pathWithParams;
  Object.keys(urlParams).forEach(key => {
    var value = urlParams[key];
    url = url.replace(":".concat(key), value);
  });
  return url;
}