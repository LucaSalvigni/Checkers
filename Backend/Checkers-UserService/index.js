const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Dependencies for an HTTPS server
const https = require('https');
const fs = require('fs');
const path = require('path');
const Certificates = require('./models/certificationModel');

// Load .env
dotenv.config();

const psw = process.env.DB_PSW;

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

(async () => {
  const { PORT } = process.env;
  const certificate = await Certificates.findOne({ name: 'CA' }, 'value');
  const opts = {
    key: fs.readFileSync(path.join(__dirname, `${path.sep}cert${path.sep}user_key.pem`)),
    cert: fs.readFileSync(path.join(__dirname, `${path.sep}cert${path.sep}user_cert.pem`)),
    requestCert: true,
    rejectUnauthorized: false, // so we can do own error handling
    ca: certificate.value,
  };

  https.createServer(opts, app).listen(PORT, () => {
    console.log(`UserService started on port ${PORT}`);
  });
})();
module.exports = app;
