/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
responses.ts (c) 2023
Desc: description
Created:  2023-12-13T19:07:04.300Z
Modified: 2023-12-13T19:27:30.365Z
*/

export interface ListImages {
  success: boolean
  errors: ErrorCloudFlare[]
  messages: MessagesCloudFlare[]
  result: {
    images: Image[]
  }
}

export interface ListImagesV2 {
  success: boolean
  errors: ErrorCloudFlare[]
  messages: MessagesCloudFlare[]
  result: {
    images: Image[]
    continuation_token: string
  }
}

export interface ErrorCloudFlare {
  code: number // >= 1000
  message: string
}

export interface MessagesCloudFlare {
  code: number // >= 1000
  message: string
}

export interface Image {
  id: string
  filename: string
  meta: Record<string, unknown>
  requireSignedURLs: boolean
  uploaded: string // date 2014-01-02T02:20:00.123Z
  variants: string[] // urls of variants
}
