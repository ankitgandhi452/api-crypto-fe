"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CryptoInterceptor = _interopRequireDefault(require("./CryptoInterceptor"));
var _HeaderInterceptor = _interopRequireDefault(require("./HeaderInterceptor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var INTERCEPTORS = [_CryptoInterceptor.default, _HeaderInterceptor.default];
var _default = INTERCEPTORS;
exports.default = _default;