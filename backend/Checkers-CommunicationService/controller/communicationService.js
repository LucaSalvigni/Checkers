const BiMap = require('bidirectional-map');
const socket = require('socket.io');
const path = require('path');
const fs = require('fs');
const network = require('./network_module');

const onlineUsers = new BiMap(); // {  client_id <-> user_id  }
// const lobbies = new BiMap(); // { lobby_id -> Lobby }
const cert = fs.readFileSync(path.join(__dirname, `${path.sep}..${path.sep}cert${path.sep}comm_cert.pem`));
const key = fs.readFileSync(path.join(__dirname, `${path.sep}..${path.sep}cert${path.sep}comm_key.pem`));

// Utils
function log(msg) {
  if (process.env.NODE_ENV === 'development') {
    console.log(msg);
  }
}

exports.socket = async function (server) {
  const io = socket(server, {
    cors: {
      origin: '*',
    },
  });

  // Setup HTTPS agent to communicate with other services.
  network.setup_https_agent(cert, key);

  io.on('connection', async (client) => {
    log('a user connected');

    // A new anon user just connected, push it to online_players
    onlineUsers.set(client.id, Math.random().toString(36).slice(2));

    client.on('disconnect', async () => {
      // TODO
    });
    client.on('login', async () => {
      // TODO
    });
    client.on('signup', async () => {
      // TODO
    });
  });
};
