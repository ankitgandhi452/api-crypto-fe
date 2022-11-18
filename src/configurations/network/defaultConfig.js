const { API_BASE_URL, API_TIMEOUT } = process.env

const defaultConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT || 3000
}

export default defaultConfig
