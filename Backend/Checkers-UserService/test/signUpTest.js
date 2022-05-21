const fs = require('fs');
const { expect } = require('chai');
const api = require('./utils/api');

describe('Sign Up Test', async () => {
  before(async () => {
    fs.unlink('./jwt_secret', (error) => {
      if (error) {
        console.log('No secret found');
      }
    });
  });

  it('should register a new user', async () => {
    const newUser = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
    const register = await api.registerUser(newUser);
    if (register.status === 200) {
      expect(register.status).to.equal(200);
    } else {
      expect(register.status).to.equal(400);
    }
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
    const newUser = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
    const register = await api.registerUser(newUser);
    if (register.status === 200) {
      expect(register.status).to.equal(200);
    } else {
      expect(register.status).to.equal(400);
    }
  });
});
