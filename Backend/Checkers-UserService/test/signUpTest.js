const api = require('./utils/api');
const User = require('../models/userModel');

describe('Sign Up Test', async () => {
  beforeEach(async () => {
    await User.deleteMany({ mail: 'userok@testusers.com' });
  });

  it('should register a new user', async () => {
    const newUser = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
    const register = await api.registerUser(newUser);
    register.should.have.status(200);
  });

  it('should get wrong mail to register', async () => {
    const newUser = await api.createUser('manuele.pasini@gmail', 'filippo23', '12');
    const register = await api.registerUser(newUser);
    register.should.have.status(400);
  });

  it('should get wrong username to register', async () => {
    const newUser = await api.createUser('ciao@ciao.com', 'c', '1231AAcc*');
    const register = await api.registerUser(newUser);
    register.should.have.status(400);
  });

  it('should get wrong password to register', async () => {
    const newUser = await api.createUser('manuele.pasini@gmail.com', 'filippo23', '12');
    const register = await api.registerUser(newUser);
    register.should.have.status(400);
  });

  it('should user already exist', async () => {
    const newUser = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
    const register = await api.registerUser(newUser);
    if(register.status === 200) {
      const newUserFail = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
      const registerFail = await api.registerUser(newUserFail);
      registerFail.should.have.status(400);
    } else {
      registerFail.should.have.status(400);
    }
  });
});
