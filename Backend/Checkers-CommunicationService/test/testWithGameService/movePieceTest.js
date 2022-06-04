const { assert } = require('chai');
const api = require('../utils/api');

describe('Communication Service Move Piece Tests', async () => {
  it('move piece should fail for token', (done) => {
    api.movePiece(api.getClient(), api.getLobbyId(), 31, 26, '');
    api.getClient().off('token_error');
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
  });

  it('move piece should fail for wrong lobbyId', (done) => {
    api.movePiece(api.getClient(), 1, 31, 26, api.getToken());
    api.getClient().off('client_error');
    api.getClient().on('client_error', (arg) => {
      assert.equal(arg.message, "I don't know who you are or the lobby you're referring to");
      done();
    });
  });

  it('move piece should fail for wrong player turn', (done) => {
    api.movePiece(api.getClient2(), api.getLobbyId(), 31, 26, api.getToken2());
    api.getClient2().off('client_error');
    api.getClient2().on('client_error', (arg) => {
      assert.equal(arg.message, "It's not your turn or you're not in this lobby, you tell me");
      done();
    });
  });

  it('move piece should fail for wrong pieces from to', (done) => {
    api.movePiece(api.getClient(), api.getLobbyId(), 4, 5, api.getToken());
    api.getClient().off('client_error');
    api.getClient().on('client_error', (arg) => {
      assert.equal(arg.message, 'Error while making such move, you can try again or select a different move.');
      done();
    });
  });

  it('move piece should work', (done) => {
    api.movePiece(api.getClient(), api.getLobbyId(), 31, 26, api.getToken());
    api.getClient().off('update_board');
    api.getClient().off('server_error');
    api.getClient().off('token_error');
    api.getClient().off('client_error');

    api.getClient().on('update_board', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().on('server_error', (arg) => {
      if (arg.message.includes('move')) {
        assert.equal(arg.message, 'Something went wrong while making your move, please try again');
      } else if (arg.message.includes('updating')) {
        assert.equal(arg.message, 'Something wrong while updating points.');
      } else {
        assert.equal(arg.message, 'Something went wrong while processing your game');
      }
      done();
    });
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'User not authenticated');
      done();
    });
    api.getClient().on('client_error', (arg) => {
      if (arg.message.includes('turn')) {
        assert.equal(arg.message, "It's not your turn or you're not in this lobby, you tell me");
      } else if (arg.message.includes('referring')) {
        assert.equal(arg.message, "I don't know who you are or the lobby you're referring to");
      } else {
        console.log(arg);
      }
      done();
    });
  });
});
