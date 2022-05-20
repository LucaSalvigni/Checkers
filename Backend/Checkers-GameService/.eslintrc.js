module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    mocha: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  ignorePatterns: ['draughts.js', '**/build/*.js'],
  rules: {
    'no-console': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
  globals: {
    _: 'readonly',
  },
};
