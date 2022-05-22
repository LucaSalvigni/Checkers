const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Delete Specific Lobby Test', async () => {
  /* before((done) => {
    api.buildLobby(api.getClient(), 'BestLobby', '500', api.getToken());
    api.getClient().off('lobbies');
    api.getClient().on('lobbies', (arg) => {
      console.log(arg);
      api.setLobbyId(arg.lobbyId);
      done();
    });
  }); */
  it('delete lobby should work', (done) => {
    api.deleteLobby(api.getClient(), api.getLobbyId(), api.getToken());
    api.getClient().off('lobby_deleted');
    api.getClient().off('server_error');
    api.getClient().off('token_error');
    api.getClient().off('client_error');

    api.getClient().on('lobby_deleted', (arg) => {
      console.log(arg);
      assert.equal(arg.message, 'Your lobby has been successfully deleted');
      done();
    });
    api.getClient().on('server_error', (arg) => {
      assert.equal(arg.message, 'There has been some problem with the process of deleting a lobby.');
      done();
    });
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
    api.getClient().on('client_error', (arg) => {
      assert.equal(arg.message, "Can't find such lobby");
      done();
    });
  });
});
