const express = require('express');

const router = express.Router();
const gameController = require('../controllers/gameController');

router
  // Certificate verification
  .all('*', (req, res, next) => {
    const cert = req.socket.getPeerCertificate();
    if (req.client.authorized) {
      next();
    } else if (cert.subject) {
      res.status(403)
        .send(`Sorry ${cert.subject.CN}, can't accept certificates from ${cert.issuer.CN}.`);
    } else {
      res.status(401)
        .send('Sorry, need to provide a valid certificate.');
    }
  })
  .post('/game/lobbies/createGame', gameController.createGame)
  .put('/game/tieGame', gameController.tieGame)
  .delete('/game/leaveGame', gameController.leaveGame)
  .put('/game/movePiece', gameController.movePiece)
  .put('/game/turnChange', gameController.turnChange);

module.exports = router;
