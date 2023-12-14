/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
index.ts (c) 2023
Desc: description
Created:  2023-12-13T11:57:06.523Z
Modified: 2023-12-13T19:26:45.178Z
*/

import { CloudFlareAuth, ListImages, ListImagesV2 } from '@/interfaces'

export class CloudFlareImages {
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
      per_page: perPage.toString(),
    })
    return this.request<ListImages>('GET', `${url}?${query.toString()}`)
  }

  async listV2(perPage: number = 1000, sort_order: 'asc' | 'desc' = 'asc', continuation_token: string | null = null) {
    if (perPage < 10) throw new Error('perPage must be greater or equal than 1')
    const url = `${this.baseUrl}/accounts/${this.auth.accountId}/images/v2`
    const query = new URLSearchParams({
      per_page: perPage.toString(),
      sort_order,
    })
    if (continuation_token) query.append('continuation_token', continuation_token)
    return this.request<ListImagesV2>('GET', `${url}?${query.toString()}`)
  }

  private async request<T>(method: string, url: string, body?: Record<string, unknown>): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if ('token' in this.auth) {
      headers['Authorization'] = `Bearer ${this.auth.token}`
    } else {
      headers['X-Auth-Email'] = this.auth.email
      headers['X-Auth-Key'] = this.auth.key
    }
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    return response.json()
  }
}
