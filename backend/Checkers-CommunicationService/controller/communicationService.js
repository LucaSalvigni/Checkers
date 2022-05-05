const BiMap = require('bidirectional-map');
const socket = require('socket.io');
const network = require('./network_module')

const onlineUsers = new BiMap(); // {  client_id <-> user_id  }
const lobbies = new BiMap(); // { lobby_id -> Lobby }

const cert = fs.readFileSync(path.join(__dirname, path.sep+".."+path.sep+"cert"+path.sep+"user_cert.pem"))
const key = fs.readFileSync(path.join(__dirname, path.sep+".."+path.sep+"cert"+path.sep+"user_key.pem"))

exports.socket = async function (server) {
  const io = socket(server, {
    cors: {
      origin: '*',
    },
  });

  //Setup HTTPS agent to communicate with other services.
  network.setup_agent(cert,key)

  io.on('connection', async (client) => {

    log("a user connected")

    //A new anon user just connected, push it to online_players
    online_users.set(client.id, Math.random().toString(36).slice(2))

    client.on('disconnect', async () => {
      // TODO
    });
    client.on('login', async (mail, password) => {
      //TODO
    });
    client.on('signup', async (mail, password, username, firstName, lastName) => {
      // TODO
    });
  });
};