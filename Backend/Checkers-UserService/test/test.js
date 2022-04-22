const chai = require('chai');
const chaiHttp = require('chai-http');
const userService = require('../index');
const User = require('../models/userModel');

// Require the dev-dependencies

chai.use(chaiHttp);
chai.should();

function neOKUser() {
  return {
    first_name: 'Tests',
    last_name: 'User',
    mail: 'userok@testusers.com',
    username: 'filippo23',
    password: '1231AAcc*',
  };
}

function newWrongUser() {
  return {
    first_name: 'Tests',
    last_name: 'User',
    mail: 'manuele.pasini@gmail',
    username: 'filippo23',
    password: '12',
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

describe('Users', () => {
  beforeEach(async () => {
    await User.deleteMany({ mail: 'userok@testusers.com' });
  });

  // TESTING POST REQUESTS
  describe('POST users', () => {
    it('should register a new user', async () => {
      const newUser = await registerUser(neOKUser());
      newUser.should.have.status(200);
    });
    it('should FAIL to register a new user', async () => {
      const newUser = await registerUser(newWrongUser());
      newUser.should.have.status(400);
    });
    it('should login a user', async () => {
      const user = neOKUser();
      const registeredUser = await registerUser(user);
      const loggedUser = await loginUser({ mail: user.mail, password: user.password });
      registeredUser.should.have.status(200);
      loggedUser.should.have.status(200);
    });
    it('should FAIL to login a user', async () => {
      const loggedUser = await loginUser({ mail: 'ciao@ciao.ciao', password: 'filippo23' });
      loggedUser.should.have.status(400);
    });
  });
  // TESTING PUT REQUESTS
  describe('Testing PUT users', () => {
    it('should update profile', async () => {
      const newUser = neOKUser();
      await registerUser(newUser);
      console.log(`HELLO THERE${newUser.mail}`);
      const newValues = {
        first_name: 'Riccardo',
        last_name: 'Fogli',
        mail: newUser.mail,
      };
      const updatedUser = await updateUserProfile(newUser.mail, newValues);
      updatedUser.should.have.status(200);
    });
    it('should FAIL to  update profile', async () => {
      const newUser = neOKUser();
      await registerUser(newUser);
      console.log(`HELLO THERE${newUser.mail}`);
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
