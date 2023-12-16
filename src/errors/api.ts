/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
image.ts (c) 2023
Desc: description
Created:  2023-12-13T19:15:52.756Z
Modified: 2023-12-15T23:59:38.129Z
*/

import type { AxiosError } from 'axios'

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

export class RequestError<T = unknown> extends Error {
  code: number
  data: unknown
  request: AxiosError['request']
  response: AxiosError['response']
  constructor(info: {
    code: number
    message: string
    data?: unknown
    request?: AxiosError<T>['request']
    response?: AxiosError<T>['response']
  }) {
    super(info.message)
    this.name = 'RequestError'
    this.code = info.code
    this.data = info.data
    this.request = info.request
    this.response = info.response
  }
}