'use strict'

const CAN_CAPTURE = typeof Error.captureStackTrace === 'function'
const CAN_STACK = !!new Error().stack
const ERROR_CLASSIFICATIONS = {
  CODE: 'CODE_ERROR',
  API_CALL: 'API_CALL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
}
const SERVICE_NAME = 'HttpClient'
const ERROR_NAME = 'ApiError'

export default class ApiError extends Error {
  constructor (...params) {
    const [
      error = {},
      overrideParams = {},
      override = true
    ] = params
    const {
      statusCode,
      message,
      classification,
      code,
      name
    } = overrideParams

    const errorHasKeys = !!Object.keys(error).length
    const {
      message: errMessage,
      _isApiError: errIsApiError,
      msg: errMsg,
      name: errName,
      service: errService,
      statusCode: errStatusCode,
      classification: errClassification,
      code: errCode,
      error: errError,
      data: errData,
      stack: errStack
    } = error || {}

    const hardOverride = override || !errIsApiError
    const finalMessage = (hardOverride && message) || errMessage || errMsg
    super(finalMessage)

    this._isApiError = true
    this.name = (hardOverride && name) || errName || ERROR_NAME
    this.service = (hardOverride && SERVICE_NAME) || errService || SERVICE_NAME
    this.statusCode = (hardOverride && statusCode) || errStatusCode || -1
    this.message = finalMessage
    this.msg = finalMessage
    this.classification = (hardOverride && classification) || errClassification || ERROR_CLASSIFICATIONS.CODE_ERROR
    this.code = (hardOverride && code) || errCode || undefined
    this.data = errData || undefined

    this.error = errError || (
      (errIsApiError || !errorHasKeys)
        ? undefined
        : error
    )
    const thisErrorHasKeys = !!Object.keys(this.error || {}).length
    if (!thisErrorHasKeys) { this.error = undefined }

    this.stack = errStack || (
      (CAN_CAPTURE && Error.captureStackTrace(this, ApiError)) ||
      (CAN_STACK && new Error().stack) ||
      undefined
    )

    this.toJSON = this.toJSON.bind(this)
    const jsonValue = this.toJSON()
    jsonValue.message = this.msg
    return jsonValue
  }

  toJSON () {
    const { toJSON, ...rest } = this
    return JSON.parse(JSON.stringify(rest))
  }

  static get ERROR_CLASSIFICATIONS () {
    return { ...ERROR_CLASSIFICATIONS }
  }
}
