
import { expect, describe, beforeAll, test } from '@jest/globals'
import { webcrypto as crypto } from 'node:crypto'
import HttpClient from '../src'

// Get Api
// Post Api
global.crypto = crypto

let
  httpClient

const expectedPublicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2ekGU6xM6iR8sTNfpbiYNyZ8R26Zn8MbRKGuVrbMnYDPcgc9hHepxOZNAMKzb3Rf61pIv49OiAEg8fDPLp4p2p+VJd25dH9r2BqH9ZRwEA7xx9Id2ZsehZKARTa/7Y1JPu6yTihnCukpEB1oy2QD3xi9X1FvTPAjMEEx0oOLOc+vjWYDScrXmEMvprPorYDe9VdJf95cUMXpFedbgIBMdRsa7+RJ1zywRUDpY4vKxrCa022hwhrHeEzE9+0u7SaiK2C2YDyA2aAkfD4abCRsYJ47648EahxvkdLSwoq6OY7dyo/w9z/e5iYEDN0KCUgGnhU1es5Zl03SiJwkXOTkeQIDAQAB'

beforeAll(async () => {
  const API_ROUTES = {
    _BASE: 'http://localhost:8080'
  }
  const DISABLE_CRPTOGRAPHY = false
  const CONFIG = { API_ROUTES, DISABLE_CRPTOGRAPHY }
  httpClient = new HttpClient(CONFIG)
})

describe('Run HttpClient Test', () => {
  // test('Should be able to make Get Request before Handshake', async () => {
  //   const options = { url: '/handshake', method: 'GET' }
  //   const response = await httpClient.request(options)
  //   const { status, data: respBody } = response
  //   const { data } = respBody
  //   const { publicKey } = data
  //   expect(status).toBe(200)
  //   expect(publicKey).toBe(expectedPublicKey)
  // })

  test('Should be able to make Service Call Post Handshak', async () => {
    httpClient.setStore('PUBLIC_KEY', expectedPublicKey)
    const options = { url: '/api-crypto-sample/service', method: 'POST' }
    const response = await httpClient.request(options)
    const { status, data: resBody } = response
    const { statusCode } = resBody
    expect(status).toBe(200)
    expect(statusCode).toBe(200)
  })
})
