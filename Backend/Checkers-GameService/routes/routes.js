const express = require('express');

const router = express.Router();
const gameController = require('../controllers/gameController');

router
  .post('/game/lobbies/create_game', gameController.create_game)
  .put('/game/tieGame', gameController.tieGame)
  .delete('/game/leaveGame', gameController.leaveGame);

module.exports = router;
