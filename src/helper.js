import qs from 'qs'

export function formatRequestOptions (options, API_ROUTES = {}) {
  const { apiPath = '', urlParams = {}, queryParams = {}, url, method, ...requestOptions } = options

  let { path: _url = url, method: _method = method } = (apiPath && getPathFromApiRoutes(apiPath, API_ROUTES)) || {}
  _url = replaceUrlParams(_url, urlParams)
  const qsOptions = { arrayFormat: 'comma', allowDots: true, addQueryPrefix: true }
  _url += qs.stringify(queryParams, qsOptions)

  const reqOptions = {
    ...requestOptions,
    url: _url,
    method: _method
  }
  return reqOptions
}

function getPathFromApiRoutes (apiPath, API_ROUTES) {
  const apiPathParts = apiPath.split('.')
  const apiPathPartsLength = apiPathParts.length
  let path = JSON.parse(JSON.stringify(API_ROUTES))
  let method = 'GET'
  apiPathParts.forEach((key, index) => {
    path = path[key] || {}
    if (index === (apiPathPartsLength - 1)) {
      method = key
    }
  })
  return { path, method }
}

function replaceUrlParams (pathWithParams, urlParams) {
  let url = pathWithParams
  Object.keys(urlParams).forEach(key => {
    const value = urlParams[key]
    url = url.replace(`:${key}`, value)
  })
  return url
}
