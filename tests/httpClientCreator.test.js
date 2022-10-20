
import { expect, describe, beforeAll, test } from '@jest/globals'
import { webcrypto as crypto } from 'node:crypto'
import httpClientCreator from '../src'

// Get Api
// Post Api
global.crypto = crypto

let expectedDecrptedData, apiCryptoFEInstanceDisablePayloadCryptoGrphy, apiCryptoFEInstanceEnabledPayloadCryptoGrphy

const API_ROUTES = {
  _BASE: 'http://localhost:8080'
}
const CONFIG = { API_ROUTES }
const httpClient = httpClientCreator(CONFIG)

describe('Run HttpClient Test', () => {
  test('Should be able to make Get Request before Handshake', async () => {
    const options = { url: '/handshake', method: 'GET' }
    const response = await httpClient.request(options)
    const { status, data, config } = response
    expect(status).toBe(200)
    console.log('data', data)
  })
})
