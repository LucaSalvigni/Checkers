const api = require('../utils/api');

describe('Communication Service Join Lobby Tests', async () => {
  it('join lobby should work', (done) => {
    api.joinLobby(api.getClient2(), api.getLobbyId(), api.getToken2());
    api.getClient2().off('game_started');
    api.getClient2().on('game_started', (arg) => {
      console.log(arg);
      done();
    });
  });
});
