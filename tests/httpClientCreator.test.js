
import { expect, describe, beforeAll, test } from '@jest/globals'
import { webcrypto as crypto } from 'node:crypto'
import httpClientCreator from '../src'

// Get Api
// Post Api


describe('Run HttpClient Test', () => {

})

global.crypto = crypto

let expectedDecrptedData, apiCryptoFEInstanceDisablePayloadCryptoGrphy, apiCryptoFEInstanceEnabledPayloadCryptoGrphy

beforeAll(async () => {
  const DISABLE_CRPTOGRAPHY = false
  const ENCRYPTION_KEY_REQUEST_HEADER = 'X-API-Encryption-Key'
  const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnWhQNjFr0YNgVZcye2EU5ZPNCoLiTH55M3IzK8ba7ZnJBn1LritHqvJMvEikIaQd3CJB3JEhJeFFNz8utKdbCGiQMsvPUWRU3ldP1E7I6Wd2dhmzll/GElNUuc8sqzEpBcSCVwMtCQdvn0jBbTQw8/Qi2c31Q+vAn5fqGRroANUMMwQtMVk/DIi3MRo8IUkcemlhtZVEnszgKJE77onLIpq80+7MECl34cWvwZvUeJYm99ML4cGUua1AMTbbGlLiZXm68iXp6p+eAe4MLDUWicqRg1Zl3DfNjGkN0TuJmX1HFY7Teeh6YnhpPyL67BgqV24Q5FuDJkl6UXRtqrQ4sQIDAQAB'

  const data = { test: 'test' }
  expectedDecrptedData = data
  const CONFIG1 = { DISABLE_CRPTOGRAPHY }
  const CONFIG2 = { DISABLE_CRPTOGRAPHY: true }
  const CONSTANTS = { ENCRYPTION_KEY_REQUEST_HEADER }
  apiCryptoFEInstanceDisablePayloadCryptoGrphy = new ApiCryptoFE(publicKey, CONFIG2, CONSTANTS)
  apiCryptoFEInstanceEnabledPayloadCryptoGrphy = new ApiCryptoFE(publicKey, CONFIG1, CONSTANTS)
  await apiCryptoFEInstanceDisablePayloadCryptoGrphy.generateAndWrapKey(data, {})
  await apiCryptoFEInstanceEnabledPayloadCryptoGrphy.generateAndWrapKey(data, {})
})

describe('Run ApiCrypto Test', () => {
  test('Should Generate 3 parts encrypted payload when enabled', async () => {
    const { payload } = await apiCryptoFEInstanceEnabledPayloadCryptoGrphy.encryptData(expectedDecrptedData, {})
    expect(payload.split('.').length).toBe(3)
  })

  test('Should Generate encrypted payload same as data when disabled', async () => {
    const encryptedData = await apiCryptoFEInstanceDisablePayloadCryptoGrphy.encryptData(expectedDecrptedData, {})
    expect(encryptedData).toStrictEqual(expectedDecrptedData)
  })

  test('Should Generate 3 parts encrypted payload when enabled', async () => {
    const encryptedData = await apiCryptoFEInstanceEnabledPayloadCryptoGrphy.encryptData(expectedDecrptedData, {})
    const decryptData = await apiCryptoFEInstanceEnabledPayloadCryptoGrphy.decryptData(encryptedData, {})
    expect(decryptData).toStrictEqual(expectedDecrptedData)
  })

  test('Should Generate encrypted payload same as data when disabled', async () => {
    const encryptedData = await apiCryptoFEInstanceDisablePayloadCryptoGrphy.encryptData(expectedDecrptedData, {})
    const decryptData = await apiCryptoFEInstanceDisablePayloadCryptoGrphy.decryptData(encryptedData, {})
    expect(decryptData).toStrictEqual(expectedDecrptedData)
  })
})
