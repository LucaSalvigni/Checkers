const { default: axios } = require('axios');
const axiosRetry = require('axios-retry');
const https = require('https');
require('../../index');

const PORT = process.env.GameService_PORT;
const { GAME_KEY } = process.env;
const { GAME_CERT } = process.env;

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (e) => e.response.status === 401,
});

const httpsAgent = new https.Agent({
  GAME_CERT,
  GAME_KEY,
  rejectUnauthorized: false,
});

exports.axiosGetRequest = async function axiosGetRequest(route, params) {
  let response = null;
  try {
    response = await axios.get(`https://:${PORT}${route}`, { params, httpsAgent }, { httpsAgent });
    return {
      status: response.status,
      response: response.data,
    };
  } catch (err) {
    if (err.response === undefined) {
      console.log(err.code);
      return err.code;
    }
    return {
      status: err.response.status,
    };
  }
};

exports.axiosPostRequest = async function axiosPostRequest(route, params) {
  let response = null;
  try {
    response = await axios.post(`https://:${PORT}${route}`, params, { httpsAgent });
    return {
      status: response.status,
      response: response.data,
    };
  } catch (err) {
    if (err.response === undefined) {
      console.log(err.code);
      return err.code;
    }
    return {
      status: err.response.status,
    };
  }
};

exports.axiosPutRequest = async function axiosPutRequest(route, params) {
  let response = null;
  try {
    response = await axios.put(`https://:${PORT}${route}`, params, { httpsAgent });
    return {
      status: response.status,
      response: response.data,
    };
  } catch (err) {
    if (err.response === undefined) {
      console.log(err.code);
      return err.code;
    }
    return {
      status: err.response.status,
    };
  }
};

exports.axiosDeleteRequest = async function axiosDeleteRequest(route, params) {
  let response = null;
  try {
    response = await axios.delete(`https://:${PORT}${route}`, { params, httpsAgent }, { httpsAgent });
    return {
      status: response.status,
      response: response.data,
    };
  } catch (err) {
    if (err.response === undefined) {
      console.log(err.code);
      return err.code;
    }
    return {
      status: err.response.status,
    };
  }
};
