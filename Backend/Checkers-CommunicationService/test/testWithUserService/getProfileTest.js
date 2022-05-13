const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service getProfile Tests', async () => {
  it('getProfile should work', (done) => {
    api.getProfile(api.getClient(), api.getToken());
    api.getClient().on('user_profile', (arg) => {
      console.log(arg);
      done();
    });
  });
  it('getProfile should fail', (done) => {
    api.getProfile(api.getClient(), '');
    api.getClient().on('token_error', (arg) => {
      console.log(arg);
      assert.equal(arg.message, 'Please login before request profile');
      done();
    });
  });
});