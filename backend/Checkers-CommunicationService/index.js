const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const commService = require('./controllers/communicationService');

// Load .env
dotenv.config();

// TODO PASS THROUGH ACTIONS
// Load Env variables
const { PORT } = process.env;

// Initialize express const
const app = express();

// Initialize cors
app.use(cors());

// SocketIO
const server = http.createServer(app);
commService.socket(server);

server.listen(PORT, () => {
  console.log(`CommunicationService started on port ${PORT}`);
});
