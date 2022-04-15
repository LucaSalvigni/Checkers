const path = require('path');

module.exports = {
  entry: './index.js',
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'user.bundle.js',
  },
};
