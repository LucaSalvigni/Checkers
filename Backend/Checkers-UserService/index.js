const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Dependencies for an HTTPS server
const https = require('https');
const fs = require('fs');
const Certificates = require('./models/caModel/certificationModel');

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

fs.readdirSync(__dirname).forEach(file => {
  console.log(file);
});
let key = null;
let cert = null;
if (fs.existsSync('./cert/user_key.pem')) {
  key = fs.readFileSync('./cert/user_key.pem');
}
if (fs.existsSync('./cert/user_cert.pem')) {
  cert = fs.readFileSync('./cert/user_cert.pem');
}

(async () => {
  const { PORT } = process.env;
  const certificate = await Certificates.findOne({ name: 'CA' }, 'value');
  const opts = {
    key,
    cert,
    requestCert: true,
    rejectUnauthorized: false, // so we can do own error handling
    ca: certificate.value,
  };
  const server = https.createServer(opts, app);
  server.listen(PORT, () => {
    console.log(`UserService started on port ${PORT}`);
  });
  console.log(server.address());
})();
module.exports = app;
