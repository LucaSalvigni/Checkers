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
  history: [String],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  finished: {
    type: Boolean,
    required: true,
  },
  turn: String,
});

module.exports = mongoose.model('games', gameSchema);
