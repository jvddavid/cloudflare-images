/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
vitest.config.ts (c) 2023
Desc: description
Created:  2023-12-13T12:06:22.990Z
Modified: 2023-12-13T19:08:57.356Z
*/
import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'

const env = dotenv.config({ path: '.env' })

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    alias: {
      '@/*': './src/*',
    },
    env: env.parsed,
  },
})
