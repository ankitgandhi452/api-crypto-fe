
import { expect, describe, beforeAll, test } from '@jest/globals'
import { webcrypto as crypto } from 'node:crypto'
import HttpClient from '../src'

// Get Api
// Post Api
global.crypto = crypto

let
  httpClient

const expectedPublicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvJEIUGHW2szjP4QZpUeEqtVxjP/qgPRXscGifFPwQauVwoy4Ctl4isIXsCJxmL9mcpn9oNi0LZJG3diOYJS2mUbpnuEOQXYDV0v907FXISCOypR7pxkyrmdPFjkHIGKuXRChAYJRsfeFPhGZjwGXg9nvF54R8zTb+PPPf3NwWdDmIkPQmrDv6iPTOZTcdg9taW8SBoJLQpomnb/o53rOrAHaONR4viha1ZrX36EtGfHw+xeMPAUL4eAtglJ8WoBazJOSzKTOfZrpD/7o9jKVUn/BnH6B77FEyGwd4ZJzQrxMzTxP+RhRXzlQscR0DQ8vwzXU+1wkoTti2SkQ++oD1wIDAQAB'

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
    const { status } = response
    expect(status).toBe(200)
  })
})
