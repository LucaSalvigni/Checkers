const api = require('../utils/api');

describe('Communication Service Leave Game Test', async () => {
  it('leave game should work', (done) => {
    api.leaveGame(api.getClient(), api.getLobbyId(), api.getToken());
    api.getClient().off('left_game');
    api.getClient().on('left_game', (arg) => {
      console.log(arg);
      done();
    });
  });
});
