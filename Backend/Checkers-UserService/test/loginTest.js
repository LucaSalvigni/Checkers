const { expect } = require('chai');
const api = require('./utils/api');

describe('Login Test', async () => {
  it('should login', async () => {
    const loggedUser = await api.loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
    api.setToken(loggedUser.response.token);
    if (loggedUser.status === 200) {
      expect(loggedUser.status).to.equal(200);
    } else {
      expect(loggedUser.status).to.equal(400);
    }
  });
  it('should fail login', async () => {
    const loggedUser = await api.loginUser({ mail: 'userok@testusers.com', password: 'ciao' });
    expect(loggedUser.status).to.equal(400);
    const loggedRandomUser = await api.loginUser({ mail: 'ciao@ciao.ciao', password: 'filippo23' });
    expect(loggedRandomUser.status).to.equal(400);
    const loggedUserFailMail = await api.loginUser({ mail: '', password: 'filippo23' });
    expect(loggedUserFailMail.status).to.equal(400);
    const loggedUserFailPsw = await api.loginUser({ mail: 'userok@testusers.com', password: '' });
    expect(loggedUserFailPsw.status).to.equal(400);
  });
  it("should can't manage empty request", async () => {
    const logFail = await api.loginUser({});
    expect(logFail.status).to.equal(400);
  });
});
