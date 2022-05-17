const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Send Message Tests', async () => {
  it('send message should work', (done) => {
    console.log(api.getLobbyId());
    api.sendMessage(api.getClient(), api.getLobbyId(), 'Ciao mi chiamo Tordent', api.getToken());
    api.getClient2().on('game_msg', (arg) => {
      assert.equal(arg.message, 'Ciao mi chiamo Tordent');
      done();
    });
  });
});