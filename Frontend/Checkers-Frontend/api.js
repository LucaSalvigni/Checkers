function getToken() {
  return sessionStorage.token;
}

var api = {
  signup(socket, email, password, username, firstName, lastName) {
    socket.emit("signup", email, password, username, firstName, lastName);
  },

  login(socket, email, password) {
    socket.emit("login", email, password);
  },

  build_lobby(socket, name, max_stars) {
    socket.emit("build_lobby", name, max_stars, getToken());
  },

  get_lobbies(socket, stars) {
    socket.emit("get_lobbies", stars, getToken());
  },

  join_lobby(socket, lobbyId) {
    socket.emit("join_lobby", lobbyId, getToken());
  },

  delete_lobby(socket, lobbyId) {
    socket.emit("delete_lobby", lobbyId, getToken());
  },

  invite_opponent(socket, opponentMail) {
    socket.emit("invite_opponent", getToken(), opponentMail);
  },

  accept_invite(socket, opponentMail) {
    socket.emit("accept_invite", getToken(), opponentMail);
  },

  decline_invite(socket, opponentMail) {
    socket.emit("decline_invite", getToken(), opponentMail);
  },

  get_leaderboard(socket) {
    socket.emit("get_leaderboard", getToken());
  },

  get_history(mail, socket) {
    socket.emit("get_history", mail, getToken());
  },

  get_profile(socket) {
    socket.emit("get_profile", getToken());
  },

  update_profile(socket, params) {
    socket.emit("update_profile", params, getToken());
  },

  leave_game(socket, lobbyId) {
    socket.emit("leave_game", lobbyId, getToken());
  },

  tie_game(socket, lobbyId) {
    socket.emit("tie_game", lobbyId, getToken());
  },

  game_history(socket, lobbyId) {
    socket.emit("game_history", lobbyId, getToken());
  },

  move_piece(socket, lobbyId, from, to) {
    socket.emit("move_piece", lobbyId, from, to, getToken());
  },

  global_msg(socket, msg) {
    socket.emit("global_msg", msg, getToken());
  },

  game_msg(socket, lobbyId, msg) {
    socket.emit("game_msg", lobbyId, msg, getToken());
  },

  refresh_token(socket, token) {
    socket.emit("refresh_token", token);
  },
};
export default api;
