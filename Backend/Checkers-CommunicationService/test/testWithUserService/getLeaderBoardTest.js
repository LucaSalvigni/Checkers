const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service getLeaderboard Tests', async () => {
  it('getLeaderboard should work', (done) => {
    api.getLeaderboard(api.getClient(), api.getToken());
    api.getClient().on('leaderboard', (arg) => {
      console.log(arg);
      done();
    });
  });
  it('getLeaderboard should fail', (done) => {
    api.getLeaderboard(api.getClient(), '');
    api.getClient().off('token_error');
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'Please login before request leaderboard');
      done();
    });
  });
});
