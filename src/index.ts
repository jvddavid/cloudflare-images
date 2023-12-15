/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
index.ts (c) 2023
Desc: description
Created:  2023-12-13T11:57:06.523Z
Modified: 2023-12-15T02:22:37.222Z
*/

import type { CloudFlareAuth, DefaultResponse, DirectUploadUrlV2, Image, ImageDetails, ListImages, ListImagesV2, Stats, UploadImage } from '@/interfaces'
import { HttpError } from './errors'

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
    return await this.get<ListImages>(`${url}?${query.toString()}`)
  }

  async listV2(perPage: number = 1000, sort_order: 'asc' | 'desc' | null = null, continuation_token: string | null = null) {
    if (perPage < 10) throw new Error('perPage must be greater or equal than 1')
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v2`
    const query = new URLSearchParams({
      per_page: perPage.toString()
    })
    if (sort_order) query.append('sort_order', sort_order)
    if (continuation_token) query.append('continuation_token', continuation_token)
    return await this.get<ListImagesV2>(`${url}?${query.toString()}`)
  }

  async stats() {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/stats`
    return await this.get<Stats>(url)
  }

  async imageDetails(imageId: string) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/${imageId}`
    return await this.get<ImageDetails>(url)
  }

  async baseImage(imageId: string) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/${imageId}/blob`
    return await this.get<string>(url, 'text')
  }

  async directUploadUrlV2(expiry?: Date, metadata?: Record<string, string>, requireSignedURLs?: boolean) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v2/direct_upload`
    const body: Record<string, unknown> = {}
    if (expiry) body.expiry = expiry.toISOString()
    if (metadata) body.metadata = metadata
    if (requireSignedURLs) body.requireSignedURLs = requireSignedURLs
    return await this.post<DirectUploadUrlV2>(url, body)
  }

  async uploadImage(image: Buffer | string, metadata?: Record<string, string>, requireSignedURLs?: boolean) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1`
    const body: {
      metadata?: Record<string, string>
      requireSignedURLs?: boolean
      // binary data
      file?: Buffer
      url?: string
    } = {
      metadata,
      requireSignedURLs
    }

    if (image instanceof Buffer) {
      body.file = image
    } else if (typeof image === 'string') {
      if (image.startsWith('http')) {
        body.url = image
      } else {
        body.file = Buffer.from(image, 'base64')
      }
    } else {
      throw new Error('image must be a Buffer or a base64 string or a url')
    }
    return await this.post<UploadImage>(url, body)
  }

  async deleteImage(imageId: string) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/${imageId}`
    return await this.delete<Record<string, never>>(url)
  }

  async updateImage(imageId: string, metadata?: Record<string, string>, requireSignedURLs?: boolean) {
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v1/${imageId}`
    return await this.patch<Image>(url, { metadata, requireSignedURLs })
  }

  private async get<Result>(url: string, type: 'json' | 'text' = 'json'): Promise<DefaultResponse<Result> > {
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    return await this.parseResponse<Result>(response, type)
  }

  private async post<Result>(url: string, body: Record<string, unknown>, type: 'json' | 'text' = 'json'): Promise<DefaultResponse<Result> > {
    const formData = new FormData()
    for (const key in body) {
      formData.append(key, body[key] as string)
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })
    return await this.parseResponse<Result>(response, type)
  }

  private async patch<Result>(url: string, body: Record<string, unknown>, type: 'json' | 'text' = 'json'): Promise<DefaultResponse<Result> > {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body)
    })
    return await this.parseResponse<Result>(response, type)
  }

  private async delete<Result>(url: string, type: 'json' | 'text' = 'json'): Promise<DefaultResponse<Result> > {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    return await this.parseResponse<Result>(response, type)
  }

  private async parseResponse<T>(response: Response, type: 'text' | 'json'): Promise<DefaultResponse<T>> {
    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) {
        return await response.json()
      }
      throw new HttpError({
        code: response.status,
        message: response.statusText
      })
    }
    switch (type) {
      case 'json':
        return await response.json()
      case 'text':
        return {
          success: true,
          errors: [],
          messages: [],
          result: await response.text() as T
        }
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if ('token' in this.auth) {
      headers.Authorization = `Bearer ${this.auth.token}`
    } else {
      headers['X-Auth-Email'] = this.auth.email
      headers['X-Auth-Key'] = this.auth.key
    }
    return headers
  }
}
