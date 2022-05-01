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

/**
  * @param {*} game draughs instance
  * @returns whether such game is over because someone won.
  */
function winCheck(game) {
  if (game.fen().split(':')[1].length <= 1) {
    return {
      status: true,
      winner: game.black,
      loser: game.white,
    };
  }
  if (game.fen().split(':')[2].length <= 1) {
    return {
      status: true,
      winner: game.white,
      loser: game.black,
    };
  }
  return {
    status: false,
    winner: game.white,
    loser: game.black,
  };
}

/**
 * Handles a game end.
 * @param {*} gameId  game that just ended
 * @param {*} tie whether it resulted in a tie.
 * @param {*} winner player who won (same as loser if "tie" param is set to TRUE)
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
      return true;
    }
    log(`Game ${gameId} not found`);
    return false;
  } catch (err) {
    log(`Something went wrong while closing game ${gameId}`);
    log(err);
    return false;
  }
}

/* Attaches to every Piece on the board its list of available moves for frontend purposes.
* String is to be sent to client on the form of:
* let data = [TURN, Map(WHITE_PIECE->MOVES),Map(BLACK_PIECE->MOVES)]
* es: [B,WHITE(3->(5,10,3)10K->(5,2,5,4)),BLACK(4->(5,10)10K->(5,2))]
* OBV a draught that's not a king can only have max 2 moves.
* K after a number means that piece is a KING
*/
function parseFEN(game) {
  const data = [];
  const fields = game.fen().split(':');
  data.push(fields[0]);

  const whitePieces = fields[1].split(',');
  const blackPieces = fields[2].split(',');

  whitePieces[0] = whitePieces[0].substring(1);
  blackPieces[0] = blackPieces[0].substring(1);

  const whitePiecesWithMoves = new Map();
  const blackPiecesWithMoves = new Map();

  for (let i = 0; i < blackPieces.length; i++) {
    const piece = blackPieces[i];
    if (piece !== '' && piece !== null) {
      if (piece.charAt(0) === 'K' ) {
        const moves = game.getLegalMoves(piece.substring(1));
        blackPiecesWithMoves.set(piece, moves);
      } else {
        const moves = game.getLegalMoves(piece);
        blackPiecesWithMoves.set(piece, moves);
      }
    }
  }
  for (let i = 0; i < whitePieces.length; i++) {
    const piece = whitePieces[i];
    if (piece !== '' && piece !== null) {
      if (piece.charAt(0) === 'K' ) {
        const moves = game.getLegalMoves(piece.substring(1));
        whitePiecesWithMoves.set(piece, moves);
      } else {
        const moves = game.getLegalMoves(piece);
        whitePiecesWithMoves.set(piece, moves);
      }
    }
  }
  data.push(Object.fromEntries(whitePiecesWithMoves));
  data.push(Object.fromEntries(blackPiecesWithMoves));
  return data;
}

// Exports
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

exports.tieGame = function tieGame(req, res) {
  gameEnd(req.body.gameId, true, _, _).then(
    res.status(200).send({ message: 'Game has been settled with a tie, each player will not earn nor lose stars' }),
  ).catch(
    res.status(500).send({ message: 'Something went wrong while closing the game.' }),
  );
};

/**
 * Handles user leaving a game
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

      // TODO ?
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

/**
 * Gets called whenever a user's turn time expires.
 */
exports.turnChange = async function turnChange(req, res) {
  const gameId = req.body.gameId;
  const gameObj = await Game.findById(gameId);
  if (gameObj) {
    const game = new Draughts(gameObj.fen);
    log(`Changing turn for game ${gameId}`);
    game.change_turn();
    await Game.findByIdAndUpdate(gameId, {
      fen: game.fen(),
    });
    res.status(200).json();
  } else {
    log(`Someone tried to change turn for game ${gameId} but such game doesn't exist`);
    res.status(400).json({ message: 'No such game' });
  }
};

/**
 * A user moves a piece inside the board
 */
exports.movePiece = async function movePiece(req, res) {
  const { gameId } = req.body;
  const { from } = req.body;
  const { to } = req.body;
  try {
    const gameObj = await Game.findById(gameId);
    if (gameObj) {
      const game = new Draughts(gameObj.fen);
      if (game.move({ from, to }) !== false) {
        const data = parseFEN(game);
        log(`Moving a piece in ${gameId} from ${from} to ${to}`);
        if (game.gameOver()) {
          log(`Game ${gameId} is over!`);
          const gameResult = winCheck(game);
          if (gameResult.status) {
            log(`Someone won game ${gameId}`);
            await gameEnd(gameId, false, gameResult.winner);
            res.json({
              winner: gameResult.winner,
              loser: gameResult.loser,
              board: data,
            });
          } else {
            log(`Game ${gameId} just resulted in a tie, how lucky are you to be able to witness such a rare event?"`);
            await gameEnd(gameId, true, gameResult.winner);
            res.json({
              winner: '',
              tie: true,
              board: data,
            });
          }
        } else {
          log(`Moving a piece from game ${gameId}`);

          res.json({
            winner: '',
            board: data,
          });
        }
        // After making a move, update saved fen on MongoDB
        await Game.findByIdAndUpdate(gameId, {
          fen: game.fen(),
        });
      } else {
        log(`Something wrong while trying to move a piece for game ${gameId}`);
        res.status(400).send({ message: 'Error while making such move, you can try again or select a different move.' });
      }
    } else {
      res.status(400).send({ message: "Can't find such game" });
    }
  } catch (err) {
    log(`Something wrong while processing game ${gameId} request of moving a piece from ${from} to ${to}`);
    log(err);
    res.status(500).send({ message: 'Internal server error while leaving game' });
  }
};
// TODO REMOVE
