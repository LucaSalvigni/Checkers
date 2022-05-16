const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  white: {
    type: String,
    ref: 'users',
    required: true,
  },
  black: {
    type: String,
    ref: 'users',
    required: true,
  },
  fen: {
    type: String,
    required: true,
  },
  winner: {
    type: String,
    ref: 'users',
  },
  finished: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('games', gameSchema);
