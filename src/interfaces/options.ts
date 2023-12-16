/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
cloudflare.ts (c) 2023
Desc: description
Created:  2023-12-13T19:07:44.814Z
Modified: 2023-12-16T00:44:05.255Z
*/

import type { VariantOptions } from '.'

interface CloudFlareAuthToken {
  accountId: string
  token: string
}

interface CloudFlareAuthKey {
  accountId: string
  email: string
  key: string
}

export type CloudFlareAuth = CloudFlareAuthToken | CloudFlareAuthKey

export interface ListImagesOptions {
  page: number
  perPage: number
}

export interface ListImagesV2Options {
  perPage: number
  sortOrder: 'asc' | 'desc' | null
  continuationToken: string | null
}

export interface DirectUploadUrlV2Options {
  expiry?: Date
  metadata?: Record<string, string>
  requireSignedURLs?: boolean
}

export interface UploadImageOptions {
  name?: string
  image: Buffer | Blob | string
  metadata?: Record<string, string>
  requireSignedURLs?: boolean
}

export interface UploadImageURLOptions {
  imageURL: string
  metadata?: Record<string, string>
  requireSignedURLs?: boolean
}

export interface UpdateImageOptions {
  imageId: string
  metadata?: Record<string, string>
  requireSignedURLs?: boolean
}

export interface CreateVariantOptions {
  id: string
  neverRequireSignedURLs?: boolean
  options: VariantOptions
}

export interface UpdateVariantOptions {
  id: string
  neverRequireSignedURLs?: boolean
  options: VariantOptions
}