const Draughts = require('./draughts');
const { log } = require('../../Utils/utils');
const Game = require('../models/gameModel');

const games = new Map();
const winStars = 100;
const lossStars = -70;

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

/**
 * Handles a game end.
 * @param {*} gameId  game that just ended
 * @param {*} tie whether it resulted in a tie.
 * @param {*} winner player who won (same as loser if "tie" param is set to TRUE)
 * @param {*} loser player who lost (same as winner if "tie" param is set to TRUE)
 * @returns true if game was terminated correctly and successfully saved into DB, false otherwise.
 */
async function gameEnd(gameId, tie, winner, loser) {
  log(`game ${gameId} just ended, ${winner} won and ${loser} lost`);
  const game = games.get(gameId);
  try {
    if (!tie) {
      log(`game ${gameId}didn't end in tie`);
      const match = new Game({
        fen: game.draughts.fen(),
        winner,
        loser,
      });
      await match.save();
      games.delete(gameId);
    } else {
      const match = new Game({
        fen: game.draughts.fen(),
        winner: 'Game has been settled with a tie.',
        loser: 'Game has been settled with a tie.',
      });
      await match.save();
      games.delete(gameId);
    }
    return true;
  } catch (err) {
    log(`Something went wrong while closing game ${gameId}`);
    log(err);
    return false;
  }
}

exports.tieGame = function (req, res) {
  gameEnd(req.body.gameId, true, _, _).then(
    res.status(200).send({ message: 'Game has been settled with a tie, each player will not earn nor lose stars' }),
  ).catch(
    res.status(500).send({ message: 'Something went wrong while closing the game.' }),
  );
};

/**
 * Handles user leaving a game
 */
exports.leaveGame = async function (req, res) {
  const { gameId } = req.body;
  const quitter = req.body.player_id;
  try {
    if (games.has(gameId)) {
      log(`${quitter} is leaving game ${gameId}`);
      const game = games.get(gameId);
      if (game.white === quitter) {
        log(`${quitter} is the host of game ${gameId}`);
        await gameEnd(gameId, false, game.black, game.white);
      } else if (game.black === quitter) {
        log(`${quitter} is not the host of game ${gameId}`);
        await gameEnd(gameId, false, game.white, game.black);
      } else {
        log(`Wat apparently ${quitter} has nothing to do with this game`);
        res.status(400).send({ message: `${quitter} is not in any game` });
        return;
      }

      const data = [];
      data.push(`You successfully left the game!\n ${winStars} stars have been removed from your profile!`);
      data.push(`The opponent has left the game!\n ${lossStars} stars have been added to your profile`);
      res.status(200).send(data);
    } else {
      log(`There is no such thing as game ${gameId}`);
      res.status(400).send({ message: 'There is no such game' });
    }
  } catch (err) {
    log(`Something wrong while processing ${quitter} request of leaving game ${gameId}`);
    log(err);
    res.status(500).send({ message: 'Internal server error while leaving game' });
  }
};
