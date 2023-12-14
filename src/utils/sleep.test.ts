/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
sleep.test.ts (c) 2023
Desc: description
Created:  2023-12-13T13:53:03.419Z
Modified: 2023-12-13T13:54:36.972Z
*/

import { describe, expect, it } from 'vitest'
import { sleep } from './sleep'

describe('sleep', () => {
  it('should work', async() => {
    const sleepPromise = await sleep(1)
    expect(sleepPromise).toBe(undefined)
  })
})
