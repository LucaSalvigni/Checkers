const { default: axios } = require('axios');
const axiosRetry = require('axios-retry');
const https = require('https');

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (e) => e.response.status === 401,
});

let httpsAgent = new https.Agent({});

async function setupHTTPSAgent(cert, key) {
  httpsAgent = new https.Agent({
    cert,
    key,
    rejectUnauthorized: false,
  });
}

/**
 *
 * @param err  error to be examined
 * @returns true if err is some form of HTTP error, false otherwise
 */
function requestError(err) {
  return 'response' in err
            && err.response !== undefined
             && 'status' in err.response
             && err.response.status !== undefined;
}

/**
     * Function used to make request to other services
     *
     * @param {*} method HTTP method to use
     * @param {*} url service's url
     * @param {*} params request's params
     * @returns  response
     */
async function askService(method, url, params) {
  let response = '';
  const defaultErrorMsg = {
    status: false,
    response_status: '405',
    response_data: 'Wrong HTTPS method call',
  };
  try {
    switch (method) {
      case 'get':
        if (url.includes('authenticate')) {
          // eslint-disable-next-line max-len
          response = await axios.get(url, { headers: { authorization: params.headers.Authorization }, httpsAgent }, { httpsAgent });
        } else {
          response = await axios.get(url, { params, httpsAgent }, { httpsAgent });
        }
        break;
      case 'post':
        response = await axios.post(url, params, { httpsAgent });
        break;
      case 'put':
        response = await axios.put(url, params, { httpsAgent });
        break;
      case 'delete':
        response = await axios.delete(url, { params, httpsAgent }, { httpsAgent });
        break;
      default:
        return defaultErrorMsg;
    }
    return {
      status: true,
      response: response.data,
    };
  } catch (err) {
    // console.log(err);
    if (requestError(err)) {
      return {
        status: false,
        response_status: err.response.status,
        response_data: err.response.data,
      };
    }
    return defaultErrorMsg;
  }
}

module.exports = { askService, setupHTTPSAgent };
