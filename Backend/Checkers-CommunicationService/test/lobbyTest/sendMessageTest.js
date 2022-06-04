const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Send Message Tests', async () => {
  it('send message should fail for token', (done) => {
    api.sendMessage(api.getClient(), api.getLobbyId(), 'Ciao mi chiamo Tordent', '');
    api.getClient().off('token_error');
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
  });

  it('send message should work', (done) => {
    api.sendMessage(api.getClient(), api.getLobbyId(), 'Ciao mi chiamo Tordent', api.getToken());
    api.getClient2().off('game_msg');
    api.getClient().off('token_error');

    api.getClient2().on('game_msg', (arg) => {
      assert.equal(arg.message, 'Ciao mi chiamo Tordent');
      done();
    });
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
  });
});
