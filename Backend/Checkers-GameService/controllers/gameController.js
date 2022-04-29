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
  * 
  * 
  * @param {*} game draughs instance
  * @returns whether such game is over because someone won.
  */
  function winCheck(game){
    if(game.fen().split(':')[1].length <= 1){
      return{
        status:true,
        winner: game.black,
        loser : game.white
      }
    }
    else if(game.fen().split(':')[2].length <= 1 ){
      return{
        status:true,
        winner: game.white,
        loser : game.black
      }
    }
    return {
      status:false,
      winner:game.white,
      loser:game.black
    }
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
      return true;
    }else{
      log(`Game ${gameId} not found`);
      return false;
    }
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
/**
 * A user moves a piece inside the board
 */
 exports.movePiece = async function(req,res){
  const { gameId } = req.body;
  const { from } = req.body;
  const { to } = req.body;
  try{
    const game_obj = await Game.findById(gameId);
    if(game_obj){
      const game = new Draughts(game_obj.fen)
      if(game.move({from: from, to: to }) != false){
          const data = parseFEN(game)
          log(`Moving a piece in ${gameId} from ${from} to ${to}`)
          if(game.gameOver()){
              log(`Game ${gameId} is over!`)
              const game_result = winCheck(game)
              if(game_result.status){
                  log(`Someone won game ${gameId}`)
                  await gameEnd(gameId,false,game_result.winner)
                  res.json({
                      winner: game_result.winner,
                      loser: game_result.loser,
                      board: data
                  })
              }else{
                  log(`Game ${gameId} just resulted in a tie, how lucky are you to be able to witness such a rare event?"`)
                  await gameEnd(gameId,true,game_result.winner)
                  res.json({
                      winner:"",
                      tie:true,
                      board:data
                  })
              }
          }else{
              log(`Moving a piece from game ${gameId}` )
              res.json({
                  winner: "",
                  board: data
              })
          }
      }else{
          log(`Something wrong while trying to move a piece for game ${gameId}`)
          res.status(400).send({message: "Error while making such move, you can try again or select a different move."})
      }
    }else{
      res.status(400).send({message: "Can't find such game"});
    }
  }catch (err) {
    log(`Something wrong while processing game ${gameId} request of moving a piece from ${from} to ${to}`);
    log(err);
    res.status(500).send({ message: 'Internal server error while leaving game' });
  }

}

/**
 ** UTILITIES
 */

/*Attaches to every Piece on the board its list of available moves for frontend purposes.
* String is to be sent to client on the form of:
* let data = [TURN, Map(WHITE_PIECE->MOVES),Map(BLACK_PIECE->MOVES)]
* es: [B,WHITE(3->(5,10,3)10K->(5,2,5,4)),BLACK(4->(5,10)10K->(5,2))]
* OBV a draught that's not a king can only have max 2 moves.
* K after a number means that piece is a KING
*/
function parseFEN(game) {
  let data = []
  const fields = game.fen.split(':')
  data.push(fields[0])
  
  let white_pieces = fields[1].split(',')
  let black_pieces = fields[2].split(',')

  white_pieces[0] = white_pieces[0].substring(1)
  black_pieces[0] = black_pieces[0].substring(1)

  const white_pieces_with_moves = new Map()
  const black_pieces_with_moves = new Map()

  for (let i = 0; i < black_pieces.length; i++) {
    const piece = black_pieces[i]
    if(piece !== "" && piece !== null){
      if(piece.charAt(0).equals("K")){
        const moves = game.getLegalMoves(piece.substring(1))
        black_pieces_with_moves.set(piece,moves)
      }else{
        const moves = game.getLegalMoves(piece)
          black_pieces_with_moves.set(piece,moves)
      }
    }
  }
  for (let i = 0; i < white_pieces.length; i++) {
    const piece = white_pieces[i]
    if(piece !== "" && piece !== null){
      if(piece.charAt(0).equals("K")){
        const moves = game.getLegalMoves(piece.substring(1))
          white_pieces_with_moves.set(piece,moves)
      }else{
        const moves = game.getLegalMoves(piece)
          white_pieces_with_moves.set(piece,moves)
      }
    }
  }
  data.push(Object.fromEntries(white_pieces_with_moves))
  data.push(Object.fromEntries(black_pieces_with_moves))
  return data
}