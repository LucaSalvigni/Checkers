module.exports = class Lobby {
  constructor(stars, roomName, turn) {
    this.stars = stars;
    this.roomName = roomName;
    this.turn = turn;
    this.tie_requests = [];
    this.players = [];
    this.players.push(turn);
  }

  addPlayer(id) {
    /* istanbul ignore next */
    if (this.players.length >= 2 && this.players[0] === id) {
      return false;
    }
    this.players.push(id);
    return true;
  }

  getStars() {
    return this.stars;
  }

  getName() {
    return this.roomName;
  }

  hasPlayer(player) {
    return this.players.find((p) => p === player);
  }

  isFree() {
    return this.players.length === 1;
  }

  getPlayers(index = -1) {
    if (index >= 0) {
      return this.players[index];
    }
    return this.players;
  }
};
