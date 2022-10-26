# HTTP CLIENT FE (V2)

HTTP CLIENT FE is a custom http-request package for browser with in-built support for [JOSE (JWE) encryption](https://jose.readthedocs.io/en/latest/#jwe). The ready package for backed could be found at

1. [Express JS(NodeJS)](https://www.npmjs.com/package/@m92/api-crypto)

## Installation and Setup

### [ReactAppBoilerplate](https://github.com/ankitgandhi452/ReactAppBoilerplate)

If you're using [ReactAppBoilerplate](https://github.com/ankitgandhi452/ReactAppBoilerplate) as recommended, requires 4 step configuration:

1. Step 1 (Create a file HTTP_CLIENT_CONFIG.js)

```js
import API_ROUTES from './API_ROUTES'

const { DISABLE_CRPTOGRAPHY = '', API_KEY } = process.env

const CRPTOGRAPHY_DISABLED = DISABLE_CRPTOGRAPHY.trim().toLowerCase() === 'true'

const HTTP_CLIENT_CONFIG = {
  DISABLE_CRPTOGRAPHY: CRPTOGRAPHY_DISABLED,
  API_KEY,
  API_ROUTES
}

export default HTTP_CLIENT_CONFIG
```

2. Step 2 (Create a file HTTP_CLIENT_CONSTANTS.js)

```js
const { API_TIMEOUT, ACCESS_TOKEN_REQUEST_HEADER_KEY } = process.env

const TIMEOUT = API_TIMEOUT || 3000

const HTTP_CLIENT_CONSTANTS = {
  TIMEOUT,
  ACCESS_TOKEN_REQUEST_HEADER_KEY
}

export default HTTP_CLIENT_CONSTANTS
```

3. Step 3 (Create a file HttpClient.js)

```js
import HttpClient from '@m92/http-client-fe-v2'
import HTTP_CLIENT_CONFIG from 'configurations/network/HTTP_CLIENT_CONFIG'
import HTTP_CLIENT_CONSTANTS from 'configurations/network/HTTP_CLIENT_CONSTANTS'

const HttpClient = new HttpClient(HTTP_CLIENT_CONFIG, HTTP_CLIENT_CONSTANTS)

export default HttpClient
```

3. Step 4 (Inject in Redux Thunk)

```js
.....
const middlewares = [
  thunk.withExtraArgument({ HttpClient }) // Argument can be a request object used inside all calls
]
.....
```
## License

MIT
