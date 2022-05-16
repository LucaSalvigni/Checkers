const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Get Lobbies Tests', async () => {
  before((done) => {
    api.loginUser(api.getClient2(), { mail: 'test2@test2.com', password: 'TestonE97?' });
    api.getClient2().on('login_ok', (arg) => {
      api.setToken2(arg.token);
      assert.equal(arg.message, 'Authentication successfull, welcome back Tordent97!');
      done();
    });
  });
  it('get lobbies should work', (done) => {
    api.getLobbies(api.getClient2(), '500', api.getToken2());
    api.getClient2().on('lobbies', (arg) => {
      console.log(arg);
      done();
    });
  });
});
