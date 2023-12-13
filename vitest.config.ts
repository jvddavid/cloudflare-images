/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
vitest.config.ts (c) 2023
Desc: description
Created:  2023-12-13T12:06:22.990Z
Modified: 2023-12-13T12:32:40.816Z
*/
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    alias: {
      '@': './src',
    },
    env: {
      "VITE_CJS_IGNORE_WARNING": "true"
    }
  },
})
