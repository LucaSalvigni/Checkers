const { expect } = require('chai');
const api = require('./utils/api');

let token = null;

describe('Verify token Test', async () => {
  before(async () => {
    const loggedUser = await api.loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
    token = loggedUser.response.token;
  });
  it('should correct token', async () => {
    const verifiedToken = await api.verifyTokenUser(token);
    expect(verifiedToken.status).to.equal(200);
  });
  it('should undefined token', async () => {
    const notVerifiedToken = await api.verifyTokenUser();
    expect(notVerifiedToken.status).to.equal(400);
  });
  /* it('should give wrong token', async () => {
    const notVerifiedToken = await api.verifyTokenUser("ciao");
    notVerifiedToken.should.have.status(400)
  }) */
});
