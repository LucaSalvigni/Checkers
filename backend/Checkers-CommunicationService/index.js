const express = require("express")
const dotenv = require("dotenv")
const http = require("http")
const communicationService = require("./controller/communicationService")
const cors = require("cors")

// Load .env
dotenv.config()

// Initialize express const
const app = express()

// Initialize cors               
app.use(cors())

// SocketIO
const server = http.createServer(app)
communicationService.socket(server)

const PORT = process.env.PORT
server.listen(PORT, function () {
	console.log('CommunicationService started on port ' + PORT)
})