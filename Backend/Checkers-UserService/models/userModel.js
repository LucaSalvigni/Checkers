const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  stars: Number,
  firstName: String,
  lastName: String,
  wins: Number,
  losses: Number,
  ties: Number,
  avatar: String,
  mail: String,
  password: String,
  salt: String,
});

module.exports = mongoose.model('users', userSchema);
