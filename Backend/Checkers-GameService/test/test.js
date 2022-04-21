<<<<<<< HEAD
const assert = require('assert');

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
=======
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
// Require server and model
const gameService = require('../index');

const player = 'host@gmail.com';
const opponent = 'opponent@gmail.com';

chai.use(chaiHttp);
chai.should();

async function createGame(game) {
  return chai.request(gameService)
    .post('/game/lobbies/create_game')
    .send({ gameId: game.gameId, host_id: game.host_id, opponent: game.opponent_id });
}

// Game testing

describe('Game', async () => {
  describe('POST Game', async () => {
    it('should create a new game', async () => {
      const newGame = {
        gameId: 1,
        host_id: player,
        opponent_id: opponent,
      };
      const game = await createGame(newGame);
      game.should.have.status(200);
>>>>>>> feature-GHAdockerTesting
    });
  });
});
