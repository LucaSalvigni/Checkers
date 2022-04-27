const chai = require('chai');
const chaiHttp = require('chai-http');
const userService = require('../../index');

// Require the dev-dependencies
chai.use(chaiHttp);
chai.should();

const api = {
  createUser(mail, username, password) {
    return {
      first_name: 'Tests',
      last_name: 'User',
      mail,
      username,
      password,
    };
  },

  async registerUser(user) {
    const signUpRes = await chai.request(userService)
      .post('/signup')
      .send(user);
    return signUpRes;
  },

  async loginUser(user) {
    const loginRes = await chai.request(userService)
      .post('/login')
      .send({ mail: user.mail, password: user.password });
    return loginRes;
  },

  async updateUserProfile(mail, user) {
    const updateProfileRes = await chai.request(userService)
      .put('/profile/updateProfile')
      .send({ mail, params: user });
    return updateProfileRes;
  },

  async refreshTokenUser(mail, token) {
    const refreshTokenRes = await chai.request(userService)
      .get('/refresh_token')
      .send({ params: { mail, token } });
    return refreshTokenRes;
  },

  async verifyTokenUser(token) {
    const refreshTokenRes = await chai.request(userService)
      .get('/authenticate')
      .send({ headers: { authorization: `Bearer ${token}` } });
    return refreshTokenRes;
  },

  async getLeaderboard() {
    const leaderboard = await chai.request(userService)
      .get('/getLeaderboard');
    return leaderboard;
  },

  async getProfile(mail) {
    const profile = await chai.request(userService)
      .get('/profile/getProfile')
      .send({ params: { mail } });
    return profile;
  },

  async getHistory(mail) {
    const history = await chai.request(userService)
      .get('/profile/getHistory')
      .send({ params: { mail } });
    return history;
  },
};
module.exports = api;
