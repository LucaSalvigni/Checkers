const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Build Lobby Tests', async () => {
  it('build lobby should work', (done) => {
    api.buildLobby(api.getClient(), 'BestLobby', '500', api.getToken());
    api.getClient().on('lobbies', (arg) => {
      console.log(arg);
      api.setLobbyId(arg.lobbyId);
      done();
    });
  });
  it('build lobby should faiul for token', (done) => {
    api.buildLobby(api.getClient2(), 'BestLobby', '500', '');
    api.getClient2().off('token_error');
    api.getClient2().on('token_error', (arg) => {
      assert.equal(arg.message, 'Please login before build a lobby');
      done();
    });
  });
});
