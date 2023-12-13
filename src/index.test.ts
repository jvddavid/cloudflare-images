/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
index.test.ts (c) 2023
Desc: description
Created:  2023-12-13T12:12:42.214Z
Modified: 2023-12-13T13:08:06.251Z
*/
import { describe, it, expect } from 'vitest'
import { CloudFlareImages } from '.'

function makeSut() {
  return new CloudFlareImages()
}

describe('index.test.ts', () => {
  it('should pass', () => {
    const sut = makeSut()
    expect(sut).toBeInstanceOf(CloudFlareImages)
  })
})
