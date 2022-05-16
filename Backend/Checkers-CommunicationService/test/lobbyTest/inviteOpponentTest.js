const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service invite Opponent Tests', async () => {
  it('invite opponent should work', (done) => {
    api.inviteOpponent(api.getClient(), api.getToken(), 'test2@test2.com');
    api.getClient2().on('lobby_invitation', (arg) => {
      assert.equal(arg, 'newtest@newtest.com');
      done();
    });
  });
});
