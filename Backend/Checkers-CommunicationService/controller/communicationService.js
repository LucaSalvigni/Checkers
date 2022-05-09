const BiMap = require('bidirectional-map');
const socket = require('socket.io');
const network = require('./network_module');
const Lobby = require('../models/lobby');
require('dotenv').config();

const onlineUsers = new BiMap(); // {  client_id <-> user_id  }
const lobbies = new BiMap(); // { lobby_id -> Lobby }
const turnTimeouts = new Map(); // {lobby_id -> timoutTimer}

const gameService = process.env.GAME_SERVICE;
const userService = process.env.USER_SERVICE;
const cert = process.env.COMM_CERT;
const key = process.env.COMM_KEY;

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
  return Math.random().toString(36).slice(2);
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
      `${userService}/authenticate`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (authenticated.status) {
      onlineUsers.set(clientId, authenticated.response.user.email);
      return [true, authenticated.response];
    }
    return [false, ''];
  } catch (err) {
    console.log(err);
    return [false, err.response.data];
  }
}

/**
 *
 * @param {*} playerMail
 * @returns whether a player is in a lobby or not
 */

// TODO: CHECK THIS
function isInLobby(playerMail) {
  return lobbies.filter(([, lobby]) => lobby.hasPlayer(playerMail)).size > 0;
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
  lobbies.set(newRoomId, new Lobby(maxStars, roomName, onlineUsers.get(client.id)));
  client.join(newRoomId);
  return newRoomId;
}

/**
 * Returns a user's username from his mail
 * @param {*} mail user email
 * @returns user username
 */
async function getUsername(mail) {
  const profile = await network.askService('get', `${userService}/profile/getProfile`, { mail });
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
  lobbies
    .filter(([, lobby]) => lobby.isFree() && lobby.getStars() >= userStars)
    .forEach(async ([lobbyId, lobby]) => {
      const username = await getUsername(lobby.getPlayers(0));
      if (username === '') {
        log('Something wrong with retrieving a lobby host username');
      } else {
        data.push({
          lobbyId,
          name: lobby.getName(),
          max_stars: lobby.getStars(),
          host: username,
        });
      }
    });
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
    log('lobby not free');
    return false;
  }
  log('No such lobby');
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
  const game = [];
  const hostSpecs = await network.askService('get', `${userService}/profile/getProfile`, { mail: hostMail });

  const opponentSpecs = await network.askService('get', `${userService}/profile/getProfile`, { mail: opponentMail });

  if (hostSpecs.status && opponentSpecs.status) {
    const board = await network.askService('post', `${gameService}/game/lobbies/create_game`, { game_id: gameId, host_id: hostSpecs.response.mail, opponent: opponentSpecs.response.mail });
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
    turnTimeouts.set(lobbyId, setTimeout(async () => {
      await changeTurn(lobbyId);
      await network.askService('put', `${gameService}/game/turnChange`, { game_id: lobbyId });
      log(`Turn timeout for game ${lobbyId}`);
    }, process.env.TURN_TIMEOUT));
    log(`Timeout set for game${lobbyId}`);
  }

  /**
   * Change turn for a given lobby
   * @param {*} lobby_id  ID of lobby which turn needs to be changed
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
    return [];
  }
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
      log(`${player}just disconnected but wasn't in lobby`);
      onlineUsers.delete(clientId);
    } else {
      // player is in a lobby, check if it's empty or he is in a game
      const playerLobby = Array.from(lobbies.values())
        .filter((lobby) => lobby.hasPlayer(player))[0];
      const lobbyId = lobbies.getKey(playerLobby);
      log(`${player} from lobby ${lobbyId} is  trying to disconnect`);
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
          const updatedUsers = await updatePoints(winner, process.env.WIN_STARS, loser, process.env.LOSS_STARS);
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

    client.on('disconnect', async () => {
      // Remove player from active players
      const player = onlineUsers.get(client.id);
      await handleDisconnection(player);
    });

    client.on('login', async (mail, password) => {
      log('a user is tryng to log in');
      // Update user id in online_users
      if (onlineUsers.hasValue(mail)) {
        client.emit('login_error', { message: 'Someone is already logged in with such email' });
      } else {
        const user = await network.askService('post', `${userService}/login`, {
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

    client.on('signup', async (mail, password, username, firstName, lastName) => {
      log('a user is trying to sign up');
      const newUser = await network.askService('post', `${userService}/signup`, {
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
            lobby_id: newLobbyId,
            allLobbies,
          });
        } else {
          log(`${userMail} tried bulding a lobby while already has one`);
          client.emit('client_error', { message: 'Player is either not online or is already in some lobby.' });
        }
      } else {
        log('a user is damn not authenticated');
        client.emit('token_error', { message: user[1] });
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
        client.emit('token_error', { message: user[1] });
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
          if (lobby.hasPlayer(userMail)
          && lobby.isFree) {
            deleteLobby(lobbyId);
            log(`${userMail} deleted lobby ${lobbyId}`);
            client.emit('lobby_deleted', { message: 'Your lobby has been successfully deleted' });
            client.leave(lobbyId);
          } else {
            client.emit('server_error', { message: 'There has been some problem with the process of deleting a lobby.' });
          }
        }
      } else {
        client.emit('token_error', { message: user[1] });
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
          log(`${userMail} joined a lobby`);
          if (lobbies.has(lobbyId)) {
            const host = lobbies.get(lobbyId).getPlayers()[0];
            if (joinLobby(lobbyId, client, userMail)) {
              const game = await setupGame(lobbyId, host, userMail);
              if (game.length > 0) {
                io.to(lobbyId).emit('game_started', game);
                try {
                  await setupGameTurnTimeout(lobbyId);
                } catch (err) {
                  io.to(lobbyId).emit('server_error', { message: 'Something went wrong while processing your game' });
                }
              } else {
                log(`Error in setting up game ${lobbyId}`);
                io.to(lobbyId).emit('server_error', { message: 'Server error while creating a game, please try again' });
              }
            } else {
              log(`error in join lobby for lobby${lobbyId}`);
              client.emit('server_error', { message: 'Server error while joining lobby, please try again' });
            }
          } else {
            log(`error2 in join lobby for lobby${lobbyId}`);
            client.emit('server_error', { message: "Such lobby doesn't exist anymore" });
          }
        } else {
          log(`error3 in join lobby for lobby${lobbyId}`);
          client.emit('client_error', { message: 'Player is not online or is already in a lobby' });
        }
      } else {
        log(`error4 in join lobby for lobby${lobbyId}`);
        client.emit('token_error', { message: user[1] });
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
        if (userProfile.status) {
          client.emit('user_profile', userProfile.response);
        } else {
          client.emit('client_error', { message: userProfile.response_data });
          log(`Error while getting profile for ${userMail}`);
        }
      } else {
        client.emit('token_error', { message: user[1] });
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
        const leaderboard = await network.askService('get', `${userService}/getLeaderboard`, '');
        if (leaderboard.status) {
          client.emit('leaderboard', leaderboard.response);
        } else {
          client.emit('client_error', { message: leaderboard.response_data });
        }
      } else {
        client.emit('token_error', { message: user[1] });
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
        client.emit('token_error', { message: user[1] });
      }
    });
  });
};