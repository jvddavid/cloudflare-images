/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
api.test.ts (c) 2023
Desc: description
Created:  2023-12-15T02:24:44.241Z
Modified: 2023-12-15T02:26:06.808Z
*/

import { describe, it, expect } from 'vitest'
import { HttpError } from './api'

describe('errors api tests', () => {
  it('should be code and message is the same of the params', () => {
    const error = new HttpError({ code: 404, message: 'Not Found' })
    expect(error.code).toBe(404)
    expect(error.message).toBe('Not Found')
  })
})