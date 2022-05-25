const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Get History Tests', async () => {
  it('getHistory should work', (done) => {
    api.getHistory(api.getClient(), api.getToken());
    api.getClient().off('user_history');
    api.getClient().off('token_error');

    api.getClient().on('user_history', () => {
      // console.log(arg);
      done();
    });
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'You are not authenticated, please login before request history');
      done();
    });
  });
  it('getHistory should fail for token', (done) => {
    api.getHistory(api.getClient(), '');
    api.getClient().off('token_error');
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'You are not authenticated, please login before request history');
      done();
    });
  });
});
