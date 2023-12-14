/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
image.ts (c) 2023
Desc: description
Created:  2023-12-13T19:15:52.756Z
Modified: 2023-12-13T19:17:13.941Z
*/

export class CloudflareError extends Error {
  code: number

  constructor(info: {
    code: number
    message: string
  }) {
    super(info.message)
    this.name = 'CloudflareError'
    this.code = info.code
  }
}