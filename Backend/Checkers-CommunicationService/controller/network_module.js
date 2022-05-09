const { default: axios } = require('axios');
const https = require('https');

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
        response = await axios.get(url, { params, httpsAgent }, { httpsAgent });
        break;
      case 'post':
        response = await axios.post(url, params, { httpsAgent });
        break;
      case 'put':
        response = await axios.put(url, params, { httpsAgent });
        break;
      case 'delete':
        response = await axios.delete(url, { data: params }, { httpsAgent });
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