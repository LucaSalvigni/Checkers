const api = require('./utils/api');
const User = require('../models/userModel');

let token = null;

describe('Verify token Test', async () => {
  before(async () => {
    const checkUser = await User.find({ mail: 'userok@testusers.com' });
    if (checkUser.length === 0) {
      const user = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
      await api.registerUser(user);
    }
    const loggedUser = await api.loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
    token = loggedUser.body.token;
  });
  it('should correct token', async () => {
    const verifiedToken = await api.verifyTokenUser(token);
    verifiedToken.should.have.status(200);
  });
  it('should undefined token', async () => {
    const notVerifiedToken = await api.verifyTokenUser();
    notVerifiedToken.should.have.status(400);
  });
  /* it('should give wrong token', async () => {
    const notVerifiedToken = await api.verifyTokenUser("ciao");
    notVerifiedToken.should.have.status(400)
  }) */
});
