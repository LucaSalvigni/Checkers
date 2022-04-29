const chai = require('chai');
const chaiHttp = require('chai-http');
const userService = require('../../index');

// Require the dev-dependencies
chai.use(chaiHttp);
chai.should();

const api = {
  async createUser(mail, username, password) {
    return {
      first_name: 'Tests',
      last_name: 'User',
      mail,
      username,
      password,
    };
  },

  async registerUser(user) {
    return chai.request(userService)
      .post('/signup')
      .send(user);
  },

  async loginUser(user) {
    return chai.request(userService)
      .post('/login')
      .send({ mail: user.mail, password: user.password });
  },

  async updateUserProfile(mail, user) {
    return chai.request(userService)
      .put('/profile/updateProfile')
      .send({ mail, params: user });
  },

  async refreshTokenUser(mail, token) {
    return chai.request(userService)
      .get('/refresh_token')
      .query({ mail, token });
  },

  async verifyTokenUser(token) {
    return chai.request(userService)
      .get('/authenticate')
      .send({ headers: { authorization: `Bearer ${token}` } });
  },

  async getLeaderboard() {
    return chai.request(userService)
      .get('/getLeaderboard');
  },

  async getProfile(mail) {
    return chai.request(userService)
      .get('/profile/getProfile')
      .query({ mail });
  },

  async getHistory(mail) {
    return chai.request(userService)
      .get('/profile/getHistory')
      .query({ mail });
  },
};
module.exports = api;
