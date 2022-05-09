const fs = require('fs');
const { expect } = require('chai');
const api = require('./utils/api');
const User = require('../models/userModel');

describe('Sign Up Test', async () => {
  before(async () => {
    // Just a comment
    const checkUser = await User.find({ mail: 'userok@testusers.com' });
    if (checkUser.length > 0) {
      await User.deleteMany({ mail: 'userok@testusers.com' });
    }
    fs.unlink('./jwt_secret', (error) => {
      if (error) {
        console.log('No secret found');
      }
    });
  });

  it('should register a new user', async () => {
    const newUser = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
    const register = await api.registerUser(newUser);
    expect(register.status).to.equal(200);
  });

  it('should get wrong mail to register', async () => {
    const newUser = await api.createUser('manuele.pasini@gmail', 'filippo23', '12');
    const register = await api.registerUser(newUser);
    expect(register.status).to.equal(400);
  });

  it('should get wrong username to register', async () => {
    const newUser = await api.createUser('ciao@ciao.com', 'c', '1231AAcc*');
    const register = await api.registerUser(newUser);
    expect(register.status).to.equal(400);
  });

  it('should get wrong password to register', async () => {
    const newUser = await api.createUser('manuele.pasini@gmail.com', 'filippo23', '12');
    const register = await api.registerUser(newUser);
    expect(register.status).to.equal(400);
  });

  it('should user already exist', async () => {
    const newUserFail = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
    const registerFail = await api.registerUser(newUserFail);
    expect(registerFail.status).to.equal(400);
  });
});
