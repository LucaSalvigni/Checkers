const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service SignUp Tests', async () => {
  before(async () => {
    api.getClient().disconnect();
    api.getClient().connect();
  });
  it('signUp should work', (done) => {
    api.registerUser(api.getClient(), api.createUser('newtest@newtest.com', 'filippo23', '1231AAcc*'));
    api.getClient().off('signup_success');
    api.getClient().off('signup_error');

    api.getClient().on('signup_success', (arg) => {
      assert.equal(arg.message, 'Sign up completed successfully.');
    });
    api.getClient().on('signup_error', (arg) => {
      assert.equal(arg.message.message, 'An existing account has already been associated with this email.');
      done();
    });
  });
  it('signUp should work for second user', (done) => {
    api.registerUser(api.getClient2(), api.createUser('test2@test2.com', 'Tordent97', 'TestonE97?'));
    api.getClient2().off('signup_success');
    api.getClient2().off('signup_error');

    api.getClient2().on('signup_success', (arg) => {
      assert.equal(arg.message, 'Sign up completed successfully.');
      done();
    });
    api.getClient2().on('signup_error', (arg) => {
      assert.equal(arg.message.message, 'An existing account has already been associated with this email.');
      done();
    });
  });
  it('signUp should fail', (done) => {
    api.registerUser(api.getClient(), api.createUser('manuele.pasini@gmail', 'filippo23', '12'));
    api.getClient().off('signup_error');
    api.getClient().on('signup_error', (arg) => {
      assert.equal(arg.message.message, 'Email not valid.');
      done();
    });
  });
});
