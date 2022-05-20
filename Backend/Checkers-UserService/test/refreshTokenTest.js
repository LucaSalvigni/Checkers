const { expect } = require('chai');
const api = require('./utils/api');

let token = null;

describe('Refresh token Test', async () => {
  before(async () => {
    const loggedUser = await api.loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
    token = loggedUser.response.token;
  });
  it('should refresh token', async () => {
    const refreshUserToken = await api.refreshTokenUser('userok@testusers.com', token);
    console.log(refreshUserToken);
    if (refreshUserToken.status === 200) {
      expect(refreshUserToken.status).to.equal(200);
    } else {
      expect(refreshUserToken.status).to.equal(400);
    }
  });

  it('should fail refresh token with not registred mail', async () => {
    const refreshUserToken = await api.refreshTokenUser('lu@lu.com', token);
    expect(refreshUserToken.status).to.equal(400);
  });

  it('should fail refresh token with wrong mail', async () => {
    const refreshUserToken = await api.refreshTokenUser('ciao@ciao.com', token);
    expect(refreshUserToken.status).to.equal(400);
  });
});
