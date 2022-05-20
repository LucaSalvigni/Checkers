const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Delete Specific Lobby Test', async () => {
  before((done) => {
    api.buildLobby(api.getClient(), 'BestLobby', '500', api.getToken());
    api.getClient().off('lobbies');
    api.getClient().on('lobbies', (arg) => {
      console.log(arg);
      api.setLobbyId(arg.lobbyId);
      done();
    });
  });
  it('delete lobby should work', (done) => {
    api.deleteLobby(api.getClient(), api.getLobbyId(), api.getToken());
    api.getClient().off('lobby_deleted');
    api.getClient().on('lobby_deleted', (arg) => {
      console.log(arg);
      assert.equal(arg.message, 'Your lobby has been successfully deleted');
      done();
    });
  });
});
