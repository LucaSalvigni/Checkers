const { assert } = require('chai');
const api = require('../utils/api');
const User = require('../../../Checkers-UserService/models/userModel');

describe('Communication Service SignUp Tests', async () => {
  before(async () => {
    const checkUser = await User.find({ mail: 'userok@testusers.com' });
    if (checkUser.length > 0) {
      await User.deleteMany({ mail: 'userok@testusers.com' });
    }
  });
  it('signUp should work', (done) => {
    api.registerUser(api.getClient(), api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
    api.getClient().on('signup_success', (arg) => {
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
