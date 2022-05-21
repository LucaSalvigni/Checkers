const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service invite Opponent Tests', async () => {
  it('invite opponent should work', (done) => {
    api.inviteOpponent(api.getClient(), api.getToken(), 'test2@test2.com');
    api.getClient2().off('lobby_invitation');
    api.getClient2().on('lobby_invitation', (arg) => {
      assert.equal(arg, 'newtest@newtest.com');
      done();
    });
    api.getClient().off('invitation_timeout');
    api.getClient().on('invitation_timeout', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().off('invite_error');
    api.getClient().on('invite_error', (arg) => {
      console.log(arg);
      done();
    });
  });
  it('invite opponent should give an error', (done) => {
    api.inviteOpponent(api.getClient(), api.getToken(), 'banana@ban.com');
    api.getClient().off('invite_error');
    api.getClient().on('invite_error', (arg) => {
      assert.equal(arg.message, "Can't invite player banana@ban.com");
      done();
    });
  });
  it('decline invite should work', (done) => {
    api.inviteOpponent(api.getClient(), api.getToken(), 'test2@test2.com');
    api.getClient2().off('lobby_invitation');
    api.getClient2().on('lobby_invitation', (arg) => {
      assert.equal(arg, 'newtest@newtest.com');
      api.declineInvite(api.getClient2(), api.getToken2(), 'newtest@newtest.com');
    });
    api.getClient().off('invitation_timeout');
    api.getClient().on('invitation_timeout', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().off('invite_error');
    api.getClient().on('invite_error', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().on('invitation_declined', (arg) => {
      console.log(arg);
      done();
    });
  });
  it('accept invite should work', (done) => {
    api.inviteOpponent(api.getClient(), api.getToken(), 'test2@test2.com');
    api.getClient2().off('lobby_invitation');
    api.getClient2().on('lobby_invitation', (arg) => {
      assert.equal(arg, 'newtest@newtest.com');
      api.acceptInvite(api.getClient2(), api.getToken2(), 'newtest@newtest.com');
    });
    api.getClient().off('invitation_timeout');
    api.getClient().on('invitation_timeout', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().off('invite_error');
    api.getClient().on('invite_error', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().off('game_started');
    api.getClient2().off('game_started');
    api.getClient().on('game_started', (arg) => {
      console.log(arg);
      api.setLobbyId(arg[3]);
      done();
    });
  });
});
