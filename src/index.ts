/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
index.ts (c) 2023
Desc: description
Created:  2023-12-13T11:57:06.523Z
Modified: 2023-12-16T10:05:04.779Z
*/

import axios from 'axios'
import FormData from 'form-data'
import type { AxiosError, AxiosResponse, ResponseType, responseEncoding } from 'axios'
import type { CloudFlareAuth, CreateVariantOptions, DefaultResponse, DirectUploadUrlV2, DirectUploadUrlV2Options, Image, ImageDetails, ListImages, ListImagesOptions, ListImagesV2, ListImagesV2Options, ListSigningKeys, ListVariants, Stats, UpdateImageOptions, UpdateVariantOptions, UploadImage, UploadImageOptions, UploadImageURLOptions, VariantDetails } from '@/interfaces'
import { HttpError, RequestError } from './errors'

export default class CloudFlareImages {
  private readonly auth: CloudFlareAuth
  private readonly baseUrl = 'https://api.cloudflare.com/client/v4'

  /**
   * @param auth CloudFlareAuth
   * @example const cloudflare = new CloudFlareImages({ accountId: 'account_id', email: 'email', key: 'key' })
   * @example const cloudflare = new CloudFlareImages({ accountId: 'account_id', token: 'token' })
   */
  constructor(auth: CloudFlareAuth) {
    this.auth = auth
  }

  ///
  /// Images v1
  ///

  /**
   * list images
   * @param page page number
   * @param perPage number of images per page
   * @returns object with success, errors, messages and result(images)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.listImages({ page: 1, perPage: 1000 })
   */
  async list(info: ListImagesOptions = { page: 1, perPage: 1000 }) {
    const { page, perPage } = info
    if (page < 1) throw new Error('page must be greater or equal than 1')
    if (perPage < 10) throw new Error('perPage must be greater or equal than 1')
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1`
    const query = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString()
    })
    return this.get<ListImages>(`${url}?${query.toString()}`)
  }

  /**
   * get stats
   * @returns object with success, errors, messages and result(stats)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.stats()
   */
  async stats() {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/stats`
    return this.get<Stats>(url)
  }

  /**
   * get image details
   * @param imageId image id
   * @returns object with success, errors, messages and result(image details)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.imageDetails('image_id')
   */
  async imageDetails(imageId: string) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/${imageId}`
    return this.get<ImageDetails>(url)
  }

  /**
   * get image
   * @param imageId image id
   * @returns object with success, errors, messages and result(base64 image)
   * @throws RequestError
   * @throws Error
   * @example const image = await cloudflare.image('image_id')
   */
  async baseImage(imageId: string) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/${imageId}/blob`
    return this.get<string>(url, 'text', 'BASE64')
  }

  /**
   * upload image
   * @param name image name
   * @param image image buffer or base64 string
   * @param metadata image metadata
   * @param requireSignedURLs require signed urls
   * @returns object with success, errors, messages and result(image details)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.uploadImage({ name: 'image_name', image: 'image_base64', metadata: { key: 'value' }, requireSignedURLs: false })
   */
  async uploadImage(info: UploadImageOptions) {
    const { name, image, metadata, requireSignedURLs } = info
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1`
    const body = new FormData()
    if (metadata) body.append('metadata', JSON.stringify(metadata), { contentType: 'application/json' })
    if (requireSignedURLs) body.append('requireSignedURLs', requireSignedURLs.toString())
    const options = { contentType: 'image/*', filename: name }
    if (typeof image === 'string') {
      body.append('file', Buffer.from(image, 'base64'), options)
    } else {
      body.append('file', image, options)
    }
    return this.post<UploadImage>(url, body)
  }

  /**
   * upload image url
   * @param imageURL image url
   * @param metadata image metadata
   * @param requireSignedURLs require signed urls
   * @returns object with success, errors, messages and result(image details)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.uploadImageURL({ imageURL: 'https://example.com/image.png', metadata: { key: 'value' }, requireSignedURLs: false })
   */
  async uploadImageURL(info: UploadImageURLOptions) {
    const { imageURL, metadata, requireSignedURLs } = info
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1`
    const body = new FormData()
    if (metadata) body.append('metadata', JSON.stringify(metadata), { contentType: 'application/json' })
    if (requireSignedURLs) body.append('requireSignedURLs', requireSignedURLs.toString())
    body.append('url', imageURL)
    return this.post<UploadImage>(url, body)
  }

  /**
   * update image
   * @param imageId image id
   * @param metadata image metadata
   * @param requireSignedURLs require signed urls
   * @returns object with success, errors, messages and result(image details)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.updateImage({ imageId: 'image_id', metadata: { key: 'value' }, requireSignedURLs: false })
   */
  async updateImage(info: UpdateImageOptions) {
    const { imageId, metadata, requireSignedURLs } = info
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/${imageId}`
    return this.patch<Image>(url, { metadata, requireSignedURLs })
  }

  /**
   * delete image
   * @param imageId image id
   * @returns object with success, errors, messages and result(empty)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.deleteImage('image_id')
   */
  async deleteImage(imageId: string) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/${imageId}`
    return this.delete<Record<string, never>>(url)
  }

  ///
  /// Images v2
  ///

  /**
   * list images v2
   * @param perPage number of images per page
   * @param sortOrder sort order
   * @param continuationToken continuation token
   * @returns object with success, errors, messages and result(images, continuation_token)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.listImagesV2({ perPage: 1000, sortOrder: null, continuationToken: null })
   */
  async listV2(info: ListImagesV2Options = { perPage: 1000, sortOrder: null, continuationToken: null }) {
    const { perPage, sortOrder, continuationToken } = info
    if (perPage < 10) throw new Error('perPage must be greater or equal than 1')
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v2`
    const query = new URLSearchParams({
      per_page: perPage.toString()
    })
    if (sortOrder) query.append('sort_order', sortOrder)
    if (continuationToken) query.append('continuation_token', continuationToken)
    return this.get<ListImagesV2>(`${url}?${query.toString()}`)
  }

  /**
   * direct upload url v2
   * @param expiry expiry date (default: 1 hour) '2023-12-13T11:57:06.523Z'
   * @param metadata image metadata
   * @param requireSignedURLs require signed urls
   * @returns object with success, errors, messages and result(direct upload url)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.directUploadUrlV2({ expiry: new Date(Date.now() + 1000 * 60 * 60 * 1), metadata: { key: 'value' }, requireSignedURLs: false })
   */
  async directUploadUrlV2(info: DirectUploadUrlV2Options = { }) {
    const { expiry, metadata, requireSignedURLs } = info
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v2/direct_upload`
    const body = new FormData()
    if (expiry) body.append('expiry', expiry.toISOString())
    else {
      body.append('expiry', new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString())
    }
    if (metadata) body.append('metadata', JSON.stringify(metadata), { contentType: 'application/json' })
    if (requireSignedURLs) body.append('requireSignedURLs', requireSignedURLs.toString())
    return this.post<DirectUploadUrlV2>(url, body, 'json', 'UTF-8')
  }

  ///
  /// Images keys
  ///

  /**
   * list signing keys
   * @returns object with success, errors, messages and result(signing keys)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.listSigningKeys()
   */
  async listSigningKeys() {
    return this.get<ListSigningKeys>(`${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/keys`, 'json', 'UTF-8')
  }

  ///
  /// Images variants
  ///

  /**
   * list variants
   * @returns object with success, errors, messages and result(variants)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.listVariants()
   */
  async listVariants() {
    return this.get<ListVariants>(`${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/variants`)
  }

  /**
   * variant details
   * @param variantId variant id
   * @returns object with success, errors, messages and result(variant details)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.variantDetails('variant_id')
   */
  async variantDetails(variantId: string) {
    return this.get<VariantDetails>(`${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/variants/${variantId}`)
  }

  /**
   * create variant
   * @param id variant id
   * @param options variant options
   * @param neverRequireSignedURLs never require signed urls
   * @returns object with success, errors, messages and result(variant details)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.createVariant({ name: 'variant_name', options: { width: 100, height: 100, fit: 'contain', metadata: 'none' } })
   */
  async createVariant(info: CreateVariantOptions) {
    return this.post<VariantDetails>(`${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/variants`, info, 'json', 'UTF-8')
  }

  /**
   * update variant
   * @param id variant id
   * @param options variant options
   * @param neverRequireSignedURLs never require signed urls
   * @returns object with success, errors, messages and result(variant details)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.updateVariant({ id: 'variant_id', options: { width: 100, height: 100, fit: 'contain', metadata: 'none' } })
   */
  async updateVariant(info: UpdateVariantOptions) {
    return this.patch<VariantDetails>(`${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/variants/${info.id}`, {
      options: info.options,
      neverRequireSignedURLs: info.neverRequireSignedURLs
    }, 'json', 'UTF-8')
  }

  /**
   * delete variant
   * @param variantId variant id
   * @returns object with success, errors, messages and result(empty)
   * @throws RequestError
   * @throws Error
   * @example const { success, errors, messages, result } = await cloudflare.deleteVariant('variant_id')
   */
  async deleteVariant(variantId: string) {
    const response = await this.request({
      method: 'DELETE',
      url: `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/variants/${variantId}`
    })
    return this.parseResponse<Record<string, never>>(response, 'json')
  }

  ///
  /// Private
  ///

  private async get<Result>(url: string, type: ResponseType = 'json', encoding?: responseEncoding): Promise<DefaultResponse<Result> > {
    const response = await this.request<Result>({
      method: 'GET',
      url,
      type,
      encoding
    })
    return this.parseResponse<Result>(response, type)
  }

  private async post<Result>(url: string, data: FormData | Record<any, any>, type: ResponseType = 'json', encoding?: responseEncoding): Promise<DefaultResponse<Result> > {
    let headers: Record<string, string> = {}
    if (data instanceof FormData) {
      headers = data.getHeaders()
    } else {
      headers = {
        'Content-Type': 'application/json'
      }
    }

    const response = await this.request<Result, typeof data>({
      method: 'POST',
      url,
      data,
      type,
      encoding,
      headers
    })
    return this.parseResponse<Result>(response, type)
  }

  private async patch<Result>(url: string, body: Record<string, unknown>, type: ResponseType = 'json', encoding?: responseEncoding): Promise<DefaultResponse<Result> > {
    const response = await this.request<Result, Record<string, unknown>>({
      method: 'PATCH',
      url,
      data: body,
      type,
      encoding,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return this.parseResponse<Result>(response, type)
  }

  private async delete<Result>(url: string, type: ResponseType = 'json', encoding?: responseEncoding): Promise<DefaultResponse<Result> > {
    const response = await this.request<Result>({
      method: 'DELETE',
      url,
      type,
      encoding
    })
    return this.parseResponse<Result>(response, type)
  }

  private async parseResponse<T>(response: AxiosResponse, type: ResponseType): Promise<DefaultResponse<T>> {
    if (!(response.status >= 200 && response.status < 300)) {
      if (response.status >= 400 && response.status < 500) {
        return response.data
      }
      throw new HttpError({
        code: response.status,
        message: response.statusText
      })
    }
    switch (type) {
      case 'json':
        return response.data
      default:
        return {
          success: true,
          errors: [],
          messages: [],
          result: response.data
        }
    }
  }

  private getHeaders(contentType?: string) {
    const headers: Record<string, string> = {
      'Accept': '*/*',
      'User-Agent': 'CloudflareImages/1.0.0'
    }
    if ('token' in this.auth) {
      headers.Authorization = `Bearer ${this.auth.token}`
    } else {
      headers['X-Auth-Email'] = this.auth.email
      headers['X-Auth-Key'] = this.auth.key
    }
    if (contentType) headers['Content-Type'] = contentType
    return headers
  }

  private async request<Data = any, Body = any>(info: {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    url: string
    data?: Body
    headers?: Record<string, string>
    type?: ResponseType
    encoding?: responseEncoding
  }) {
    const { method, url, data, headers, type, encoding } = info
    try {
      const res = await axios.request<Data>({
        method,
        url,
        data,
        headers: {
          ...this.getHeaders(),
          ...headers
        },
        responseType: type,
        responseEncoding: encoding
      })
      return res
    } catch (error: any) {
      console.dir(error)
      if (error.isAxiosError) {
        const axiosError = error as AxiosError<Data, Body>
        if (axiosError.response) {
          return axiosError.response
        }
        throw new RequestError<Data>({
          code: axiosError.status ?? 500,
          message: axiosError.message,
          data: axiosError.config?.data,
          request: axiosError.request,
          response: axiosError.response
        })
      }
      throw error
    }
  }
}
