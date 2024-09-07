/*
 *Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
 *cloudflare.ts (c) 2023
 *Desc: description
 *Created:  2023-12-13T19:07:44.814Z
 *Modified: 2023-12-16T00:44:05.255Z
 */

import type { VariantOptions } from '.'

/**
 * CloudFlare authentication token
 * @typedef {Object} CloudFlareAuthToken
 * @property {string} accountId - The CloudFlare account ID
 * @property {string} token - The CloudFlare account token
 */
interface CloudFlareAuthToken {
  accountId: string
  token: string
}

/**
 * CloudFlare authentication key
 * @typedef {Object} CloudFlareAuthKey
 * @property {string} accountId - The CloudFlare account ID
 * @property {string} email - The CloudFlare account email
 * @property {string} key - The CloudFlare account key
 */
interface CloudFlareAuthKey {
  accountId: string
  email: string
  key: string
}

/**
 * CloudFlare authentication
 * @typedef {CloudFlareAuthToken | CloudFlareAuthKey} CloudFlareAuth
 */
export type CloudFlareAuth = CloudFlareAuthToken | CloudFlareAuthKey

/**
 * CloudFlare options
 * @typedef {Object} CloudFlareOptions
 * @property {string} [endpoint] - The CloudFlare API endpoint -> default: 'https://api.cloudflare.com/client/v4'
 */
export type CloudFlareOptions = {
  endpoint?: string
}

/**
 * CloudFlare image options
 * @typedef {Object} ListImagesOptions
 * @property {number} page - The page number
 * @property {number} perPage - The number of images per page
 */
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
