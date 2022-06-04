const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Get Lobbies Tests', async () => {
  it('get lobbies should work', (done) => {
    api.getLobbies(api.getClient2(), '500', api.getToken2());
    api.getClient2().off('lobbies');
    api.getClient2().off('token_error');

    api.getClient2().on('lobbies', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient2().on('token_error', (arg) => {
      assert.equal(arg.message, 'Please login before request a lobby');
      done();
    });
  });
  it('get lobbies should fail for token', (done) => {
    api.getLobbies(api.getClient2(), 'BestLobby', '500', '');
    api.getClient2().off('token_error');
    api.getClient2().on('token_error', (arg) => {
      assert.equal(arg.message, 'Please login before request a lobby');
      done();
    });
  });
});
