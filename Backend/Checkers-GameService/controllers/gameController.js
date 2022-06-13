const Draughts = require('./draughts');
const Game = require('../models/gameModel');

// Utils
function log(msg) {
  if (process.env.NODE_ENV === 'development') {
    console.log(msg);
  }
}

/**
  * @param {*} game draughs instance
  * @returns B if Black won, W if White won otherwise T for Tie
  */
function checkWinner(game) {
  if (game.fen().split(':')[1].length <= 1) {
    return 'B';
  }
  if (game.fen().split(':')[2].length <= 1) {
    return 'W';
  }
  return 'T';
}

/**
 * Handles a game end.
 * @param {*} gameId  game that just ended
 * @param {*} tie whether it resulted in a tie.
 * @param {*} winner player who won (same as loser if "tie" param is set to TRUE)
 * @returns true if game was terminated correctly and successfully saved into DB, false otherwise.
 */
async function gameEnd(game, winner) {
  try {
    if (winner !== 'T') {
      log(`game ${game._id} didn't end in tie`);
      await Game.findByIdAndUpdate(game._id, {
        finished: true,
        winner: winner === 'B' ? game.black : game.white,
      });
    } else {
      log(`game ${game._id} ended in a tie`);
      await Game.findByIdAndUpdate(game._id, {
        finished: true,
      });
    }
    return true;
  } catch (err) {
    log(`Something went wrong while closing game ${game._id}`);
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

  for (let i = 0; i < blackPieces.length; i += 1) {
    const piece = blackPieces[i];
    if (piece !== '' && piece !== null) {
      if (piece.charAt(0) === 'K') {
        const moves = game.getLegalMoves(piece.substring(1));
        blackPiecesWithMoves.set(piece, moves);
      } else {
        const moves = game.getLegalMoves(piece);
        blackPiecesWithMoves.set(piece, moves);
      }
    }
  }
  for (let i = 0; i < whitePieces.length; i += 1) {
    const piece = whitePieces[i];
    if (piece !== '' && piece !== null) {
      if (piece.charAt(0) === 'K') {
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

/**
 * Handles game creation
 */
exports.createGame = async function createGame(req, res) {
  try {
    const { gameId } = req.body;
    const { hostId } = req.body;
    const { opponent } = req.body;

    const newGame = new Draughts();
    let savedGame = new Game({
      _id: gameId,
      white: hostId,
      black: opponent,
      finished: false,
      fen: newGame.fen(),
      turn: newGame.turn,
    });

    savedGame = await savedGame.save();
    log(`Just created game ${savedGame._id}`);

    res.status(200).json({
      game: savedGame,
      board: parseFEN(new Draughts(savedGame.fen)),
    });
  } catch (err) {
    log(err);
    res.status(500).send({ message: 'Something went wrong while creating a game' });
  }
};

/**
 * Handles game tieing
 */
exports.tieGame = async function tieGame(req, res) {
  const { gameId } = req.body;

  try {
    const game = await Game.findById(gameId);
    if (game) {
      gameEnd(game, 'T').then(
        res.status(200).send({ message: 'Game has been settled with a tie, each player will not earn nor lose stars' }),
      );
    } else {
      log(`There is no such thing as game ${gameId}`);
      res.status(400).send({ message: 'There is no such game' });
    }
  } catch (err) {
    log(`Something went wrong while drawing ${gameId}`);
    log(err);
    res.status(500).send({ message: 'Internal server error while leaving game' });
  }
};

/**
 * Handles user leaving a game
 */
exports.leaveGame = async function leaveGame(req, res) {
  const { gameId } = req.query;
  const quitter = req.query.playerId;
  try {
    const game = await Game.findById(gameId);
    if (game) {
      log(`${quitter} is leaving game ${gameId}`);
      if (game.white === quitter) {
        log(`${quitter} is the host of game ${gameId}`);
        await gameEnd(game, game.black);
      } else if (game.black === quitter) {
        log(`${quitter} is not the host of game ${gameId}`);
        await gameEnd(game, game.white);
      } else {
        log(`WAT, apparently ${quitter} has nothing to do with this game`);
        res.status(400).send({ message: `${quitter} is not in any game` });
        return;
      }
      res.status(200).send();
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
  const { gameId } = req.body;
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
    // Check if game exists
    const gameFromDB = await Game.findById(gameId);
    if (gameFromDB) {
      const dummyGame = new Draughts(gameFromDB.fen);

      // Check if the move is legal
      if (dummyGame.move({ from, to }) !== false) {
        const data = parseFEN(dummyGame);
        log(`Moving a piece in ${gameId} from ${from} to ${to}`);

        // Check if game ended
        if (dummyGame.gameOver()) {
          log(`Game ${gameId} is over!`);
          const gameResult = checkWinner(dummyGame);

          // Check if it's a tie
          if (gameResult !== 'T') {
            log(`${gameResult === 'B' ? gameFromDB.black : gameFromDB.white} won game ${gameId}`);
            await gameEnd(gameFromDB, gameResult);
            res.json({
              ended: true,
              winner: gameResult === 'B' ? gameFromDB.black : gameFromDB.white,
              board: data,
            });
          } else {
            log(`Game ${gameId} just resulted in a tie, how lucky are you to be able to witness such a rare event?"`);
            await gameEnd(gameFromDB, gameResult);
            res.json({
              ended: true,
              winner: '',
              board: data,
            });
          }
        } else {
          log(`Moving a piece from game ${gameId}`);

          res.json({
            ended: false,
            board: data,
          });
        }
        // After making a move, update saved fen on MongoDB
        await Game.findByIdAndUpdate(gameId, {
          fen: dummyGame.fen(),
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

/**
 * Given an User mail ID retrieves all games
 */
exports.getGamesByUser = async function getGames(req, res) {
  try {
    const { user } = req.query;
    if (user === undefined) {
      res.status(400).json({ error: 'User not defined' });
      return;
    }

    const data = [];
    log(`Getting games for user ${user}`);
    const games = await Game.find({
      $or: [
        { white: user },
        { black: user },
      ],
    });
    if (games.length === 0) {
      log(`lol there's no games for ${user}`);
      res.status(400).json({ error: 'Cannot find any games for that player' });
    } else {
      log(`Successfully got games for ${user}`);
      data.push(games);
      res.status(200).json(data);
    }
  } catch (err) {
    log(err);
    res.status(500).send({ message: 'Internal server error while finding games' });
  }
};
