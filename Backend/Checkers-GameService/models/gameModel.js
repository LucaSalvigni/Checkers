const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  white: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  black: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  fen: {
    type: String,
    required: true,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  finished: {
    type: Boolean,
    required: true,
  }
});

module.exports = mongoose.model('games', gameSchema);
