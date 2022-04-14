const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  fen: String,
  history: [String],
  winner: String,
  loser: String,
});

module.exports = mongoose.model('games', gameSchema);
