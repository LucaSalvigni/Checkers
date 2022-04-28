const api = require('./utils/api');

describe('Login Test', async () => {
  beforeEach(async () => {
    const user = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
    await api.registerUser(user);
  });
  it('should login', async () => {
    const loggedUser = await api.loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
    loggedUser.should.have.status(200);
  });
  it('should fail login', async () => {
    const loggedUser = await api.loginUser({ mail: 'userok@testusers.com', password: 'ciao' });
    loggedUser.should.have.status(400);
    const loggedRandomUser = await api.loginUser({ mail: 'ciao@ciao.ciao', password: 'filippo23' });
    loggedRandomUser.should.have.status(400);
    const loggedUserFailMail = await api.loginUser({ mail: '', password: 'filippo23' });
    loggedUserFailMail.should.have.status(400);
    const loggedUserFailPsw = await api.loginUser({ mail: 'userok@testusers.com', password: '' });
    loggedUserFailPsw.should.have.status(400);
  });
});
