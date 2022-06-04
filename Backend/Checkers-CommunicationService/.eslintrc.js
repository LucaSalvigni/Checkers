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
  ignorePatterns: ['**/build/*.js'],
  rules: {
    'no-param-reassign': 0,
    'no-console': 'off',
    'func-names': 'off',
    'no-extraneous-dependencies': 0,
    'no-use-before-define': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
    'no-await-in-loop': 'off',
  },
};
