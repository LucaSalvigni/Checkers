// const chai = require('chai');
// const chaiHttp = require('chai-http');
const fs = require('fs');
const { default: axios } = require('axios');
const https = require('https');
require('../../index');

// Require the dev-dependencies
/* chai.use(chaiHttp);
chai.should(); */
let key = null;
let cert = null;
if (fs.existsSync('./cert/user_key.pem')) {
  console.log("Ciao")
  key = fs.readFileSync('./cert/user_key.pem');
}
if (fs.existsSync('./cert/user_cert.pem')) {
  console.log("Ciao")
  cert = fs.readFileSync('./cert/user_cert.pem');
}
console.log(key)
console.log(cert)
const httpsAgent = new https.Agent({
  cert,
  key,
  rejectUnauthorized: false,
});

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
    let response = null;
    try {
      response = await axios.post('https://:3031/signup', user, { httpsAgent });
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
      response = await axios.post('https://:3031/login', { mail: user.mail, password: user.password }, { httpsAgent });
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

  async refreshTokenUser(mail, token) {
    let response = null;
    try {
      response = await axios.get('https://:3031/refresh_token', { mail, token, httpsAgent }, { httpsAgent });
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
      response = await axios.get('https://:3031/authenticate', { authorization: `Bearer ${token}`, httpsAgent }, { httpsAgent });
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
      response = await axios.get('https://:3031/getLeaderboard', { httpsAgent }, { httpsAgent });
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
      response = await axios.get('https://:3031/profile/getProfile', { mail, httpsAgent }, { httpsAgent });
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
      response = await axios.get('https://:3031/profile/getHistory', { mail, httpsAgent }, { httpsAgent });
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
