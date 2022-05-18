const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Leave Game Test', async () => {
  it('leave game should work', (done) => {
    api.leaveGame(api.getClient(), api.getLobbyId(), api.getToken());
    api.getClient().on('left_game', (arg) => {
      assert.equal(arg.message, 'You successfully left the game!\n 100 stars have been removed from your profile!');
      done();
    });
  });
});