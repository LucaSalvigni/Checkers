const { assert } = require('chai');
const api = require('./utils/api');

describe('Communication Service Tests', async () => {
  it('login should work', (done) => {
    api.loginUser({ mail: 'userok@testusers.com', password: 'ciao' });
    api.getClient().on('login_error', (arg) => {
      console.log(arg);
      assert.equal(arg.message.message, 'Authentication failed, wrong email and/or password')
      done();
    })
    /* api.clientSocket.on('login', async (arg) => {
        //console.log(arg);
        done();
    })
    done(); */
    // serverSocket.emit("hello", "world");
  });

  /* it("should work (with ack)", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      assert.equal(arg, "hola");
      done();
    });
  }); */
});
