const api = require('../utils/api');

describe('Communication Service Join Lobby Tests', async () => {
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
      console.log(arg);
      done();
    });
    api.getClient2().on('server_error', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient2().on('client_error', (arg) => {
      console.log(arg);
      done();
    });
  });
});
