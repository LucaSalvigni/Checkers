const { default: axios } = require('axios');
const https = require("https")

let https_agent = new https.Agent({})


async function setup_https_agent(cert,key) {
    https_agent = new https.Agent({
        cert: cert,
        key: key,
        rejectUnauthorized: false
    })
}

/**
 * 
 * @param err  error to be examined
 * @returns true if err is some form of HTTP error, false otherwise
 */
 function request_error(err){
    return 'response' in err &&
            err.response != undefined &&
             'status' in err.response
             && err.response.status != undefined
  }
  
    /**
     * Function used to make request to other services
     * 
     * @param {*} method HTTP method to use
     * @param {*} url service's url
     * @param {*} params request's params 
     * @returns  response
     */
  async function ask_service(method,url,params){
    let response = ""
    const default_error_msg = {
      status:false,
      response_status:"405",
      response_data:"Wrong HTTPS method call"
    }
    try{
      switch(method){
        case "get":
          response = await axios.get(url, {params: params,httpsAgent:socket_agent},{httpsAgent:socket_agent})
          break
        case "post":
          response = await axios.post(url,params,{httpsAgent:socket_agent})
          break
        case "put":
          response = await axios.put(url,params,{httpsAgent:socket_agent})
          break
        case "delete":
          response = await axios.delete(url,{data:params},{httpsAgent:socket_agent})
          break
        default:
          return default_error_msg
      }
      return {
        status:true,
        response:response.data
      }
    }catch(err){
      console.log(err)
      return request_error(err) ? {status:false, response_status:err.response.status, response_data : err.response.data} : default_error_msg
    }
  }
 

module.exports =  {ask_service,setup_https_agent}