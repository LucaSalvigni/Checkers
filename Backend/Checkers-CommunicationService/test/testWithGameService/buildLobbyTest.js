const api = require('../utils/api');

describe('Communication Service Build Lobby Tests', async () => {
  it('build lobby should work', (done) => {
    api.buildLobby(api.getClient(), 'BestLobby', '500', api.getToken());
    api.getClient().on('lobbies', (arg) => {
      console.log(arg);
      done();
    });
  });
});
