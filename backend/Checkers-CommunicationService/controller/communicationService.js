const BiMap = require('bidirectional-map');
const socket = require('socket.io');
const path = require('path');
const fs = require('fs');
const network = require('./network_module');
const Lobby = require('../models/lobby');

const cert = fs.readFileSync(path.join(__dirname, `${path.sep}..${path.sep}cert${path.sep}comm_cert.pem`));
const key = fs.readFileSync(path.join(__dirname, `${path.sep}..${path.sep}cert${path.sep}comm_key.pem`));
const onlineUsers = new BiMap(); // {  client_id <-> user_id  }
const lobbies = new BiMap(); // { lobby_id -> Lobby }

// const gameService = process.env.GAME_SERVICE;
const userService = process.env.USER_SERVICE;

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
function isInLobby(playerMail) {
  // TODO: CHECK THIS
  /* Object.values(lobbies).forEach((lobby) => {
    if (lobby.hasPlayer(playerMail)) {
      return true;
    }
  });
  */
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
async function getLobbies(userStars) {
  const data = [];
  // Need to check this
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
    });/*
  const tmp = lobbies.entries();
  for (const [lobbyId, lobby] of tmp) {
    if (lobby.isFree() && lobby.getStars() >= userStars) {
      /* eslint-disable no-await-in-loop
      const username = await getUsername(lobby.getPlayers(0));
      if (username === '') {
        log('something wrong with username');
      } else {
        data.push({
          lobbyId,
          name: lobby.getName(),
          max_stars: lobby.getStars(),
          host: username,
        });
      }
    }
  } */
  return data;
}
exports.socket = async function (server) {
  const io = socket(server, {
    cors: {
      origin: '*',
    },
  });

  // Setup HTTPS agent to communicate with other services.
  network.setupHTTPSAgent(cert, key);

  io.on('connection', async (client) => {
    // A new anon user just connected, push it to online_players
    log('a user connected');
    onlineUsers.set(client.id, getId());

    client.on('disconnect', async () => {
      // TODO
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
  });
};
