const api = require('./utils/api');
const User = require('../models/userModel');

beforeEach(async () => {
  await User.deleteMany({ mail: 'userok@testusers.com' });
});

describe('Sign Up Test', () => {
  it('should register a new user', async () => {
    const newUser = await api.registerUser(api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
    newUser.should.have.status(200);
  });

  it('should get wrong mail to register', async () => {
    const newUser = await api.registerUser(api.createUser('manuele.pasini@gmail', 'filippo23', '12'));
    newUser.should.have.status(400);
  });

  it('should get wrong username to register', async () => {
    const newUser = await api.registerUser(api.createUser('ciao@ciao.com', 'c', '1231AAcc*'));
    newUser.should.have.status(400);
  });

  it('should get wrong password to register', async () => {
    const newUser = await api.registerUser(api.createUser('manuele.pasini@gmail.com', 'filippo23', '12'));
    newUser.should.have.status(400);
  });

  it('should user already exist', async () => {
    const newUser = await api.registerUser(api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
    newUser.should.have.status(200);
    const newUserFail = await api.registerUser(api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
    newUserFail.should.have.status(400);
  });
});
