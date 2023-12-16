/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
images.test.ts (c) 2023
Desc: description
Created:  2023-12-16T01:03:43.936Z
Modified: 2023-12-16T01:13:40.176Z
*/

import { describe, it, expect } from 'vitest'
import CloudFlareImages from '../src/index'
import type { CloudFlareAuth } from '@/interfaces'
import { readFileSync } from 'fs'
import { resolve } from 'path'

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

const testImageURL = 'https://picsum.photos/200/300'
const testImagePath = resolve(__dirname, '..', 'test', 'test-image.jpg')
const testImageBuffer = readFileSync(testImagePath)
const testImageBase64 = testImageBuffer.toString('base64')

describe('images api', () => {
  it('should pass', () => {
    const sut = makeSut()
    expect(sut).toBeInstanceOf(CloudFlareImages)
  })
  it('should list images', async() => {
    const sut = makeSut()
    const images = await sut.list()
    expect(images.success).toBeTruthy()
    expect(images.result).toBeInstanceOf(Object)
    expect(images.result).toHaveProperty('images')
    expect(images.result?.images).toBeInstanceOf(Array)
  })
  it('should list images v2', async() => {
    const sut = makeSut()
    const images = await sut.listV2()
    expect(images.success).toBeTruthy()
    expect(images.result).toBeInstanceOf(Object)
    expect(images.result).toHaveProperty('images')
    expect(images.result).toHaveProperty('continuation_token')
    expect(images.result?.images).toBeInstanceOf(Array)
    expect(images.result?.continuation_token).satisfies((continuation_token: string | null) => {
      return continuation_token === null || typeof continuation_token === 'string'
    })
  })
  it('should get stats', async() => {
    const sut = makeSut()
    const stats = await sut.stats()
    expect(stats.result).toBeInstanceOf(Object)
  })
  it('should upload image', async() => {
    const sut = makeSut()
    const image = await sut.uploadImageURL({
      imageURL: testImageURL,
      metadata: { test: 'test' },
    })
    expect(image.result).toBeInstanceOf(Object)
  })
  it('should upload and get image details', async() => {
    const sut = makeSut()
    const image = await sut.uploadImageURL({
      imageURL: testImageURL,
      metadata: { test: 'test' },
    })
    if (image.result?.id === undefined) throw new Error('image id is undefined')
    const imageDetails = await sut.imageDetails(image.result.id)
    expect(imageDetails.result?.id).toEqual(image.result.id)
  })
  it('should upload and get base image', async() => {
    const sut = makeSut()
    const image = await sut.uploadImageURL({
      imageURL: testImageURL,
      metadata: { test: 'test' },
    })
    expect(image.success).toBeTruthy()
    if (image.result?.id === undefined) throw new Error('image id is undefined')
    const baseImage = await sut.baseImage(image.result.id)
    expect(baseImage.success).toBeTruthy()
  })
  it('should get direct upload url v2', async() => {
    const sut = makeSut()
    const directUploadUrlV2 = await sut.directUploadUrlV2()
    expect(directUploadUrlV2.success).toBeTruthy()
  })
  it('should upload image with buffer', async() => {
    const sut = makeSut()
    const image = await sut.uploadImage({
      name: 'test-image.jpg',
      image: testImageBuffer,
      metadata: { test: 'test' },
    })
    expect(image.success).toBeTruthy()
  })
  it('should upload image with base64', async() => {
    const sut = makeSut()
    const image = await sut.uploadImage({
      name: 'test-image.jpg',
      image: testImageBase64,
      metadata: { test: 'test' },
    })
    expect(image.success).toBeTruthy()
  })
  it('should update image', async() => {
    const sut = makeSut()
    const image = await sut.uploadImageURL({
      imageURL: testImageURL,
      metadata: { test: 'test' },
    })
    expect(image.success).toBeTruthy()
    if (image.result?.id === undefined) throw new Error('image id is undefined')
    const updateImage = await sut.updateImage({
      imageId: image.result.id,
      metadata: { test: 'test2' },
    })
    expect(updateImage.success).toBeTruthy()
  })
  it('should upload and delete images with metadata test', async() => {
    const sut = makeSut()
    const image = await sut.uploadImageURL({
      imageURL: testImageURL,
      metadata: { test: 'test' },
    })
    expect(image.success).toBeTruthy()
    if (image.result?.id === undefined) throw new Error('image id is undefined')
    const list = await sut.listV2()
    expect(list.success).toBeTruthy()
    if (list.result?.images === undefined) throw new Error('list is empty')
    for (const image of list.result.images) {
      if (image.meta?.test === 'test' || image.meta?.test === 'test2') {
        const deleteImage = await sut.deleteImage(image.id)
        expect(deleteImage.success).toBeTruthy()
      }
    }
  }, 100000)
})
