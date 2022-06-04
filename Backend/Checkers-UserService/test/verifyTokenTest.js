const { expect } = require('chai');
const api = require('./utils/api');

describe('Verify token Test', async () => {
  it('should correct token', async () => {
    const verifiedToken = await api.verifyTokenUser(api.getToken());
    console.log(verifiedToken);
    if (verifiedToken.status === 200) {
      expect(verifiedToken.status).to.equal(200);
    } else {
      expect(verifiedToken.status).to.equal(400);
    }
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
