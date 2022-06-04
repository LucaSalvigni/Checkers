const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service getLeaderboard Tests', async () => {
  it('getLeaderboard should work', (done) => {
    api.getLeaderboard(api.getClient(), api.getToken());
    api.getClient().off('leaderboard');
    api.getClient().off('token_error');
    api.getClient().off('client_error');

    api.getClient().on('leaderboard', () => {
      // console.log(arg);
      done();
    });
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'Please login before request leaderboard');
      done();
    });
    api.getClient().on('client_error', (arg) => {
      console.log(arg);
      done();
    });
  });
  it('getLeaderboard should fail for token', (done) => {
    api.getLeaderboard(api.getClient(), '');
    api.getClient().off('token_error');
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'Please login before request leaderboard');
      done();
    });
  });
});
