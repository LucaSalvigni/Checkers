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
