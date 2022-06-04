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
  rules: {
    'no-param-reassign': 0,
    'no-console': 'off',
    'func-names': 'off',
    'no-extraneous-dependencies': 0,
    'no-underscore-dangle': 'off',
  },
};
