const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Leave Game Test', async () => {
  it('leave game should fail for token', (done) => {
    api.leaveGame(api.getClient(), api.getLobbyId(), '');
    api.getClient().off('token_error');
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
  });

  it('leave game should fail for wrong lobbyId', (done) => {
    api.leaveGame(api.getClient(), 1, api.getToken());
    api.getClient().off('client_error');
    api.getClient().on('client_error', (arg) => {
      assert.equal(arg.message, "I don't know which lobby you're referring to and even if I knew you're not in it");
      done();
    });
  });

  it('leave game should work', (done) => {
    api.leaveGame(api.getClient(), api.getLobbyId(), api.getToken());
    api.getClient().off('left_game');
    api.getClient().off('server_error');
    api.getClient().off('token_error');
    api.getClient().off('client_error');

    api.getClient().on('left_game', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().on('server_error', (arg) => {
      assert.equal(arg.message, 'Something went wrong while leaving game, please try again');
      done();
    });
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
    api.getClient().on('client_error', (arg) => {
      if (arg.message.includes('referring')) {
        assert.equal(arg.message, "I don't know which lobby you're referring to and even if I knew you're not in it");
      } else {
        console.log(arg);
      }
      done();
    });
  });
});
