/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
image.ts (c) 2023
Desc: description
Created:  2023-12-13T19:15:52.756Z
Modified: 2023-12-15T02:11:35.146Z
*/

export class HttpError extends Error {
  code: number

  constructor(info: {
    code: number
    message: string
  }) {
    super(info.message)
    this.name = 'HttpError'
    this.code = info.code
  }
}