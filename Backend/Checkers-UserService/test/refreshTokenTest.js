const { expect } = require('chai');
const api = require('./utils/api');

describe('Refresh token Test', async () => {
  it('should refresh token', async () => {
    const refreshUserToken = await api.refreshTokenUser('userok@testusers.com', api.getToken());
    console.log(refreshUserToken);
    if (refreshUserToken.status === 200) {
      api.setToken(refreshUserToken.response.checkToken);
      expect(refreshUserToken.status).to.equal(200);
    } else {
      expect(refreshUserToken.status).to.equal(400);
    }
  });

  it('should fail refresh token with not registred mail', async () => {
    const refreshUserToken = await api.refreshTokenUser('lu@lu.com', api.getToken());
    expect(refreshUserToken.status).to.equal(400);
  });

  it('should fail refresh token with wrong mail', async () => {
    const refreshUserToken = await api.refreshTokenUser('ciao@ciao.com', api.getToken());
    expect(refreshUserToken.status).to.equal(400);
  });
});
