// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
// Require server and model
const gameService = require('../index');

const player = 'host@gmail.com';
const opponent = 'opponent@gmail.com';

chai.use(chaiHttp);
chai.should();

// Get env variables
const { NODE_ENV } = process.env;
const { PORT } = process.env;

async function createGame(game) {
  const host = NODE_ENV === 'development' ? gameService : `localhost:${PORT}`;

  return chai.request(host)
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
    });
  });
});
