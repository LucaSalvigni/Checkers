const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const communicationService = require('./controller/communicationService');

// Load .env
dotenv.config();

// Initialize express const
const app = express();

// Initialize cors
app.use(cors());

// SocketIO
const server = http.createServer(app);
communicationService.socket(server);

const PORT = process.env.CommunicationService_PORT;
server.listen(PORT, () => {
  console.log(`CommunicationService started on port ${PORT}`);
});
