/* eslint-disable no-unused-expressions */

// Require dependencies
const mongoose = require('mongoose');
const { expect } = require('chai');
const {
  axiosPostRequest, axiosPutRequest, axiosDeleteRequest, axiosGetRequest,
} = require('./utils/axiosRequests');
const gameModel = require('../models/gameModel');
const Draughts = require('../controllers/draughts');

let testGame;
const randomID = new mongoose.Types.ObjectId();
const randomUser = 'pythondevsarentrealdevs@boom.yeet';
const player = 'ciao@ciao.com';
const opponent = 'ciao2@ciao.com';

async function createGame(game) {
  return axiosPostRequest('/lobbies/createGame', { hostId: game.hostId, opponent: game.opponentId });
}

async function leaveGame(gameToQuit) {
  return axiosDeleteRequest('/game/leaveGame', { gameId: gameToQuit.gameId, playerId: gameToQuit.playerId });
}

async function tieGame(gameToTie) {
  return axiosPutRequest('/game/tieGame', { gameId: gameToTie });
}

async function movePiece(gameMove) {
  return axiosPutRequest('/game/movePiece', { gameId: gameMove.gameId, from: gameMove.from, to: gameMove.to });
}

async function changeTurn(gameId) {
  return axiosPutRequest('/game/turnChange', { gameId });
}

async function getGames(user) {
  return axiosGetRequest('/lobbies/getGamesByUser', { user });
}

// Util functions

async function resetGame(gameId) {
  const newGame = new Draughts();

  await gameModel.findByIdAndUpdate(gameId, {
    finished: false,
    fen: newGame.fen(),
    turn: newGame.turn,
  });
}

async function updateGameFEN(gameId, fen) {
  await gameModel.findByIdAndUpdate(gameId, {
    fen,
  });
}

// Game testing

describe('Game', async () => {
  // Clear the DB
  after(async () => {
    if (typeof testGame !== 'undefined') {
      console.log(`Deleting game ${testGame._id}`);
      await gameModel.findByIdAndDelete(testGame._id);
    }
  });

  describe('Game Creation', async () => {
    it('should throw error', async () => {
      let newGame = {
      };
      newGame = await createGame(newGame);
      expect(newGame.status).to.equal(500);
    });

    it('should create a new game', async () => {
      let newGame = {
        hostId: player,
        opponentId: opponent,
      };
      newGame = await createGame(newGame);
      expect(newGame.status).to.equal(200);
      testGame = newGame.response.game;
    });
  });

  describe('GET Games', async () => {
    it('should not find any game', async () => {
      const games = await getGames(randomUser);
      expect(games.status).to.equal(400);
    });

    it('should return 400 bad request', async () => {
      const games = await getGames();
      expect(games.status).to.equal(400);
    });

    it('should retrieve a game', async () => {
      const games = await getGames(player);
      expect(games.status).to.equal(200);
      expect(games.response.length).to.be.gte(1);
    });
  });

  describe('Piece Movement', async () => {
    before(async () => {
      await resetGame(testGame._id);
    });

    it('should move a piece from player2', async () => {
      const gameMove = {
        gameId: testGame._id,
        from: 31,
        to: 26,
      };
      const afterMove = await movePiece(gameMove);
      expect(afterMove.status).to.equal(200);
    });

    // Player2 just moved a piece, trying to move a piece from the same player as before
    it('should fail to move another piece from player2', async () => {
      const wrongMove = {
        gameId: testGame._id,
        from: 33,
        to: 29,
      };
      const afterMove = await movePiece(wrongMove);
      expect(afterMove.status).to.equal(400);
    });

    // Moving a piece from player1
    it('should move a piece from player1', async () => {
      const gameMove = {
        gameId: testGame._id,
        from: 20,
        to: 25,
      };
      const afterMove = await movePiece(gameMove);
      expect(afterMove.status).to.equal(200);
    });

    it('should not change turn', async () => {
      const turnChanged = await changeTurn(randomID);
      expect(turnChanged.status).to.equal(400);
    });

    // Should be player1 turn now, chaning turn to make player2's turn again
    it('should change turn', async () => {
      const turnChanged = await changeTurn(testGame._id);
      expect(turnChanged.status).to.equal(200);
    });

    it('should not find the game', async () => {
      const gameMove = {
        gameId: randomID,
      };
      const afterMove = await movePiece(gameMove);
      expect(afterMove.status).to.equal(400);
    });

    it('should throw error', async () => {
      const gameMove = {
        gameId: 'oogabooga',
      };
      const afterMove = await movePiece(gameMove);
      expect(afterMove.status).to.equal(500);
    });

    // By changing turns, it's again player2' turn
    it('should move piece from player2', async () => {
      const gameMove = {
        gameId: testGame._id,
        from: 19,
        to: 24,
      };
      const afterMove = await movePiece(gameMove);
      expect(afterMove.status).to.equal(200);
    });
  });

  describe('Tie game route', async () => {
    beforeEach(async () => {
      console.log('Resetting board...');
      await resetGame(testGame._id);
    });

    it('should throw error', async () => {
      const afterMove = await tieGame('oogabooga');
      expect(afterMove.status).to.equal(500);
    });

    it('should fail to tie the game', async () => {
      const afterMove = await tieGame(randomID);
      expect(afterMove.status).to.equal(400);
    });

    it('should tie the game', async () => {
      const afterMove = await tieGame(testGame._id);
      expect(afterMove.status).to.equal(200);
    });
  });

  describe('Game ending', async () => {
    beforeEach(async () => {
      console.log('Resetting board...');
      await resetGame(testGame._id);
    });

    // White has only one piece, when it gets eaten the game should end
    it('should end the game with player1 Winner', async () => {
      const almostGameOverFEN = 'W:W31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50:B30.';
      await updateGameFEN(testGame._id, almostGameOverFEN);

      const gameMove = {
        gameId: testGame._id,
        from: 35,
        to: 24,
      };
      const afterMove = await movePiece(gameMove);
      expect(afterMove.status).to.equal(200);
      expect(afterMove.response.ended).to.be.true;
      expect(afterMove.response.winner).to.equal(player);
    });

    it('should end the game with player2 Winner', async () => {
      const almostGameOverFEN = 'B:W21:B1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20.';
      await updateGameFEN(testGame._id, almostGameOverFEN);

      const gameMove = {
        gameId: testGame._id,
        from: 16,
        to: 27,
      };
      const afterMove = await movePiece(gameMove);
      expect(afterMove.status).to.equal(200);
      expect(afterMove.response.ended).to.be.true;
      expect(afterMove.response.winner).to.equal(opponent);
    });

    it('should end in a tie', async () => {
      const almostGameOverFEN = 'W:W21,22,23,24,25,26,27,28,30,34:B11,12,13,14,15,16,17,18,19,20.';
      await updateGameFEN(testGame._id, almostGameOverFEN);

      const gameMove = {
        gameId: testGame._id,
        from: 34,
        to: 29,
      };
      const afterMove = await movePiece(gameMove);
      expect(afterMove.status).to.equal(200);
      expect(afterMove.response.ended).to.be.true;
      expect(afterMove.response.winner).to.equal('');
    });
  });

  describe('Players Leaving', async () => {
    beforeEach(async () => {
      console.log('Resetting board...');
      await resetGame(testGame._id);
    });

    it('should fail to terminate a game', async () => {
      const gameToQuit = {
        gameId: testGame._id,
        playerId: 'FakeLikePythonDevs',
      };
      const playerLeft = await leaveGame(gameToQuit);
      expect(playerLeft.status).to.equal(400);
    });

    it('should fail to find the game', async () => {
      const gameToQuit = {
        gameId: randomID.toString(),
        playerId: player,
      };
      const playerLeft = await leaveGame(gameToQuit);
      expect(playerLeft.status).to.equal(400);
    });

    it('should throw error', async () => {
      const gameToQuit = {
        gameId: 'oogabooga',
        playerId: player,
      };
      const playerLeft = await leaveGame(gameToQuit);
      expect(playerLeft.status).to.equal(500);
    });

    it('should make host leave current game', async () => {
      const gameToQuit = {
        gameId: testGame._id,
        playerId: player,
      };
      const playerLeft = await leaveGame(gameToQuit);
      expect(playerLeft.status).to.equal(200);
    });

    it('should make player2 leave current game', async () => {
      const gameToQuit = {
        gameId: testGame._id,
        playerId: opponent,
      };
      const playerLeft = await leaveGame(gameToQuit);
      expect(playerLeft.status).to.equal(200);
    });
  });
});
