
import { expect, describe, beforeAll, test } from '@jest/globals'
import { webcrypto as crypto } from 'node:crypto'
import httpClientCreator from '../src'

// Get Api
// Post Api
global.crypto = crypto

let httpClient

beforeAll(async () => {
  const API_ROUTES = {
    _BASE: 'http://localhost:8080'
  }
  const DISABLE_CRPTOGRAPHY = false
  const CONFIG = { API_ROUTES, DISABLE_CRPTOGRAPHY }
  httpClient = httpClientCreator(CONFIG)

  const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnWhQNjFr0YNgVZcye2EU5ZPNCoLiTH55M3IzK8ba7ZnJBn1LritHqvJMvEikIaQd3CJB3JEhJeFFNz8utKdbCGiQMsvPUWRU3ldP1E7I6Wd2dhmzll/GElNUuc8sqzEpBcSCVwMtCQdvn0jBbTQw8/Qi2c31Q+vAn5fqGRroANUMMwQtMVk/DIi3MRo8IUkcemlhtZVEnszgKJE77onLIpq80+7MECl34cWvwZvUeJYm99ML4cGUua1AMTbbGlLiZXm68iXp6p+eAe4MLDUWicqRg1Zl3DfNjGkN0TuJmX1HFY7Teeh6YnhpPyL67BgqV24Q5FuDJkl6UXRtqrQ4sQIDAQAB'

  httpClient.set('PUBLIC_KEY', publicKey)
})

describe('Run HttpClient Test', () => {
  test('Should be able to make Get Request before Handshake', async () => {
    const options = { url: '/api-crypto-sample/service', method: 'POST', data: { test: 'test' } }
    const response = await httpClient.request(options)
    const { status } = response
    expect(status).toBe(200)
  })
})
