
import { expect, describe, beforeAll, test } from '@jest/globals'
import { webcrypto as crypto } from 'node:crypto'
import HttpClient from '../../src'
import { CONTEXT_MAP } from '../../src/defaults/CONSTANTS'

global.window = { crypto }

let httpClient, response
const reqBody = { req: 'req' }
const expectedResponse = { resData: { resData: 'resData' }, reqData: { req: 'req' } }

async function makeHanshakeCall () {
  const options = { apiPath: 'AUTHENTICATION.HANDSHAKE.GET' }
  const response = await httpClient.request(options)
  const { data: respBody } = response
  const { data } = respBody
  const { publicKey } = data
  httpClient.set(CONTEXT_MAP.PUBLIC_KEY, publicKey)
  httpClient.set(CONTEXT_MAP.APP_UID, 'APP_UID')
}
async function makeServiceCall () {
  const options = { apiPath: 'API_CRYPTO_SAMPLE.SERVICE.POST', data: reqBody }
  response = await httpClient.request(options)
}

beforeAll(async () => {
  const API_ROUTES = {
    _BASE: 'http://localhost:8081',
    AUTHENTICATION: {
      HANDSHAKE: {
        GET: '/handshake'
      }
    },
    API_CRYPTO_SAMPLE: {
      SERVICE: {
        POST: '/api-crypto-sample/service'
      }
    }
  }
  const ENABLE_CRPTOGRAPHY = true
  const API_KEY = 'API_KEY'
  const CONFIG = { API_ROUTES, ENABLE_CRPTOGRAPHY, API_KEY }
  httpClient = new HttpClient(CONFIG)
  await makeHanshakeCall()
  await makeServiceCall()
})

describe('Run HttpClient Test (Both Encryption Enabled)', () => {
  test('Post Service Call to return 200 status', async () => {
    const { status } = response
    expect(status).toBe(200)
  })

  test('Post Service Call to return 200 statusCode', async () => {
    const { data: resBody } = response
    const { statusCode } = resBody
    expect(statusCode).toBe(200)
  })

  test('Post Service Call to return Expected response Data', async () => {
    const { data: resBody } = response
    const { data } = resBody
    expect(data).toMatchObject(expectedResponse)
  })
})
