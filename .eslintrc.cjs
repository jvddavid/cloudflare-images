/* eslint-env node */
module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', '@stylistic'],
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
    '@stylistic/type-annotation-spacing': ['error', { before: false, after: true }],
    '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
    'camelcase': ['off'],
  },
  root: true,
}