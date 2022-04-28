const Draughts = require('./draughts');
const Game = require('../models/gameModel');

const winStars = 100;
const lossStars = -70;

// Utils
function log(msg) {
  if (process.env.NODE_ENV === 'development') {
    console.log(msg);
  }
}

// Exports

/**
 * Creates a new game
 * @param {*} hostId  Player which created the game
 * @param {*} opponent Second player
 */
exports.create_game = async function createGame(req, res) {
  try {
    const { hostId } = req.body;
    const { opponent } = req.body;

    let newGame = new Game({
      white: hostId,
      black: opponent,
      finished: false,
      fen: new Draughts().fen(),
      turn: hostId,
    });

    newGame = await newGame.save();
    log(`Just created game ${newGame._id}`);
    res.status(200).json({
      game: newGame,
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
async function gameEnd(gameId, tie, winner) {
  log(`game ${gameId} just ended`);
  try {
    const game = await Game.findById(gameId);
    if (game) {
      if (!tie) {
        log(`game ${gameId} didn't end in tie`);
        await Game.findByIdAndUpdate(gameId, {
          finished: true,
          winner,
        });
      } else {
        log(`game ${gameId} ended in a tie`);
        await Game.findByIdAndUpdate(gameId, {
          finished: true,
        });
      }
      log('Game not found');
      return true;
    }
    return false;
  } catch (err) {
    log(`Something went wrong while closing game ${gameId}`);
    log(err);
    return false;
  }
}

exports.tieGame = function tieGame(req, res) {
  gameEnd(req.body.gameId, true, _, _).then(
    res.status(200).send({ message: 'Game has been settled with a tie, each player will not earn nor lose stars' }),
  ).catch(
    res.status(500).send({ message: 'Something went wrong while closing the game.' }),
  );
};

/**
 * Handles user leaving a game
 * @param {*} gameId  Id of the game to leave
 * @param {*} playerId Player leaving the game
 */
exports.leaveGame = async function leaveGame(req, res) {
  const { gameId } = req.body;
  const quitter = req.body.playerId;
  try {
    const game = await Game.findById(gameId);
    if (game) {
      log(`${quitter} is leaving game ${gameId}`);
      if (game.white.equals(quitter)) {
        log(`${quitter} is the host of game ${gameId}`);
        await gameEnd(gameId, false, game.black, game.white);
      } else if (game.black.equals(quitter)) {
        log(`${quitter} is not the host of game ${gameId}`);
        await gameEnd(gameId, false, game.white, game.black);
      } else {
        log(`WAT, apparently ${quitter} has nothing to do with this game`);
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