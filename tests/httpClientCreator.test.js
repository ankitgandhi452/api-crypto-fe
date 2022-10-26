
import { expect, describe, beforeAll, test } from '@jest/globals'
import { webcrypto as crypto } from 'node:crypto'
import HttpClient from '../src'

// Get Api
// Post Api
global.crypto = crypto

let
  httpClient

const expectedPublicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp2/gKUssBNZzG0KOqQECfGhv+Hzlp4Qj3nQhXw/+0t+WnQ6O75E1SZan59GYXek0X8fT5qs1qLRKTYn8ZNIxe3BvWRET82H+ZaAG/jakFK+a19pa49Hy4kl0Gy5xiWJ93Hudh4ZxZcdYU6wNY/x2hSEyv1ag+adPH+5A9EtZ1F4f3zl5BKsJpGqSk1ZsNDk09AyoTyA3gCMqyzfiYvpf8Tj31Dooqtlkq2xBi7UA0Z/yv/Xo9HYMtsjCQIIc0hrH0IaFhm8iBTwzVtam2CMIFaxygAPJUV4cZ7aoxjusbfGP2kyJsZlMnYAhWgvh6ljt1o3iQQDHA+sW6AeYLSNi2QIDAQAB'

beforeAll(async () => {
  const API_ROUTES = {
    _BASE: 'http://localhost:8080'
  }
  const DISABLE_CRPTOGRAPHY = false
  const CONFIG = { API_ROUTES, DISABLE_CRPTOGRAPHY }
  httpClient = new HttpClient(CONFIG)
})

describe('Run HttpClient Test', () => {
  test('Should be able to make Get Request before Handshake', async () => {
    const options = { url: '/handshake', method: 'GET' }
    const response = await httpClient.request(options)
    const { status, data: respBody } = response
    const { data } = respBody
    const { publicKey } = data
    expect(status).toBe(200)
    expect(publicKey).toBe(expectedPublicKey)
  })

  test('Should be able to make Service Call Post Handshak', async () => {
    httpClient.setStore('PUBLIC_KEY', expectedPublicKey)
    const options = { url: '/api-crypto-sample/service', method: 'POST', data: { test: 'test' } }
    const response = await httpClient.request(options)
    const { status, data: resBody } = response
    const { statusCode } = resBody
    expect(status).toBe(200)
    expect(statusCode).toBe(200)
  })
})
