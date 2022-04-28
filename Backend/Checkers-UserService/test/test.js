const api = require('./utils/api');
const User = require('../models/userModel');

// Testing

describe('User tests', () => {
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

  describe('Login Test', () => {
    beforeEach(async () => {
      await api.registerUser(api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
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

  describe('Refresh token Test', () => {
    let token = null;
    beforeEach(async () => {
      await api.registerUser(api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
      const loggedUser = await api.loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
      token = loggedUser.body.token;
    });
    it('should refresh token', async () => {
      console.log(token)
      const refreshUserToken = await api.refreshTokenUser('userok@testusers.com', token);
      refreshUserToken.should.have.status(200);
    });

    it('should fail refresh token with not registred mail', async () => {
      const refreshUserToken = await api.refreshTokenUser('lu@lu.com', token);
      refreshUserToken.should.have.status(400);
    });

    it('should fail refresh token with wrong mail', async () => {
      const refreshUserToken = await api.refreshTokenUser('ciao@ciao.com', token);
      refreshUserToken.should.have.status(400);
    });
  });

  describe('Verify token Test', () => {
    let token = null;
    beforeEach(async () => {
      await api.registerUser(api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
      const loggedUser = await api.loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
      token = loggedUser.body.token;
    });
    it('should correct token', async () => {
      const verifiedToken = await api.verifyTokenUser(token);
      verifiedToken.should.have.status(200);
    });
    it('should undefined token', async () => {
      const notVerifiedToken = await api.verifyTokenUser(undefined);
      notVerifiedToken.should.have.status(400);
    });
  });

  describe('Get profile Test', () => {
    it('should get profile', async () => {
      const profile = await api.getProfile('ciao@ciao.com');
      if (profile.status === 200) {
        profile.should.have.status(200);
      } else {
        profile.should.have.status(500);
      }
    });
    it('should not get profile', async () => {
      const profile = await api.getProfile('c@c.com');
      profile.should.have.status(400);
    });
  });

  describe('Get history Test', () => {
    it('should get history', async () => {
      const history = await api.getHistory('ciao@ciao.com');
      if (history.status === 200) {
        history.should.have.status(200);
      } else {
        history.should.have.status(500);
      }
    });
    it('should not get history', async () => {
      const profile = await api.getHistory('c@c.com');
      profile.should.have.status(400);
    });
  });

  describe('Get leaderboard Test', () => {
    it('should get leaderboard', async () => {
      const leaderboard = await api.getLeaderboard();
      leaderboard.should.have.status(200);
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
      newUser = api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
      await api.registerUser(newUser);
    });
    it('should update profile', async () => {
      const updatedUser = await api.updateUserProfile(newUser.mail, newValues);
      updatedUser.should.have.status(200);
    });
    it('should not update profile mail', async () => {
      const updatedUser = await api.updateUserProfile(newUser.mail, newWrongValues);
      updatedUser.should.have.status(400);
    });
    it('should not update unexisting profile', async () => {
      const updatedUser = await api.updateUserProfile('new_mail@gmail.com', newWrongValues);
      updatedUser.should.have.status(400);
    });
  });
});
