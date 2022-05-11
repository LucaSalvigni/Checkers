const api = require('../utils/api');

describe('Communication Service getLeaderboard Tests', async () => {
  it('getLeaderboard should work', (done) => {
    api.getLeaderboard(api.getClient(), api.getToken());
    api.getClient().on('leaderboard', (arg) => {
      console.log(arg);
      done();
    });
  });
});
