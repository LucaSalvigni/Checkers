// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
// Require server and model
const gameService = require('../index');

const gameId = 1;
const player = 'host@gmail.com';
const opponent = 'opponent@gmail.com';

chai.use(chaiHttp);
chai.should();

async function createGame(game) {
  return chai.request(gameService.app)
    .post('/game/lobbies/create_game')
    .send({ gameId: game.gameId, hostId: game.hostId, opponent: game.opponentId });
}

async function leaveGame(gameToQuit) {
  return chai.request(gameService.app)
    .delete('/game/leaveGame')
    .send({ gameId: gameToQuit.gameId, playerId: gameToQuit.playerId });
}

// Game testing

describe('Game', async () => {
  describe('POST Game', async () => {
    it('should create a new game', async () => {
      const newGame = {
        gameId: 1,
        hostId: player,
        opponentId: opponent,
      };
      const game = await createGame(newGame);
      game.should.have.status(200);
    });
  });
  describe('DELETE Game', async () => {
    it('should fail to terminate a game', async () => {
      const gameToQuit = {
        gameId,
        playerId: 'fake_user@gmail.com',
      };
      const playerLeft = await leaveGame(gameToQuit);
      playerLeft.should.have.status(400);
    });
    it('should fail to terminate a game', async () => {
      const gameToQuit = {
        gameId: 2,
        playerId: player,
      };
      const playerLeft = await leaveGame(gameToQuit);
      playerLeft.should.have.status(400);
    });
    it('should make host@gmail.com leave current game', async () => {
      const gameToQuit = {
        gameId,
        playerId: player,
      };
      const playerLeft = await leaveGame(gameToQuit);
      playerLeft.should.have.status(200);
    });
  });
});
