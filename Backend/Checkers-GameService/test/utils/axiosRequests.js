const { default: axios } = require('axios');
const https = require('https');
const fs = require('fs');
require('../../index');

const { PORT } = process.env;
let key = null;
let cert = null;

if (fs.existsSync('./cert/game_key.pem')) {
  key = fs.readFileSync('./cert/game_key.pem');
}
if (fs.existsSync('./cert/game_cert.pem')) {
  cert = fs.readFileSync('./cert/game_cert.pem');
}

const httpsAgent = new https.Agent({
  cert,
  key,
  rejectUnauthorized: false,
});

exports.axiosPostRequest = async function axiosPostRequest(route, params) {
  let response = null;
  try {
    response = await axios.post(`https://:${PORT}${route}`, params, { httpsAgent });
    return {
      status: response.status,
      response: response.data,
    };
  } catch (err) {
    if(err.response === undefined) {
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
    if(err.response === undefined) {
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
    response = await axios.delete(`https://:${PORT}${route}`, params, { httpsAgent });
    return {
      status: response.status,
      response: response.data,
    };
  } catch (err) {
    if(err.response === undefined) {
        console.log(err);
        return err.code;
    }
    return {
      status: err.response.status,
    };
  }
};