module.exports = class Lobby{

    constructor(stars,room_name,turn) {
        this.stars = stars;
        this.room_name = room_name
        this.turn = turn;
        this.tie_requests = []
        this.players = []
        this.players.push(turn)
    }
    
     addPlayer(id){
        if (this.players.length >= 2 && this.players[0] === id){
             return false
        }else{
            this.players.push(id)
            return true
        }
    }
     removePlayer(id){
        if(this.players.length > 0){
            return this.players.splice(id,1)
        }
    }
    getStars(){
        return this.stars
    }
    getName(){
        return this.room_name
    }
    tieProposal(user_id){
        if(this.players.includes(user_id) && !this.tie_requests.includes(user_id)){
            this.tie_requests.push(user_id)
        }
    }
    hasPlayer(player){
        return this.players.find(p => p === player)
    }
    isFree(){
        return this.players.length == 1
    }
    getPlayers(index = -1){
        if(index>=0){
            return this.players[index]
        }else{
            return this.players
        }
    }
    tie(){
        return this.tie_requests.length >= 2
    }
}