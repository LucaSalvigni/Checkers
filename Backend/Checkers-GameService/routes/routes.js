const express = require('express');

const router = express.Router();
const gameController = require('../controllers/gameController');

router
  .post('/game/lobbies/createGame', gameController.createGame)
  .put('/game/tieGame', gameController.tieGame)
  .delete('/game/leaveGame', gameController.leaveGame)
  .put('/game/movePiece', gameController.movePiece)
  .put('/game/turnChange', gameController.turnChange);

module.exports = router;
