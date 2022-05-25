const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service invite Opponent Tests', async () => {
  it('invite opponent should give an error', (done) => {
    api.inviteOpponent(api.getClient(), api.getToken(), 'banana@ban.com');
    api.getClient().off('invite_error');

    api.getClient().on('invite_error', (arg) => {
      assert.equal(arg.message, "Can't invite player banana@ban.com");
      done();
    });
  });

  it('invite opponent should work', (done) => {
    api.inviteOpponent(api.getClient(), api.getToken(), 'test2@test2.com');
    api.getClient2().off('lobby_invitation');
    api.getClient().off('invitation_timeout');
    api.getClient().off('invite_error');

    api.getClient2().on('lobby_invitation', (arg) => {
      assert.equal(arg, 'newtest@newtest.com');
      done();
    });

    api.getClient().on('invitation_timeout', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().on('invite_error', (arg) => {
      assert.equal(arg.message, "Can't invite player test2@test2.com");
      done();
    });
  });

  it('accept invite should fail for token', (done) => {
    api.acceptInvite(api.getClient2(), '', 'newtest@newtest.com');
    api.getClient2().off('token_error');
    api.getClient2().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
  });

  it('accept invite should fail for wrong mail invite', (done) => {
    api.acceptInvite(api.getClient2(), api.getToken2(), 'c@c.com');
    api.getClient2().off('invitation_expired');
    api.getClient2().on('invitation_expired', (arg) => {
      assert.equal(arg.message, 'Your invitation for this lobby has expired');
      done();
    });
  });

  it('decline invite should fail for token', (done) => {
    api.declineInvite(api.getClient2(), '', 'newtest@newtest.com');
    api.getClient2().off('token_error');
    api.getClient2().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
  });

  it('decline invite should fail for wrong mail invite', (done) => {
    api.declineInvite(api.getClient2(), api.getToken2(), 'c@c.com');
    api.getClient2().off('invitation_expired');
    api.getClient2().on('invitation_expired', (arg) => {
      assert.equal(arg.message, 'Your invitation for this lobby has expired');
      done();
    });
  });

  it('decline invite should work', (done) => {
    api.inviteOpponent(api.getClient(), api.getToken(), 'test2@test2.com');
    api.getClient2().off('lobby_invitation');
    api.getClient().off('invitation_timeout');
    api.getClient().off('invite_error');
    api.getClient().off('invitation_declined');
    api.getClient().off('token_error');

    api.getClient2().on('lobby_invitation', (arg) => {
      assert.equal(arg, 'newtest@newtest.com');
      api.declineInvite(api.getClient2(), api.getToken2(), 'newtest@newtest.com');
    });
    api.getClient().on('invitation_timeout', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().on('invite_error', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().on('invitation_declined', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
  });

  it('accept invite should work', (done) => {
    api.inviteOpponent(api.getClient(), api.getToken(), 'test2@test2.com');
    api.getClient2().off('lobby_invitation');
    api.getClient().off('invitation_timeout');
    api.getClient().off('invite_error');
    api.getClient().off('game_started');
    api.getClient2().off('game_started');
    api.getClient().off('token_error');
    api.getClient().off('server_error');

    api.getClient2().on('lobby_invitation', (arg) => {
      assert.equal(arg, 'newtest@newtest.com');
      api.acceptInvite(api.getClient2(), api.getToken2(), 'newtest@newtest.com');
    });
    api.getClient().on('invitation_timeout', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().on('invite_error', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().on('game_started', (arg) => {
      console.log(arg);
      api.setLobbyId(arg[3]);
      done();
    });
    api.getClient().on('server_error', (arg) => {
      assert.equal(arg.message, 'Something went wrong while setting up your game!');
      done();
    });
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
  });
});
