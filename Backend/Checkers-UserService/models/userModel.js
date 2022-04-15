const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  stars: Number,
  first_name: String,
  last_name: String,
  wins: Number,
  losses: Number,
  avatar: String,
  mail: String,
  password: String,
  salt: String,
});

module.exports = mongoose.model('users', userSchema);
