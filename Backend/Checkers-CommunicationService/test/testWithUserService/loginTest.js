const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service SignIn Tests', async () => {
  it('login should fail', (done) => {
    api.loginUser(api.getClient(), { mail: 'newtest@newtest.com', password: 'ciao' });
    api.getClient().on('login_error', (arg) => {
      assert.equal(arg.message.message, 'Authentication failed, wrong email and/or password');
      done();
    });
  });
  it('login should work', (done) => {
    api.loginUser(api.getClient(), { mail: 'newtest@newtest.com', password: '1231AAcc*' });
    api.getClient().on('login_ok', (arg) => {
      api.setToken(arg.token);
      assert.equal(arg.message, 'Authentication successfull, welcome back filippo23!');
      done();
    });
  });
  it('login should fail', (done) => {
    api.loginUser(api.getClient2(), { mail: 'newtest@newtest.com', password: 'Miao*' });
    api.getClient2().on('login_error', (arg) => {
      assert.equal(arg.message, 'Someone is already logged in with such email');
      done();
    });
  });
});
