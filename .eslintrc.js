/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
.eslintrc.js (c) 2023
Desc: description
Created:  2023-12-09T02:11:52.534Z
Modified: 2023-12-13T13:07:11.260Z
*/

// .eslintrc.js
module.exports = {
  env: {
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'overrides': [
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'project': './tsconfig.json'
  },
  'plugins': [
    '@typescript-eslint',
    '@stylistic'
  ],
  rules: {
    '@stylistic/indent': ['error', 2],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/space-before-function-paren': ['error', 'never'],
    '@stylistic/no-trailing-spaces': ['error'],
    '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
    '@stylistic/no-multi-spaces': ['error'],
    '@stylistic/no-extra-semi': ['error'],
    '@stylistic/function-call-spacing': ['error', 'never'],
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/array-bracket-spacing': ['error', 'never'],
    '@stylistic/computed-property-spacing': ['error', 'never'],
    '@stylistic/block-spacing': ['error', 'always'],
    '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
    '@stylistic/space-infix-ops': ['error'],
    '@stylistic/space-unary-ops': ['error', { words: true, nonwords: false }],
    '@stylistic/space-in-parens': ['error', 'never'],
    '@stylistic/no-whitespace-before-property': ['error'],
  },
}
