const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

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

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`UserService started on port ${PORT}`);
});
//AA