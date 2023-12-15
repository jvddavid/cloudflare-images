/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
responses.ts (c) 2023
Desc: description
Created:  2023-12-13T19:07:04.300Z
Modified: 2023-12-15T01:56:12.370Z
*/

export interface ListImages {
  images: Image[]
}

export interface ListImagesV2 {
  images: Image[]
  continuation_token: string
}

export interface Stats {
  count: {
    allowed: number
    current: number
  }
}

export interface ImageDetails {
  filename: string
  id: string
  meta: Record<string, string>
  requireSignedURLs: boolean
  uploaded: string // date 2014-01-02T02:20:00.123Z
  variants: string[] // urls of variants
}

export interface DirectUploadUrlV2 {
  id: string
  uploadURL: string
}

export interface UploadImage {
  id: string
  filename: string
  meta: Record<string, string>
  requireSignedURLs: boolean
  uploaded: string // date 2014-01-02T02:20:00.123Z
  variants: string[] // urls of variants
}

export interface Image {
  id: string
  filename: string
  meta: Record<string, string>
  requireSignedURLs: boolean
  uploaded: string // date 2014-01-02T02:20:00.123Z
  variants: string[] // urls of variants
}

export interface DefaultResponse<Result> {
  success: boolean
  errors: ErrorCloudFlare[]
  messages: MessagesCloudFlare[]
  result: Result | null
}

export interface ErrorCloudFlare {
  code: number // >= 1000
  message: string
}

export interface MessagesCloudFlare {
  code: number // >= 1000
  message: string
}
