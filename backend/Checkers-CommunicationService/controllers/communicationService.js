const BiMap = require('bidirectional-map')
const socket = require("socket.io")

const online_users = new BiMap()  //{  client_id <-> user_id  }
const lobbies = new BiMap(); // { lobby_id -> Lobby }

exports.socket = async function(server) {
    const io = socket(server, {
      cors: {
        origin: '*',
      }
    })
    io.on('connection', async client => {
        client.on('disconnect',async()=>{
            //TODO
        })
        client.on('login',async(mail,password) => {
            //TODO
        })
        client.on('signup',async(mail,password,username,first_name,last_name)=>{
            //TODO
        })
    })
}