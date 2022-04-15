const Draughts = require('./draughts');
const { log } = require('../../Utils/utils');
// const Game = require('../models/gameModel');

const games = new Map();

exports.create_game = function (req, res) {
  try {
    const { gameId } = req.body;
    const { hostId } = req.body;
    const { opponent } = req.body;
    const game = {};
    game.white = hostId;
    game.black = opponent;
    game.draughts = new Draughts();
    game.finished = false;
    game.fen = game.draughts.fen();
    game.winner = '';
    game.loser = '';
    game.turn = game.white;
    games.set(gameId, game);
    log(`Just created game ${gameId}`);
    res.status(200).json({
    });
  } catch (err) {
    log(err);
    res.status(500).send({ message: 'Something went wrong while creating a game' });
  }
};
