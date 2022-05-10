// const chai = require('chai');
const Client = require('socket.io-client');
require('../../index');
require('../../../Checkers-UserService/index')
// const chaiHttp = require('chai-http');
// require('../../../Checkers-GameService/index')

// Require the dev-dependencies
// chai.use(chaiHttp);
// chai.should();
// Debug

let clientSocket = new Client('http://:3030');


const api = {

  getClient() {
    return clientSocket;
  },

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
    /* return chai.request(userService)
      .post('/signup')
      .send(user); */
  },

  async loginUser(user) {
    clientSocket.emit('login', user.mail, user.password);
    /* return chai.request(userService)
      .post('/login')
      .send({ mail: user.mail, password: user.password }); */
  },

  async updateUserProfile(mail, user) {
    /* return chai.request(userService)
      .put('/profile/updateProfile')
      .send({ mail, params: user }); */
  },

  async refreshTokenUser(mail, token) {
    /* return chai.request(userService)
      .get('/refresh_token')
      .query({ mail, token }); */
  },

  async verifyTokenUser(token) {
    /* return chai.request(userService)
      .get('/authenticate')
      .set({ authorization: `Bearer ${token}` }); */
  },

  async getLeaderboard() {
    /* return chai.request(userService)
      .get('/getLeaderboard'); */
  },

  async getProfile(mail) {
    /* return chai.request(userService)
      .get('/profile/getProfile')
      .query({ mail }); */
  },

  async getHistory(mail) {
    /* return chai.request(userService)
      .get('/profile/getHistory')
      .query({ mail }); */
  },
};
module.exports = api;
