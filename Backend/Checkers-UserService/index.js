const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Dependencies for an HTTPS server
const https = require('https');

// Load .env
dotenv.config();

const psw = process.env.DB_PSW;
const key = process.env.USER_KEY;
const cert = process.env.USER_CERT;
const PORT = process.env.UserService_PORT;
const certificate = process.env.CERTIFICATE;

// Initialize express const
const app = express();
app.use(cors());

// Connect to DB
const db = `mongodb+srv://checkersdev:${psw}@checkersdb.p6xm6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

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

// const key = fs.readFileSync('./cert/user_key.pem');
// const key = process.env.USER_KEY
// const cert = fs.readFileSync('./cert/user_cert.pem');
// const cert = process.env.USER_CERT

const opts = {
  key,
  cert,
  requestCert: true,
  rejectUnauthorized: false, // so we can do own error handling
  ca: certificate,
};

https.createServer(opts, app).listen(PORT, () => {
  console.log(`UserService started on port ${PORT}`);
});
module.exports = app;
