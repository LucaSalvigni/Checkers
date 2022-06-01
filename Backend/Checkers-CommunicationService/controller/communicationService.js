const BiMap = require('bidirectional-map');
const socket = require('socket.io');
const mongoose = require('mongoose');
const network = require('./network_module');
const Lobby = require('../models/lobby');

require('dotenv').config();

const onlineUsers = new BiMap(); // {  client_id <-> user_id  }
const lobbies = new BiMap(); // { lobbyId -> Lobby }
const turnTimeouts = new Map(); // {lobbyId -> timoutTimer}
const invitationTimeouts = new Map(); // {host_id -> {opponent_id -> timeout}}

const gameService = process.env.GAME_SERVICE;
const userService = process.env.USER_SERVICE;
const cert = process.env.COMM_CERT;
const key = process.env.COMM_KEY;

const tieStars = 20;
const winStars = 100;
const lossStars = -70;
const turnTimeout = 120000;
const inviteTimeout = 240000;

// Utils
function log(msg) {
  if (process.env.NODE_ENV === 'development') {
    console.log(msg);
  }
}
/**
 * Generates a random ID
 * @returns a 2 char long random ID
 */
function getId() {
  return new mongoose.Types.ObjectId();
}
/**
 * Checks a user's token validity.
 * @param {token} token
 * @param {*} clientId
 * @returns true if user token is valid, false if not
 */
async function isAuthenticated(token, clientId) {
  try {
    const authenticated = await network.askService(
      'get',
      `${userService}/access/authenticate`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (authenticated.status) {
      onlineUsers.set(clientId, authenticated.response.user.mail);
      return [true, authenticated.response];
    }
    return [false, ''];
  } catch (err) {
    /* istanbul ignore next */
    return [false, err.response.data];
  }
}

/**
 *
 * @param {*} playerMail
 * @returns whether a player is in a lobby or not
 */
function isInLobby(playerMail) {
  return Array.from(lobbies.values()).filter((lobby) => lobby.hasPlayer(playerMail)).length;
}

/**
 *
 * @param {*} roomName  lobby name
 * @param {*} client  client socket
 * @param {*} maxStars Max number of stars a client can have in order to join this lobby.
 * @returns ID of just created lobby
 */
function buildLobby(roomName, client, maxStars) {
  const newRoomId = getId();
  lobbies.set(newRoomId.toString(), new Lobby(maxStars, roomName, onlineUsers.get(client.id)));
  client.join(newRoomId.toString());
  return newRoomId.toString();
}

/**
 * Returns a user's username from his mail
 * @param {*} mail user email
 * @returns user username
 */
async function getUsername(mail) {
  const profile = await network.askService('get', `${userService}/profile/getProfile`, { mail });
  /* istanbul ignore next */
  if (profile.status) {
    return profile.response.username;
  }
  return 'Deleted user';
}

/**
 * Returns active lobbies in which a user can join in
 * @param {*} userStars of the user who's searching lobbies
 * @returns list of lobbies
 */

// TODO: CHECK THIS
async function getLobbies(userStars) {
  const data = [];
  const validLobbies = Array.from(lobbies.entries())
    .filter(([, lobby]) => lobby.isFree() && (lobby.getStars() >= userStars));
  for (const i in validLobbies) {
    const lobby = validLobbies[i];
    const username = await getUsername(lobby[1].getPlayers(0));
    /* istanbul ignore next */
    if (username === null) {
      log('something wrong with username');
    } else {
      data.push({
        lobbyId: lobby[0],
        name: lobby[1].getName(),
        max_stars: lobby[1].getStars(),
        host: username,
      });
    }
  }
  return data;
}
/**
*
* @param {*} lobbyId lobby id to join
* @param {*} client client socket
* @param {*} player mail to join lobby
* @returns
*/
function joinLobby(lobbyId, client, player) {
  if (lobbies.has(lobbyId)) {
    const toJoin = lobbies.get(lobbyId);
    if (toJoin.isFree()) {
      client.join(lobbyId);
      return toJoin.addPlayer(player);
    }
    /* istanbul ignore next */
    log('lobby not free');
    /* istanbul ignore next */
    return false;
  }
  /* istanbul ignore next */
  log('No such lobby');
  /* istanbul ignore next */
  return false;
}

/**
 *
 * @param {*} gameId
 * @param {*} hostMail
 * @param {*} opponentMail
 * @returns a new game istance to be sent to client
 */
async function setupGame(gameId, hostMail, opponentMail) {
  // Just a comment
  const game = [];
  const hostSpecs = await network.askService('get', `${userService}/profile/getProfile`, { mail: hostMail });
  const opponentSpecs = await network.askService('get', `${userService}/profile/getProfile`, { mail: opponentMail });
  if (hostSpecs.status && opponentSpecs.status) {
    const board = await network.askService('post', `${gameService}/lobbies/createGame`, { gameId, hostId: hostSpecs.response.mail, opponent: opponentSpecs.response.mail });
    if (board.status) {
      game.push(hostSpecs.response);
      game.push(opponentSpecs.response);
      game.push(board.response);
      game.push(gameId);
    }
  }
  return game;
}

exports.socket = async function (server) {
  const io = socket(server, {
    cors: {
      origin: '*',
    },
  });

  /**
   *
   * @param {*} lobbyId
   * deletes a lobby
   */
  function deleteLobby(lobbyId) {
    lobbies.delete(lobbyId);
    clearTimeout(turnTimeouts.get(lobbyId));
    turnTimeouts.delete(lobbyId);
    // make all sockets in this lobby leave the SocketRoom
    io.sockets.adapter.rooms.get(lobbyId).clear();
  }

  // Setup a turn timeout for a given lobby
  async function setupGameTurnTimeout(lobbyId) {
    /* istanbul ignore next */
    turnTimeouts.set(lobbyId, setTimeout(async () => {
      await changeTurn(lobbyId);
      await network.askService('put', `${gameService}/game/turnChange`, { game_id: lobbyId });
      log(`Turn timeout for game ${lobbyId}`);
    }, turnTimeout));
    log(`Timeout set for game${lobbyId}`);
  }

  /**
   * Change turn for a given lobby
   * @param {*} lobbyId  ID of lobby which turn needs to be changed
   */
  async function changeTurn(lobbyId) {
    log(`Changing turns for game ${lobbyId}`);
    const lobby = lobbies.get(lobbyId);
    const latePlayer = lobby.turn;
    const nextPlayer = lobby.getPlayers().filter((player) => player !== latePlayer)[0];
    lobbies.get(lobbyId).turn = nextPlayer;
    clearTimeout(turnTimeouts.get(lobbyId));
    await setupGameTurnTimeout(lobbyId);
    io.to(lobbyId).emit('turn_change', { next_player: nextPlayer });
  }

  /**
   *
   * @param {*} winner mail of the player who just won a game
   * @param {*} points1 points to update
   * @param {*} loser mail of the player who just lost a game
   * @param {*} points2 points to update
   * @returns Updated version of the two player's profile
   */
  async function updatePoints(winner, points1, loser, points2, tied = false) {
    const updatedOne = await network.askService('put', `${userService}/profile/updatePoints`, {
      mail: winner,
      stars: points1,
      won: true,
      tied,
    });
    const updatedTwo = await network.askService('put', `${userService}/profile/updatePoints`, {
      mail: loser,
      stars: points2,
      won: false,
      tied,
    });
    if (updatedOne.status && updatedTwo.status) {
      return [updatedOne.response, updatedTwo.response];
    }
    /* istanbul ignore next */
    return [];
  }

  /* istanbul ignore next */
  /**
   * Handle disconnections, 3 cases:
   *  - player is not in a lobby
   *  - player is in an empty lobby
   *  - player is in a game
   * @param {*} player mail who just disconnected
   */
  async function handleDisconnection(player) {
    const clientId = onlineUsers.getKey(player);
    // Player isn't in a lobby so just disconnect it
    if (!isInLobby(player)) {
      log(`${player} just disconnected but wasn't in lobby`);
      onlineUsers.delete(clientId);
    } else {
      // player is in a lobby, check if it's empty or he is in a game
      const playerLobby = Array.from(lobbies.values())
        .filter((lobby) => lobby.hasPlayer(player))[0];

      const lobbyId = lobbies.getKey(playerLobby);

      log(`${player} from lobby ${lobbyId} is trying to disconnect`);
      // Lobby is free
      if (playerLobby.isFree()) {
        log(`${onlineUsers.get(clientId)} just disconnected and his lobby has been deleted`);
        lobbies.delete(lobbyId);
        onlineUsers.delete(clientId);
      } else {
        // Lobby is full and a game is on, need to check if he's the host or not
        let winner = '';
        let loser = '';
        if (playerLobby.getPlayers(0) === player) {
          // Player disconnecting is the host
          log(`${player} is disconnecting and is the host of lobby ${lobbyId}, deleting game`);
          winner = playerLobby.getPlayers(1);
          loser = player;
        } else {
          // Player disconnecting is the guest
          log(`${player} is in lobby ${lobbyId} but isn't host, deleting game`);
          winner = player;
          loser = playerLobby.getPlayers(1);
        }
        const gameEnd = await network.askService(
          'post',
          `${gameService}/game/leaveGame`,
          { game_id: lobbyId, winner, forfeiter: loser },
        );
        if (gameEnd.status) {
          io.to(lobbyId).emit('player_left', gameEnd.response);
          /* eslint-disable-next-line max-len */
          const updatedUsers = await updatePoints(winner, winStars, loser, lossStars);
          if (updatedUsers) {
            io.to(onlineUsers.getKey(winner)).emit('user_update', updatedUsers[0]);
            io.to(onlineUsers.getKey(loser)).emit('user_update', updatedUsers[1]);
          } else {
            io.to(lobbyId).emit('server_error', { message: 'Something went wrong while updating points' });
          }
          deleteLobby(lobbyId);
          onlineUsers.delete(clientId);
          // Clear lobby room
          io.in(lobbyId).socketsLeave(lobbyId);
        } else if (gameEnd.response_status === 500) {
          io.to(lobbyId).emit('server_error', { message: gameEnd.response_data });
        }
      }
    }
  }
  // Setup HTTPS agent to communicate with other services.
  network.setupHTTPSAgent(cert, key);

  io.on('connection', async (client) => {
    // A new anon user just connected, push it to online_players
    log('a user connected');
    onlineUsers.set(client.id, getId());

    /* istanbul ignore next */
    client.on('disconnect', async () => {
      // Remove player from active players
      const player = onlineUsers.get(client.id);
      await handleDisconnection(player);
    });

    client.on('login', async (mail, password) => {
      log('a user is tryng to log in');
      // Update user id in onlineUsers
      if (onlineUsers.hasValue(mail)) {
        client.emit('login_error', { message: 'Someone is already logged in with such email' });
      } else {
        const user = await network.askService('post', `${userService}/access/login`, {
          mail,
          password,
        });
        if (user.status) {
          onlineUsers.set(client.id, mail);
          client.emit('login_ok', user.response);
        } else if (user.response_status === 400) {
          client.emit('login_error', { message: user.response_data });
        }
      }
    });

    client.on('logout', async (mail) => {
      log(`loggin out user ${mail}`);
      if (onlineUsers.hasValue(mail)) {
        onlineUsers.deleteValue(mail);
        client.emit('logout_ok');
      } else {
        client.emit('logout_error', { message: 'User not logged in' });
      }
    });

    client.on('signup', async (mail, password, username, firstName, lastName) => {
      log('a user is trying to sign up');
      const newUser = await network.askService('post', `${userService}/access/signup`, {
        firstName,
        lastName,
        mail,
        password,
        username,
      });
      if (newUser.status) {
        client.emit('signup_success', newUser.response);
      } else {
        client.emit('signup_error', { message: newUser.response_data });
      }
    });

    /**
     * Token refreshing procedure
     */
    client.on('refresh_token', async (token) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        const newToken = await network.askService('get', `${userService}/access/refresh_token`, {
          mail: onlineUsers.get(client.id),
          token,
        });
        if (newToken.status) {
          client.emit('token_ok', newToken.response);
        } else if (newToken.response_status === 500) {
          client.emit('token_error', { message: newToken.response_data });
        } else {
          console.log(newToken.response_data);
          client.emit('token_error', { message: 'Your token expired, please log-in again' });
        }
      } else {
        client.emit('client_error', { message: user[1] });
      }
    });
    /**
     *  * * * * * *
     * LOBBY HANDLING
     *  * * * * * *
     * */
    client.on('build_lobby', async (lobbyName, maxStars, token) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        const userMail = onlineUsers.get(client.id);
        if (!isInLobby(userMail)) {
          log(`${userMail} is building a lobby`);
          const newLobbyId = buildLobby(lobbyName, client, maxStars);
          const allLobbies = await getLobbies(0);
          client.emit('lobbies', {
            lobbyId: newLobbyId,
            allLobbies,
          });
        } else {
          log(`${userMail} tried bulding a lobby while already has one`);
          client.emit('client_error', { message: 'Player is either not online or is already in some lobby.' });
        }
      } else {
        log('a user is damn not authenticated');
        client.emit('token_error', { message: 'Please login before build a lobby' });
      }
    });

    /**
    * A client requested a list of lobbies
    */
    client.on('get_lobbies', async (stars, token) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        log(`${onlineUsers.get(client.id)} requested lobbies`);
        const liveLobbies = await getLobbies(stars);
        client.emit('lobbies', liveLobbies);
      } else {
        client.emit('token_error', { message: 'Please login before request a lobby' });
      }
    });
    /**
    * A lobby host wants to delete his lobby
    */
    client.on('delete_lobby', async (lobbyId, token) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        const userMail = onlineUsers.get(client.id);
        if (lobbies.has(lobbyId)) {
          const lobby = lobbies.get(lobbyId);
          // can delete a lobby only if it's free and if he's in it => he's the host
          /* istanbul ignore else */
          if (lobby.hasPlayer(userMail)
          && lobby.isFree) {
            deleteLobby(lobbyId);
            log(`${userMail} deleted lobby ${lobbyId}`);
            client.emit('lobby_deleted', { message: 'Your lobby has been successfully deleted' });
            client.leave(lobbyId);
          } else {
            client.emit('server_error', { message: 'There has been some problem with the process of deleting a lobby.' });
          }
        } else {
          client.emit('client_error', { message: "Can't find such lobby" });
        }
      } else {
        client.emit('token_error', { message: 'User not authenticated' });
      }
    });
    /**
     * A client wants to join a lobby
     */
    client.on('join_lobby', async (lobbyId, token) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        const userMail = onlineUsers.get(client.id);
        if (!isInLobby(userMail)) {
          if (lobbies.has(lobbyId)) {
            const host = lobbies.get(lobbyId).getPlayers()[0];
            /* istanbul ignore else */
            if (joinLobby(lobbyId, client, userMail)) {
              const game = await setupGame(lobbyId, host, userMail);
              /* istanbul ignore else */
              if (game.length > 0) {
                io.to(lobbyId).emit('game_started', game);
                try {
                  await setupGameTurnTimeout(lobbyId);
                } catch (err) {
                  /* istanbul ignore next */
                  io.to(lobbyId).emit('server_error', { message: 'Something went wrong while processing your game' });
                }
              } else {
                log(`Error in setting up game ${lobbyId}`);
                io.to(lobbyId).emit('server_error', { message: 'Server error while creating a game, please try again' });
              }
            } else {
              log(`error in join lobby for lobby ${lobbyId}`);
              client.emit('server_error', { message: 'Server error while joining lobby, please try again' });
            }
          } else {
            log(`error2 in join lobby for lobby ${lobbyId}`);
            client.emit('server_error', { message: "Such lobby doesn't exist anymore" });
          }
        } else {
          log(`error3 in join lobby for lobby ${lobbyId}`);
          client.emit('client_error', { message: 'Player is not online or is already in a lobby' });
        }
      } else {
        log(`error4 in join lobby for lobby ${lobbyId}`);
        client.emit('token_error', { message: 'User not authenticated' });
      }
    });
    /**
   *  Inside of a game, a client moves a piece into the board
   */
    client.on('move_piece', async (lobbyId, from, to, token) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        const player = onlineUsers.get(client.id);
        if (lobbies.has(lobbyId)) {
          const lobby = lobbies.get(lobbyId);
          if (lobby.hasPlayer(player) && lobby.turn === player) {
            let moveResult = await network.askService('put', `${gameService}/game/movePiece`, { gameId: lobbyId, from, to });
            // If no one won
            if (moveResult.status) {
              moveResult = moveResult.response;
              const winner = player;
              const loser = lobby.getPlayers().filter((p) => p !== winner).shift();
              if (moveResult.winner === undefined || moveResult.winner === '') {
                // If the game tied
                /* istanbul ignore next */
                if ('tie' in moveResult && moveResult.tie === true) {
                  // eslint-disable-next-line max-len
                  const updatedUsers = await updatePoints(winner, tieStars, loser, tieStars, true);
                  io.to(lobbyId).emit('update_board', moveResult.board);
                  io.to(onlineUsers.getKey(updatedUsers[0].mail)).emit('game_ended', {
                    user: onlineUsers[0],
                    message: `The game ended in a tie, both players received ${tieStars} stars`,
                  });
                  io.to(onlineUsers.getKey(updatedUsers[1].mail)).emit('game_ended', {
                    user: onlineUsers[1],
                    message: `The game ended in a tie, both players received ${tieStars} stars`,
                  });
                  log(`Wow game ${lobbyId} tied, you just witnessed such a rare event!`);
                  deleteLobby(lobbyId);
                } else {
                  // No one won and the game isn't tied, the show must go on
                  io.to(lobbyId).emit('update_board', moveResult.board);
                  try {
                    await changeTurn(lobbyId);
                  } catch (err) {
                    log(`error in game ${lobbyId}\n${err}`);
                    io.to(lobbyId).emit('server_error', { message: 'Something went wrong while processing your game' });
                  }
                }
              } else {
                // we have a winner!
                /* istanbul ignore next */
                // eslint-disable-next-line max-len
                const updatedUsers = await updatePoints(winner, winStars, loser, lossStars);
                /* istanbul ignore next */
                if (updatedUsers.length !== 0) {
                  io.to(lobbyId).emit('update_board', moveResult.board);
                  // Inform winner
                  io.to(onlineUsers.getKey(winner)).emit('game_ended', {
                    // eslint-disable-next-line max-len
                    user: (winner === updatedUsers[0].mail ? updatedUsers[0] : updatedUsers[1]),
                    message: `Congratulations, you just have won this match, enjoy the ${winStars} stars one of our elves just put under your christmas tree!`,
                  });
                  // Inform loser
                  io.to(onlineUsers.getKey(loser)).emit('game_ended', {
                    // eslint-disable-next-line max-len
                    user: (loser === updatedUsers[0].mail ? updatedUsers[0] : updatedUsers[1]),
                    message: `I'm afraid I'll have to tell you you lost this game, ${lossStars} stars have been removed from your profile but if you ask me that was just opponent's luck, don't give up yet`,
                  });
                  log(`Successfully sent end_game for  game ${lobbyId}`);
                  deleteLobby(lobbyId);
                } else {
                  log('Something wrong while updating points ');
                  client.emit('server_error', { message: 'Something wrong while updating points.' });
                }
              }
            } else if (moveResult.response_status === 400) {
              client.emit('client_error', moveResult.response_data);
            } else {
              /* istanbul ignore next */
              client.emit('server_error', { message: 'Something went wrong while making your move, please try again' });
            }
          } else {
            client.emit('client_error', { message: "It's not your turn or you're not in this lobby, you tell me" });
          }
        } else {
          client.emit('client_error', { message: "I don't know who you are or the lobby you're referring to" });
        }
      } else {
        client.emit('token_error', { message: 'User not authenticated' });
      }
    });
    /**
    * A client leaves an already started game.
    */
    client.on('leave_game', async (lobbyId, token) => {
      const user = await isAuthenticated(token, client.id);
      let result = null;
      if (user[0]) {
        const player = onlineUsers.get(client.id);
        if (lobbies.has(lobbyId) && lobbies.get(lobbyId).hasPlayer(player)) {
          log(`${player} is trying to delete lobby ${lobbyId} in which I just confirmed is in`);
          const lobby = lobbies.get(lobbyId);
          const winner = lobby.getPlayers().filter((p) => p !== player).shift();
          result = await network.askService('delete', `${gameService}/game/leaveGame`, { gameId: lobbyId, playerId: player });
          /* istanbul ignore else */
          if (result.status) {
            result = result.response;
            // eslint-disable-next-line max-len
            const updatedUsers = await updatePoints(winner, winStars, player, lossStars);
            if (updatedUsers.length > 0) {
              client.emit('left_game', {
                message: result[0],
                user: updatedUsers[0],
              });
              deleteLobby(lobbyId);
              io.to(onlineUsers.getKey(winner)).emit('opponent_left', {
                message: result[1],
                user: updatedUsers[1],
              });
              log(`${player} just left game ${lobbyId}, I just assigned the win to ${winner}`);
            }
          } else if (result.response_status === 400) {
            client.emit('client_error', result.response_data);
          } else {
            client.emit('server_error', { message: 'Something went wrong while leaving game, please try again' });
          }
        } else {
          log(`${player} permit error`);
          client.emit('client_error', { message: "I don't know which lobby you're referring to and even if I knew you're not in it" });
        }
      } else {
        client.emit('token_error', { message: 'User not authenticated' });
      }
    });

    /* * * * * * * * * * * * * *
       * INVITATIONS HANDLING  *
       * * * * * * * * * * * * *
    *

     * A client  invites another client to play
     */
    client.on('invite_opponent', async (token, opponentMail) => {
      const userMail = onlineUsers.get(client.id);
      const user = await isAuthenticated(token, client.id);
      const lobbyList = Array.from(lobbies.values());
      if (user[0]
      && onlineUsers.hasValue(opponentMail)
      // THIS WON't WORK
      && lobbyList.filter((lobby) => lobby.hasPlayer(opponentMail)).length === 0
      && opponentMail !== userMail) {
        const opponentId = onlineUsers.getKey(opponentMail);
        io.to(opponentId).emit('lobby_invitation', userMail);

        // If such player already exists in invitationTimeouts map
        if (!invitationTimeouts.has(userMail)) {
          invitationTimeouts.set(userMail, new Map());
        }
        /* istanbul ignore next */
        invitationTimeouts.get(userMail).set(opponentMail, setTimeout(() => {
          // Inform both players that the invite has timed out
          if (invitationTimeouts.has(userMail)) {
            io.to(opponentId).emit('invitation_timeout', userMail);
            client.emit('invitation_timeout', userMail);
            // Clear the timeout associated to such invite
            clearTimeout(invitationTimeouts.get(userMail).get(opponentMail));
            invitationTimeouts.get(userMail).delete(opponentMail);
          }
        }, inviteTimeout));
      } else {
        client.emit('invite_error', { message: `Can't invite player ${opponentMail}` });
      }
    });

    /**
     * A client accepts someone invite to play a game.
     */
    client.on('accept_invite', async (token, opponentMail) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        const userMail = onlineUsers.get(client.id);
        // eslint-disable-next-line max-len
        if (!invitationTimeouts.has(opponentMail) || !invitationTimeouts.get(opponentMail).has(userMail)) {
          client.emit('invitation_expired', { message: 'Your invitation for this lobby has expired' });
        } else {
          log(`${userMail} just accepted a game invite from ${opponentMail}`);
          const opponent = io.sockets.sockets.get(onlineUsers.getKey(opponentMail));
          const lobbyId = buildLobby(`${opponentMail}-${userMail}`, opponent, Number.MAX_VALUE);
          if (joinLobby(lobbyId, client, userMail)) {
            const game = await setupGame(lobbyId, opponentMail, userMail);
            /* istanbul ignore else */
            if (game.length !== 0) {
              io.to(onlineUsers.getKey(opponentMail)).emit('invite_accepted');
              // Waiting a few ms before sending game_started
              setTimeout(() => {
                io.to(lobbyId).emit('game_started', game);
              }, 700);
              log(`${opponentMail}(host) and ${userMail} just started a game through invitations`);
              log(invitationTimeouts);
              /* istanbul ignore next */
              if (invitationTimeouts.has(userMail)) {
                // eslint-disable-next-line max-len
                Object.values(invitationTimeouts.get(userMail)).forEach((timeout) => clearTimeout(timeout));
              }
              // eslint-disable-next-line max-len
              Object.values(invitationTimeouts.get(opponentMail)).forEach((timeout) => clearTimeout(timeout));
              invitationTimeouts.delete(userMail);
              invitationTimeouts.delete(opponentMail);
              await setupGameTurnTimeout(lobbyId);
            } else {
              client.emit('server_error', { message: 'Something went wrong while setting up your game!' });
            }
          }
        }
      } else {
        client.emit('token_error', { message: 'User not authenticated' });
      }
    });

    /**
     * A client declines an invite to play
     */
    client.on('decline_invite', async (token, opponentMail) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        const userMail = onlineUsers.get(client.id);
        // eslint-disable-next-line max-len
        if (!invitationTimeouts.has(opponentMail) || !invitationTimeouts.get(opponentMail).has(userMail)) {
          client.emit('invitation_expired', { message: 'Your invitation for this lobby has expired' });
        } else {
          io.to(onlineUsers.getKey(opponentMail)).emit('invitation_declined', { message: `${opponentMail} has just refused your invite, we're so sry. ` });
          /* istanbul ignore else */
          // eslint-disable-next-line max-len
          if (invitationTimeouts.has(opponentMail) && invitationTimeouts.get(opponentMail).has(userMail)) {
            clearTimeout(invitationTimeouts.get(opponentMail).get(userMail));
            invitationTimeouts.get(opponentMail).delete(userMail);
          } else {
            client.emit('invitation_expired', { message: 'Your invitation for this lobby has expired' });
          }
        }
      } else {
        client.emit('token_error', { message: 'User not authenticated' });
      }
    });

    /**
    * Client requested his profile
    */
    client.on('get_profile', async (token) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        const userMail = onlineUsers.get(client.id);
        const userProfile = await network.askService('get', `${userService}/profile/getProfile`, {
          mail: userMail,
        });
        /* istanbul ignore else */
        if (userProfile.status) {
          client.emit('user_profile', userProfile.response);
        } else {
          client.emit('client_error', { message: userProfile.response_data });
          log(`Error while getting profile for ${userMail}`);
        }
      } else {
        client.emit('token_error', { message: 'Please login before request profile' });
      }
    });

    /**
    * Client requested leaderboard
    */
    client.on('get_leaderboard', async (token) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        const userMail = onlineUsers.get(client.id);
        log(`${userMail} just asked for a leaderboard`);
        const leaderboard = await network.askService('get', `${userService}/users/getLeaderboard`, '');
        if (leaderboard.status) {
          client.emit('leaderboard', leaderboard.response);
        } /* else {
          client.emit('client_error', { message: leaderboard.response_data });
        } */
      } else {
        client.emit('token_error', { message: 'Please login before request leaderboard' });
      }
    });

    /**
    * Client updated some infos on his profile
    */
    client.on('update_profile', async (params, token) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        const userMail = onlineUsers.get(client.id);
        const updatedUser = await network.askService('put', `${userService}/profile/updateProfile`, { mail: userMail, params });
        if (updatedUser.status) {
          log(`${userMail}'s profile has just been successfully updated`);
          client.emit('updated_user', updatedUser.response);
        } else {
          client.emit('client_error', { message: updatedUser.response_data });
        }
      } else {
        // client.emit('token_error', { message: 'User not authenticated' });
        client.emit('token_error', { message: 'You are not authenticated, please login before update' });
      }
    });

    /**
   * A client is sending a msg in his game chat
   */
    client.on('game_msg', async (lobbyId, msg, token) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        const userMail = onlineUsers.get(client.id);
        log(`${userMail} just sent a game-msg for game ${lobbyId}`);
        if (lobbies.has(lobbyId)
      && lobbies.get(lobbyId).getPlayers().includes(onlineUsers.get(client.id))) {
          io.to(lobbyId).emit('game_msg', { sender: onlineUsers.get(client.id), message: msg });
        }
      } else {
        client.emit('token_error', { message: 'User not authenticated' });
      }
    });

    client.on('get_history', async (token) => {
      const user = await isAuthenticated(token, client.id);
      if (user[0]) {
        const userMail = onlineUsers.get(client.id);
        log(`${userMail} just want to see all games he did`);
        const history = await network.askService('get', `${gameService}/lobbies/getGamesByUser`, { user: userMail });
        client.emit('user_history', history.response);
      } else {
        client.emit('token_error', { message: 'You are not authenticated, please login before request history' });
      }
    });
  });
};
