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

async function refreshTokenUser(mail, token) {
  const refreshTokenRes = await chai.request(userService)
    .get('/refresh_token')
    .send({ params: { mail, token } });
  return refreshTokenRes;
}

async function verifyTokenUser(token) {
  const refreshTokenRes = await chai.request(userService)
    .get('/authenticate')
    .send({ headers: { authorization: `Bearer ${token}` } });
  return refreshTokenRes;
}

async function getLeaderboard() {
  const leaderboard = await chai.request(userService)
    .get('/getLeaderboard');
  return leaderboard;
}

async function getProfile(mail) {
  const profile = await chai.request(userService)
    .get('/profile/getProfile')
    .send({ params: { mail } });
  return profile;
}

async function getHistory(mail) {
  const history = await chai.request(userService)
    .get('/profile/getHistory')
    .send({ params: { mail } });
  return history;
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
    beforeEach(async () => {
      await registerUser(createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
    });
    it('should login', async () => {
      const loggedUser = await loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
      loggedUser.should.have.status(200);
    });
    it('should fail login', async () => {
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

  describe('Refresh token Test', () => {
    let token = null;
    beforeEach(async () => {
      await registerUser(createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
      const loggedUser = await loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
      token = loggedUser.body.token;
    });
    it('should refresh token', async () => {
      const refreshUserToken = await refreshTokenUser('userok@testusers.com', token);
      refreshUserToken.should.have.status(200);
    });

    it('should fail refresh token with not registred mail', async () => {
      const refreshUserToken = await refreshTokenUser('lu@lu.com', token);
      refreshUserToken.should.have.status(400);
    });

    it('should fail refresh token with wrong mail', async () => {
      const refreshUserToken = await refreshTokenUser('ciao@ciao.com', token);
      refreshUserToken.should.have.status(400);
    });
  });

  describe('Verify token Test', () => {
    let token = null;
    beforeEach(async () => {
      await registerUser(createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
      const loggedUser = await loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
      token = loggedUser.body.token;
    });
    it('should correct token', async () => {
      const verifiedToken = await verifyTokenUser(token);
      verifiedToken.should.have.status(200);
    });
    it('should undefined token', async () => {
      const notVerifiedToken = await verifyTokenUser(undefined);
      notVerifiedToken.should.have.status(400);
    });
  });

  describe('Get profile Test', () => {
    it('should get profile', async () => {
      const profile = await getProfile('ciao@ciao.com');
      if (profile.status === 200) {
        profile.should.have.status(200);
      } else {
        profile.should.have.status(500);
      }
    });
    it('should not get profile', async () => {
      const profile = await getProfile('c@c.com');
      profile.should.have.status(400);
    });
  });

  describe('Get history Test', () => {
    it('should get history', async () => {
      const history = await getHistory('ciao@ciao.com');
      if (history.status === 200) {
        history.should.have.status(200);
      } else {
        history.should.have.status(500);
      }
    });
    it('should not get history', async () => {
      const profile = await getHistory('');
      profile.should.have.status(400);
    });
  });

  describe('Get leaderboard Test', () => {
    it('should get leaderboard', async () => {
      const leaderboard = await getLeaderboard();
      if (leaderboard.status === 200) {
        leaderboard.should.have.status(200);
      } else {
        leaderboard.should.have.status(500);
      }
    });
  });

  describe('Update profile Test', () => {
    const newValues = {
      first_name: 'Riccardo',
      last_name: 'Fogli',
      mail: 'userok@testusers.com',
      username: 'pippo23',
      avatar: '',
    };
    const newWrongValues = {
      first_name: 'Riccardo',
      last_name: 'Fogli',
      mail: 'new_mail@gmail.com',
      username: 'ricky23',
      avatar: '',
    };
    let newUser = null;
    beforeEach(async () => {
      newUser = createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
      await registerUser(newUser);
    });
    it('should update profile', async () => {
      const updatedUser = await updateUserProfile(newUser.mail, newValues);
      updatedUser.should.have.status(200);
    });
    it('should not update profile mail', async () => {
      const updatedUser = await updateUserProfile(newUser.mail, newWrongValues);
      updatedUser.should.have.status(400);
    });
    it('should not update unexisting profile', async () => {
      const updatedUser = await updateUserProfile('new_mail@gmail.com', newWrongValues);
      updatedUser.should.have.status(400);
    });
  });
});
