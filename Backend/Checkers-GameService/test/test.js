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
  console.log(process.env.PORT);
  const environment = process.env.NODE_ENV;
  const host = environment === 'development' ? gameService : 'localhost:3032';

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
