const Client = require('socket.io-client');
require('../../index');
require('../../../Checkers-UserService/index');
require('../../../Checkers-GameService/index');

const clientSocket = new Client('http://:3030');
const clientSocket2 = new Client('http://:3030');
let tokenValue = '';
let tokenValue2 = '';
let lobbyId = '';

const api = {

  getClient() {
    return clientSocket;
  },

  getClient2() {
    return clientSocket2;
  },

  getToken() {
    return tokenValue;
  },

  getToken2() {
    return tokenValue2;
  },

  getLobbyId() {
    return lobbyId;
  },

  setToken(value) {
    tokenValue = value;
  },

  setToken2(value) {
    tokenValue2 = value;
  },

  setLobbyId(id) {
    lobbyId = id;
  },

  async createUser(mail, username, password) {
    return {
      first_name: 'Tests',
      last_name: 'User',
      mail,
      username,
      password,
    };
  },

  async registerUser(client, user) {
    user.then((res) => {
      client.emit('signup', res.mail, res.password, res.username, res.firstName, res.lastName);
    });
  },

  async loginUser(client, user) {
    client.emit('login', user.mail, user.password);
  },

  async getProfile(client, token) {
    client.emit('get_profile', token);
  },

  async getLeaderboard(client, token) {
    client.emit('get_leaderboard', token);
  },

  async updateUserProfile(client, params, token) {
    client.emit('update_profile', params, token);
  },

  async getHistory(client, token) {
    client.emit('get_history', token);
  },

  async buildLobby(client, lobbyName, maxStars, token) {
    client.emit('build_lobby', lobbyName, maxStars, token);
  },

  async getLobbies(client, stars, token) {
    client.emit('get_lobbies', stars, token);
  },

  async deleteLobby(socket, id, token) {
    socket.emit('delete_lobby', id, token);
  },
};
module.exports = api;
