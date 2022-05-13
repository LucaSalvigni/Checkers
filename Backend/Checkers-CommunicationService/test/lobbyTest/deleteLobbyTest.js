const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Delete Specific Lobby Test', async () => {
  it('delete lobby should work', (done) => {
    api.deleteLobby(api.getClient(), api.getLobbyId(), api.getToken());
    api.getClient().on('lobby_deleted', (arg) => {
      console.log(arg);
      assert.equal(arg.message, 'Your lobby has been successfully deleted');
      done();
    });
  });
});
