// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
// Require server and model
const gameService = require('../index');
const gameModel = require('../models/gameModel');

let testGame;
const player = '6263c5d6e4e2e9916c574c8a';
const opponent = '6266a229ea5c6213e5a60cc6';

chai.use(chaiHttp);
chai.should();

async function createGame(game) {
  return chai.request(gameService.app)
    .post('/game/lobbies/create_game')
    .send({ hostId: game.hostId, opponent: game.opponentId });
}

async function leaveGame(gameToQuit) {
  return chai.request(gameService.app)
    .delete('/game/leaveGame')
    .send({ gameId: gameToQuit.gameId, playerId: gameToQuit.playerId });
}

async function movePiece(gameMove) {
  return chai.request(gameService.app)
    .put('/game/movePiece')
    .send({ gameId: gameMove.gameId, from: gameMove.from, to: gameMove.to });
}

async function changeTurn(gameId) {
  return chai.request(gameService.app)
    .put('/game/turnChange')
    .send({ gameId });
}

// Game testing

describe('Game', async () => {
  // Clear the DB
  after(async () => {
    if (typeof testGame !== 'undefined') {
      console.log(`Deleting game ${testGame._id}`);
      await gameModel.findByIdAndDelete(testGame._id);
    }
  });

  describe('POST Game', async () => {
    it('should create a new game', async () => {
      let newGame = {
        hostId: player,
        opponentId: opponent,
      };
      newGame = await createGame(newGame);
      newGame.should.have.status(200);
      testGame = newGame.body.game;
    });
  });

  describe('PUT Game', async () => {
    it('should move a piece from player2 into a game', async () => {
      const gameMove = {
        gameId: testGame._id,
        from: 31,
        to: 26,
      };
      const newPiece = await movePiece(gameMove);
      newPiece.should.have.status(200);
    });

    // Player1 just moved a piece, trying to move a piece from the same player as before
    it('should fail to move another piece from player1 into a game', async () => {
      const wrongMove = {
        gameId: testGame._id,
        from: 33,
        to: 29,
      };
      const newPiece = await movePiece(wrongMove);
      newPiece.should.have.status(400);
    });

    // Moving a piece from player2
    it('should move a piece from player2', async () => {
      const gameMove = {
        gameId: testGame._id,
        from: 20,
        to: 25,
      };
      const newPiece = await movePiece(gameMove);
      newPiece.should.have.status(200);
    });

    // Should be player1 turn now, chaning turn to make player2's turn again
    it('should change turn', async () => {
      const turnChanged = await changeTurn(testGame._id);
      turnChanged.should.have.status(200);
    });

    // By changing turns, it's again player2' turn
    it('should move piece from player2', async () => {
      const gameMove = {
        gameId: testGame._id,
        from: 19,
        to: 24,
      };
      const newPiece = await movePiece(gameMove);
      newPiece.should.have.status(200);
    });
  });

  describe('DELETE Game', async () => {
    it('should fail to terminate a game', async () => {
      const gameToQuit = {
        gameId: testGame._id,
        playerId: 'FakeLikePythonDevs',
      };
      const playerLeft = await leaveGame(gameToQuit);
      playerLeft.should.have.status(400);
    });
    it('should make host leave current game', async () => {
      const gameToQuit = {
        gameId: testGame._id,
        playerId: player,
      };
      const playerLeft = await leaveGame(gameToQuit);
      playerLeft.should.have.status(200);
    });
  });
});
