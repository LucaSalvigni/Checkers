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
      if (this.players.length >= 2 && this.players[0] === id) {
        return false;
      }
      this.players.push(id);
      return true;
    }
  
    removePlayer(id) {
      if (this.players.length > 0) {
        return this.players.splice(id, 1);
      }
      return null;
    }
  
    getStars() {
      return this.stars;
    }
  
    getName() {
      return this.roomName;
    }
  
    tieProposal(userId) {
      if (this.players.includes(userId) && !this.tie_requests.includes(userId)) {
        this.tie_requests.push(userId);
      }
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
  
    tie() {
      return this.tie_requests.length >= 2;
    }
  };