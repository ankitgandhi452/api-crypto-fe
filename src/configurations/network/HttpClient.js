import HttpClientClass from '@m92/http-client-fe-v2'
import HTTP_CLIENT_CONFIG from './HTTP_CLIENT_CONFIG'
import HTTP_CLIENT_CONSTANTS from './HTTP_CLIENT_CONSTANTS'

const HttpClient = new HttpClientClass(HTTP_CLIENT_CONFIG, HTTP_CLIENT_CONSTANTS)

export default HttpClient
