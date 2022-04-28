const express = require("express")
const dotenv = require("dotenv")
const http = require("http")
const commService = require("./controllers/communicationService")
const cors = require("cors")

// Load .env
dotenv.config()

// TODO PASS THROUGH ACTIONS
// Load Env variables
const { PORT } = process.env;

// Initialize express const
const app = express()

// Initialize cors               
app.use(cors())

// SocketIO
const server = http.createServer(app)
commService.socket(server)

server.listen(PORT, function () {
	console.log('CommunicationService started on port ' + PORT)
})