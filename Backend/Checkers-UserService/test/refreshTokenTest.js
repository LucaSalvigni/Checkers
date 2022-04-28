const api = require('./utils/api');
const User = require('../models/userModel');

let token = null;

describe('Refresh token Test', async () => {
  before(async () => {
    const checkUser = await User.find({ mail: 'userok@testusers.com' });
    if (checkUser.length === 0) {
      const user = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
      await api.registerUser(user);
    }
    const loggedUser = await api.loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
    token = loggedUser.body.token;
  });
  it('should refresh token', async () => {
    const refreshUserToken = await api.refreshTokenUser('userok@testusers.com', token);
    refreshUserToken.should.have.status(200);
  });

  it('should fail refresh token with not registred mail', async () => {
    const refreshUserToken = await api.refreshTokenUser('lu@lu.com', token);
    refreshUserToken.should.have.status(400);
  });

  it('should fail refresh token with wrong mail', async () => {
    const refreshUserToken = await api.refreshTokenUser('ciao@ciao.com', token);
    refreshUserToken.should.have.status(400);
  });
});
