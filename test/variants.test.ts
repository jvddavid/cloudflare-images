/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
variants.test.ts (c) 2023
Desc: description
Created:  2023-12-16T01:03:52.552Z
Modified: 2023-12-16T10:07:58.441Z
*/

import CloudFlareImages from '../src/index'
import { CloudFlareAuth } from '@/interfaces'
import { describe, expect, it } from 'vitest'

const testVariantName = 'test'

function makeSut() {
  if (process.env.TEST_CLOUDFLARE_ACCOUNT_ID === undefined) {
    throw new Error('TEST_CLOUDFLARE_ACCOUNT_ID not defined')
  }
  let auth: CloudFlareAuth
  if (process.env.TEST_CLOUDFLARE_API_EMAIL && process.env.TEST_CLOUDFLARE_API_KEY) {
    auth = {
      accountId: process.env.TEST_CLOUDFLARE_ACCOUNT_ID,
      email: process.env.TEST_CLOUDFLARE_API_EMAIL,
      key: process.env.TEST_CLOUDFLARE_API_KEY,
    }
  } else if (process.env.TEST_CLOUDFLARE_TOKEN) {
    auth = {
      accountId: process.env.TEST_CLOUDFLARE_ACCOUNT_ID,
      token: process.env.TEST_CLOUDFLARE_TOKEN,
    }
  } else {
    throw new Error('TEST_CLOUDFLARE_API_EMAIL and TEST_CLOUDFLARE_API_KEY or TEST_CLOUDFLARE_TOKEN not defined')
  }

  return new CloudFlareImages(auth)
}

describe('variants api', () => {
  it('should pass', () => {
    const sut = makeSut()
    expect(sut).toBeInstanceOf(CloudFlareImages)
  })
  it('should list variants', async() => {
    const sut = makeSut()
    const variants = await sut.listVariants()
    expect(variants.success).toBeTruthy()
    expect(variants.result).toBeInstanceOf(Object)
    expect(variants.result).toHaveProperty('variants')
    expect(variants.result?.variants).toBeInstanceOf(Object)
  })
  it('should create variant', async() => {
    const sut = makeSut()
    const variant = await sut.createVariant({
      id: testVariantName,
      options: {
        width: 200,
        height: 200,
        fit: 'contain',
        metadata: 'none'
      }
    })
    expect(variant.success).toBeTruthy()
    expect(variant.result).toBeInstanceOf(Object)
    expect(variant.result).toHaveProperty('variant')
    expect(variant.result?.variant).toBeInstanceOf(Object)
  })
  it('should get variant details', async() => {
    const sut = makeSut()
    const variant = await sut.variantDetails(testVariantName)
    expect(variant.success).toBeTruthy()
    expect(variant.result).toBeInstanceOf(Object)
    expect(variant.result).toHaveProperty('variant')
    expect(variant.result?.variant).toBeInstanceOf(Object)
  })
  it('should update variant', async() => {
    const sut = makeSut()
    const variant = await sut.updateVariant({
      id: testVariantName,
      options: {
        width: 300,
        height: 300,
        fit: 'contain',
        metadata: 'none'
      }
    })
    expect(variant.success).toBeTruthy()
    expect(variant.result).toBeInstanceOf(Object)
    expect(variant.result).toHaveProperty('variant')
    expect(variant.result?.variant).toBeInstanceOf(Object)
  })
  it('should delete variant', async() => {
    const sut = makeSut()
    const variant = await sut.deleteVariant(testVariantName)
    expect(variant.success).toBeTruthy()
  })
})
