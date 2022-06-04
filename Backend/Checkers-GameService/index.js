const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Dependencies for an HTTPS server
const https = require('https');

// Load .env
dotenv.config();

// Load Env variables
const { DB_PSW } = process.env;
const PORT = process.env.GameService_PORT;
const { GAME_KEY } = process.env;
const { GAME_CERT } = process.env;
const { CERTIFICATE } = process.env;

// Initialize express const
const app = express();
app.use(cors());
// Connect to DB
const db = `mongodb+srv://checkersdev:${DB_PSW}@checkersdb.p6xm6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { connection } = mongoose;
connection.on('error', console.error.bind(console, 'connection error: '));
connection.once('open', () => { console.log('Connected successfully to MongoDB'); });

// Body Parser
app.use(express.json());

// Routes
app.use('/', require('./routes/routes'));

const opts = {
  key: GAME_KEY,
  cert: GAME_CERT,
  requestCert: true,
  rejectUnauthorized: false, // so we can do own error handling
  ca: CERTIFICATE,
};

https.createServer(opts, app).listen(PORT, () => {
  console.log(`GameService started on port ${PORT}`);
});

module.exports = app;
