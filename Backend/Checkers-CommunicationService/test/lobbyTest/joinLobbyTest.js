const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Join Lobby Tests', async () => {
  it('join lobby should fail for wrong lobbyId', (done) => {
    api.joinLobby(api.getClient2(), 1, api.getToken2());
    api.getClient2().off('server_error');
    api.getClient2().on('server_error', (arg) => {
      assert.equal(arg.message, "Such lobby doesn't exist anymore");
      done();
    });
  });

  it('join lobby should fail because you are already in a lobby', (done) => {
    api.joinLobby(api.getClient(), api.getLobbyId(), api.getToken());
    api.getClient().off('client_error');
    api.getClient().on('client_error', (arg) => {
      assert.equal(arg.message, 'Player is not online or is already in a lobby');
      done();
    });
  });

  it('join lobby should fail for token', (done) => {
    api.joinLobby(api.getClient2(), api.getLobbyId(), '');
    api.getClient2().off('token_error');
    api.getClient2().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
  });

  it('join lobby should work', (done) => {
    api.joinLobby(api.getClient2(), api.getLobbyId(), api.getToken2());
    api.getClient2().off('game_started');
    api.getClient2().off('token_error');
    api.getClient2().off('server_error');
    api.getClient2().off('client_error');

    api.getClient2().on('game_started', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient2().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
    api.getClient2().on('server_error', (arg) => {
      if (arg.message.includes('creating')) {
        assert.equal(arg.message, 'Server error while creating a game, please try again');
      } else if (arg.message.includes('joining')) {
        assert.equal(arg.message, 'Server error while joining lobby, please try again');
      } else {
        assert.equal(arg.message, 'Something went wrong while processing your game');
      }
      done();
    });
    api.getClient2().on('client_error', (arg) => {
      assert.equal(arg.message, 'Player is not online or is already in a lobby');
      done();
    });
  });
});
