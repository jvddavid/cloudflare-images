/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
cloudflare.ts (c) 2023
Desc: description
Created:  2023-12-13T19:07:44.814Z
Modified: 2023-12-13T19:07:53.300Z
*/

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
