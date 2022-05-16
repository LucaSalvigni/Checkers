const { assert } = require('chai');
const api = require('../utils/api');
const User = require('../../../Checkers-UserService/models/userModel');

describe('Communication Service SignUp Tests', async () => {
  before(async () => {
    const checkUser = await User.find({ mail: 'newtest@newtest.com' });
    if (checkUser.length > 0) {
      await User.deleteMany({ mail: 'newtest@newtest.com' });
    }
    const checkUser2 = await User.find({ mail: 'test2@test2.com' });
    if (checkUser2.length > 0) {
      await User.deleteMany({ mail: 'test2@test2.com' });
    }
  });
  it('signUp should work', (done) => {
    api.registerUser(api.getClient(), api.createUser('newtest@newtest.com', 'filippo23', '1231AAcc*'));
    api.getClient().on('signup_success', (arg) => {
      assert.equal(arg.message, 'Sign up completed successfully.');
    });
    api.registerUser(api.getClient2(), api.createUser('test2@test2.com', 'Tordent97', 'TestonE97?'));
    api.getClient2().on('signup_success', (arg) => {
      assert.equal(arg.message, 'Sign up completed successfully.');
      done();
    });
  });
  it('signUp should fail', (done) => {
    api.registerUser(api.getClient(), api.createUser('manuele.pasini@gmail', 'filippo23', '12'));
    api.getClient().on('signup_error', (arg) => {
      assert.equal(arg.message.message, 'Email not valid.');
      done();
    });
  });
});
