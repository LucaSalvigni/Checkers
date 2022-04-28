const api = require('./utils/api');

let token = null;

describe('Verify token Test', async () => {
  before(async () => {
    const user = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
    await api.registerUser(user);
    const loggedUser = await api.loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
    token = loggedUser.body.token;
  });
  it('should correct token', async () => {
    const verifiedToken = await api.verifyTokenUser(token);
    verifiedToken.should.have.status(200);
  });
  it('should undefined token', async () => {
    const notVerifiedToken = await api.verifyTokenUser(undefined);
    notVerifiedToken.should.have.status(400);
  });
});
