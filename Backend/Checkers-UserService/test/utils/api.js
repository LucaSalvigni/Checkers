// const chai = require('chai');
// const chaiHttp = require('chai-http');
const { default: axios } = require('axios');
const axiosRetry = require('axios-retry');
const https = require('https');
require('../../index');

// Require the dev-dependencies
/* chai.use(chaiHttp);
chai.should(); */
const key = process.env.USER_KEY;
const cert = process.env.USER_CERT;

let userToken = '';

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (e) => e.response.status === 401,
});

const httpsAgent = new https.Agent({
  cert,
  key,
  rejectUnauthorized: false,
});

const api = {

  getToken() {
    return userToken;
  },

  setToken(value) {
    userToken = value;
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
    let response = null;
    try {
      response = await axios.post('https://:3031/access/signup', user, { httpsAgent });
      return {
        status: response.status,
        response: response.data,
      };
    } catch (err) {
      return {
        status: err.response.status,
        response: err.response.data,
      };
    }
    /* return chai.request(userService)
      .post('/signup')
      .send(user); */
  },

  async loginUser(user) {
    let response = null;
    try {
      response = await axios.post('https://:3031/access/login', { mail: user.mail, password: user.password }, { httpsAgent });
      return {
        status: response.status,
        response: response.data,
      };
    } catch (err) {
      return {
        status: err.response.status,
        response: err.response.data,
      };
    }
    /* return chai.request(userService)
      .post('/login')
      .send({ mail: user.mail, password: user.password }); */
  },

  async updateUserProfile(mail, user) {
    let response = null;
    try {
      response = await axios.put('https://:3031/profile/updateProfile', { mail, params: user }, { httpsAgent });
      return {
        status: response.status,
        response: response.data,
      };
    } catch (err) {
      return {
        status: err.response.status,
        response: err.response.data,
      };
    }
    /* return chai.request(userService)
      .put('/profile/updateProfile')
      .send({ mail, params: user }); */
  },

  async updateUserPoints(params) {
    let response = null;
    try {
      response = await axios.put('https://:3031/profile/updatePoints', params, { httpsAgent });
      return {
        status: response.status,
        response: response.data,
      };
    } catch (err) {
      return {
        status: err.response.status,
        response: err.response.data,
      };
    }
    /* return chai.request(userService)
      .put('/profile/updateProfile')
      .send({ mail, params: user }); */
  },

  async refreshTokenUser(mail, token) {
    let response = null;
    try {
      response = await axios.get('https://:3031/access/refresh_token', { params: { mail, token }, httpsAgent }, { httpsAgent });
      return {
        status: response.status,
        response: response.data,
      };
    } catch (err) {
      return {
        status: err.response.status,
        response: err.response.data,
      };
    }
    /* return chai.request(userService)
      .get('/refresh_token')
      .query({ mail, token }); */
  },

  async verifyTokenUser(token) {
    let response = null;
    try {
      response = await axios.get('https://:3031/access/authenticate', { headers: { authorization: `Bearer ${token}` }, httpsAgent }, { httpsAgent });
      return {
        status: response.status,
        response: response.data,
      };
    } catch (err) {
      return {
        status: err.response.status,
        response: err.response.data,
      };
    }
    /* return chai.request(userService)
      .get('/authenticate')
      .set({ authorization: `Bearer ${token}` }); */
  },

  async getLeaderboard() {
    let response = null;
    try {
      response = await axios.get('https://:3031/users/getLeaderboard', { httpsAgent }, { httpsAgent });
      return {
        status: response.status,
        response: response.data,
      };
    } catch (err) {
      return {
        status: err.response.status,
        response: err.response.data,
      };
    }
    /* return chai.request(userService)
      .get('/getLeaderboard'); */
  },

  async getProfile(mail) {
    let response = null;
    try {
      response = await axios.get('https://:3031/profile/getProfile', { params: { mail }, httpsAgent }, { httpsAgent });
      return {
        status: response.status,
        response: response.data,
      };
    } catch (err) {
      return {
        status: err.response.status,
        response: err.response.data,
      };
    }
    /* return chai.request(userService)
      .get('/profile/getProfile')
      .query({ mail }); */
  },

  async getHistory(mail) {
    let response = null;
    try {
      response = await axios.get('https://:3031/profile/getHistory', { params: { mail }, httpsAgent }, { httpsAgent });
      return {
        status: response.status,
        response: response.data,
      };
    } catch (err) {
      return {
        status: err.response.status,
        response: err.response.data,
      };
    }
    /* return chai.request(userService)
      .get('/profile/getHistory')
      .query({ mail }); */
  },
};
module.exports = api;
