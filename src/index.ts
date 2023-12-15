/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
index.ts (c) 2023
Desc: description
Created:  2023-12-13T11:57:06.523Z
Modified: 2023-12-15T14:20:33.638Z
*/

import type { CloudFlareAuth, DefaultResponse, DirectUploadUrlV2, Image, ImageDetails, ListImages, ListImagesV2, Stats, UploadImage } from '@/interfaces'
import axios from 'axios'
import type { AxiosResponse, ResponseType, responseEncoding } from 'axios'
import { HttpError } from './errors'
import FormData from 'form-data'

export default class CloudFlareImages {
  private readonly auth: CloudFlareAuth

  private readonly baseUrl = 'https://api.cloudflare.com/client/v4'

  constructor(auth: CloudFlareAuth) {
    this.auth = auth
  }

  async list(page: number = 1, perPage: number = 1000) {
    if (page < 1) throw new Error('page must be greater or equal than 1')
    if (perPage < 10) throw new Error('perPage must be greater or equal than 1')
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1`
    const query = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString()
    })
    return this.get<ListImages>(`${url}?${query.toString()}`)
  }

  async listV2(perPage: number = 1000, sort_order: 'asc' | 'desc' | null = null, continuation_token: string | null = null) {
    if (perPage < 10) throw new Error('perPage must be greater or equal than 1')
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v2`
    const query = new URLSearchParams({
      per_page: perPage.toString()
    })
    if (sort_order) query.append('sort_order', sort_order)
    if (continuation_token) query.append('continuation_token', continuation_token)
    return this.get<ListImagesV2>(`${url}?${query.toString()}`)
  }

  async stats() {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/stats`
    return this.get<Stats>(url)
  }

  async imageDetails(imageId: string) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/${imageId}`
    return this.get<ImageDetails>(url)
  }

  async baseImage(imageId: string) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/${imageId}/blob`
    return this.get<Blob>(url, 'text', 'BASE64')
  }

  async directUploadUrlV2(expiry?: Date, metadata?: Record<string, string>, requireSignedURLs?: boolean) {
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

  async uploadImageURL(imageURL: string, metadata?: Record<string, string>, requireSignedURLs?: boolean) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1`
    const body = new FormData()
    if (metadata) body.append('metadata', JSON.stringify(metadata), { contentType: 'application/json' })
    if (requireSignedURLs) body.append('requireSignedURLs', requireSignedURLs.toString())
    body.append('url', imageURL)
    return this.post<UploadImage>(url, body)
  }

  async uploadImage(image: Buffer | string, metadata?: Record<string, string>, requireSignedURLs?: boolean) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1`
    const body = new FormData()
    if (metadata) body.append('metadata', JSON.stringify(metadata), { contentType: 'application/json' })
    if (requireSignedURLs) body.append('requireSignedURLs', requireSignedURLs.toString())
    if (typeof image === 'string') {
      body.append('file', Buffer.from(image), { contentType: 'image/*' })
    } else {
      body.append('file', image, { contentType: 'image/*' })
    }
    return this.post<UploadImage>(url, body)
  }

  async deleteImage(imageId: string) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/${imageId}`
    return this.delete<Record<string, never>>(url)
  }

  async updateImage(imageId: string, metadata?: Record<string, string>, requireSignedURLs?: boolean) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/${imageId}`
    return this.patch<Image>(url, { metadata, requireSignedURLs })
  }

  private async get<Result>(url: string, type: ResponseType = 'json', encoding?: responseEncoding): Promise<DefaultResponse<Result> > {
    const response = await axios.get(url, {
      headers: this.getHeaders(),
      responseEncoding: encoding,
      responseType: type,
    })
    return this.parseResponse<Result>(response, type)
  }

  private async post<Result>(url: string, body: FormData, type: ResponseType = 'json', encoding?: responseEncoding): Promise<DefaultResponse<Result> > {
    const response = await axios.post(url, body, {
      headers: {
        ...this.getHeaders(),
        ...body.getHeaders(),
        'Content-Length': body.getLengthSync(),
      },
      responseEncoding: encoding,
      responseType: type,
    })
    return this.parseResponse<Result>(response, type)
  }

  private async patch<Result>(url: string, body: Record<string, unknown>, type: ResponseType = 'json'): Promise<DefaultResponse<Result> > {
    const response = await axios.patch(url, body, {
      headers: this.getHeaders('application/json')
    })
    return this.parseResponse<Result>(response, type)
  }

  private async delete<Result>(url: string, type: ResponseType = 'json'): Promise<DefaultResponse<Result> > {
    const response = await axios.delete(url, {
      headers: this.getHeaders()
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
}
