const chai = require('chai');
const chaiHttp = require('chai-http');
const userService = require('../index');
const User = require('../models/userModel');

// Require the dev-dependencies

chai.use(chaiHttp);
chai.should();

function createUser(mail, username, password) {
  return {
    first_name: 'Tests',
    last_name: 'User',
    mail,
    username,
    password,
  };
}

async function registerUser(user) {
  const signUpRes = await chai.request(userService)
    .post('/signup')
    .send(user);
  return signUpRes;
}

async function loginUser(user) {
  const loginRes = await chai.request(userService)
    .post('/login')
    .send({ mail: user.mail, password: user.password });
  return loginRes;
}

async function updateUserProfile(mail, user) {
  const updateProfileRes = await chai.request(userService)
    .put('/profile/updateProfile')
    .send({ mail, params: user });
  return updateProfileRes;
}

describe('User tests', () => {
  beforeEach(async () => {
    await User.deleteMany({ mail: 'userok@testusers.com' });
  });
  describe('Sign Up Test', () => {
    it('should register a new user', async () => {
      const newUser = await registerUser(createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
      newUser.should.have.status(200);
    });

    it('should get wrong mail to register', async () => {
      const newUser = await registerUser(createUser('manuele.pasini@gmail', 'filippo23', '12'));
      newUser.should.have.status(400);
    });

    it('should get wrong username to register', async () => {
      const newUser = await registerUser(createUser('ciao@ciao.com', 'c', '1231AAcc*'));
      newUser.should.have.status(400);
    });

    it('should get wrong password to register', async () => {
      const newUser = await registerUser(createUser('manuele.pasini@gmail.com', 'filippo23', '12'));
      newUser.should.have.status(400);
    });

    it('should user already exist', async () => {
      const newUser = await registerUser(createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
      newUser.should.have.status(200);
      const newUserFail = await registerUser(createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
      newUserFail.should.have.status(400);
    });
  });

  describe('Login Test', () => {
    it('should login', async () => {
      const newUser = await registerUser(createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
      newUser.should.have.status(200);
      const loggedUser = await loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
      loggedUser.should.have.status(200);
    });
    it('should fail login', async () => {
      const newUser = await registerUser(createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
      newUser.should.have.status(200);
      const loggedUser = await loginUser({ mail: 'userok@testusers.com', password: 'ciao' });
      loggedUser.should.have.status(400);
      const loggedRandomUser = await loginUser({ mail: 'ciao@ciao.ciao', password: 'filippo23' });
      loggedRandomUser.should.have.status(400);
      const loggedUserFailMail = await loginUser({ mail: '', password: 'filippo23' });
      loggedUserFailMail.should.have.status(400);
      const loggedUserFailPsw = await loginUser({ mail: 'userok@testusers.com', password: '' });
      loggedUserFailPsw.should.have.status(400);
    });
  });

  describe('Update profile Test', () => {
    it('should update profile', async () => {
      const newUser = createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
      await registerUser(newUser);
      const newValues = {
        first_name: 'Riccardo',
        last_name: 'Fogli',
        mail: newUser.mail,
      };
      const updatedUser = await updateUserProfile(newUser.mail, newValues);
      updatedUser.should.have.status(200);
    });
    it('should FAIL to  update profile', async () => {
      const newUser = createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
      await registerUser(newUser);
      const newValues = {
        first_name: 'Riccardo',
        last_name: 'Fogli',
        mail: 'new_mail@gmail.com',
      };
      const updatedUser = await updateUserProfile(newUser.mail, newValues);
      // can't update mail
      updatedUser.should.have.status(400);
    });
  });
});
