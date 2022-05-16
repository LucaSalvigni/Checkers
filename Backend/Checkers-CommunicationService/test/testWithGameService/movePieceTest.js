const api = require('../utils/api');

describe('Communication Service Move Piece Tests', async () => {
  it('move piece should work', (done) => {
    api.movePiece(api.getClient(), api.getLobbyId(), 31, 26, api.getToken());
    api.getClient().on('update_board', (arg) => {
      console.log(arg);
      done();
    });
  });
});
