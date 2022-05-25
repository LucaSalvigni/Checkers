const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Delete Specific Lobby Test', async () => {
  it('delete lobby should fail for lobbyId', (done) => {
    api.deleteLobby(api.getClient(), 1, api.getToken());
    api.getClient().off('client_error');
    api.getClient().on('client_error', (arg) => {
      assert.equal(arg.message, "Can't find such lobby");
      done();
    });
  });

  it('delete lobby should fail for token', (done) => {
    api.deleteLobby(api.getClient(), api.getLobbyId(), '');
    api.getClient().off('token_error');
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
  });

  it('delete lobby should work', (done) => {
    api.buildLobby(api.getClient(), 'BestLobby', '500', api.getToken());
    api.getClient().off('lobbies');
    api.getClient().off('client_error');
    api.getClient().off('token_error');

    api.getClient().on('lobbies', (arg) => {
      api.setLobbyId(arg.lobbyId);
      api.deleteLobby(api.getClient(), api.getLobbyId(), api.getToken());
    });
    api.getClient().on('client_error', (arg) => {
      assert.equal(arg.message, 'Player is either not online or is already in some lobby.');
    });
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'Please login before build a lobby');
    });

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
