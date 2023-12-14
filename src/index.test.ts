/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
index.test.ts (c) 2023
Desc: description
Created:  2023-12-13T12:12:42.214Z
Modified: 2023-12-13T14:13:06.741Z
*/
import { describe, it, expect } from 'vitest'
import { type CloudFlareAuth, CloudFlareImages } from '.'

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

describe('index.test.ts', () => {
  it('should pass', () => {
    const sut = makeSut()
    expect(sut).toBeInstanceOf(CloudFlareImages)
  })
})
