const api = require('../utils/api');

describe('Communication Service Move Piece Tests', async () => {
  it('move piece should work', (done) => {
    api.movePiece(api.getClient(), api.getLobbyId(), 31, 26, api.getToken());
    api.getClient().off('update_board');
    api.getClient().on('update_board', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().off('server_error');
    api.getClient().on('server_error', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().off('token_error');
    api.getClient().on('token_error', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().off('client_error');
    api.getClient().on('client_error', (arg) => {
      console.log(arg);
      done();
    });
  });
});
