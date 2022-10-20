
import { expect, describe, beforeAll, test } from '@jest/globals'
import { webcrypto as crypto } from 'node:crypto'
import Crypto from '../src/Crypto'

global.crypto = crypto

let keyData, encryptedData, decryptedData, expectedDecrptedData
const expetedEncryptionKeyObject = { type: 'secret' }

beforeAll(async () => {
  const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnWhQNjFr0YNgVZcye2EU5ZPNCoLiTH55M3IzK8ba7ZnJBn1LritHqvJMvEikIaQd3CJB3JEhJeFFNz8utKdbCGiQMsvPUWRU3ldP1E7I6Wd2dhmzll/GElNUuc8sqzEpBcSCVwMtCQdvn0jBbTQw8/Qi2c31Q+vAn5fqGRroANUMMwQtMVk/DIi3MRo8IUkcemlhtZVEnszgKJE77onLIpq80+7MECl34cWvwZvUeJYm99ML4cGUua1AMTbbGlLiZXm68iXp6p+eAe4MLDUWicqRg1Zl3DfNjGkN0TuJmX1HFY7Teeh6YnhpPyL67BgqV24Q5FuDJkl6UXRtqrQ4sQIDAQAB'

  const data = { test: 'test' }
  expectedDecrptedData = data
  keyData = await Crypto.generateAndWrapKey(publicKey)
  encryptedData = await Crypto.encryptData(data, keyData.encryptionKey)
  decryptedData = await Crypto.decryptData(encryptedData, keyData.encryptionKey)
})

describe('Run Crypto Test', () => {
  test('Should Generate encryption key', async () => {
    expect(keyData).toHaveProperty('encryptionKey')
  })

  test('Should Generate encrypted encryption key', async () => {
    expect(keyData).toHaveProperty('encryptedEncryptionKey')
  })

  test('Should Generate encryption key of type CryptoKey Secret', async () => {
    expect(keyData.encryptionKey).toMatchObject(expetedEncryptionKeyObject)
  })

  test('Should Generate 3 parts encrypted payload', async () => {
    expect(encryptedData.split('.').length).toBe(3)
  })

  test('Should Generate decryptedData same as data', async () => {
    expect(decryptedData).toStrictEqual(expectedDecrptedData)
  })
})
