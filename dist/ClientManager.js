"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _CONSTANTS = require("./defaults/CONSTANTS");
var _Interceptors = _interopRequireDefault(require("./Interceptors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class ClientManager {
  constructor() {
    var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.context = context;
    var CONFIG = this.context.get(_CONSTANTS.CONTEXT_MAP.CONFIG);
    var CONSTANTS = this.context.get(_CONSTANTS.CONTEXT_MAP.CONSTANTS);
    var {
      TIMEOUT
    } = CONSTANTS;
    var {
      API_ROUTES
    } = CONFIG;
    var {
      _BASE
    } = API_ROUTES;
    var clientProps = {
      baseURL: _BASE,
      timeout: TIMEOUT
    };
    var client = _axios.default.create(clientProps);
    _Interceptors.default.forEach(INTERCEPTOR => {
      var interceptor = new INTERCEPTOR(this.context);
      if (interceptor.request) {
        client.interceptors.request.use(interceptor.request);
      }
      if (interceptor.response) {
        client.interceptors.response.use(interceptor.response);
      }
    });
    return client;
  }
}
exports.default = ClientManager;