<!-- This is the Game component with Chat and Checkerboard-->
<template>
  <div class="centralSpace px-20 py-10">
    <CheckerBoard class="board" />
    <Chat :opponent="opponent" :lobby-id="lobbyId" class="chat" />

    <div class="modal modal-change-location">
      <div class="flex flex-col items-center modal-box">
        <img alt="Modal Logo" class="w-40 h-28" src="../assets/msg_image.png" />
        <p id="exit-game-msg" class="text-base font-semibold"></p>
        <div class="modal-action">
          <label for="my-modal-2" class="btn exit" @click="exitGame"
            >Accept</label
          >
          <label for="my-modal-2" class="btn close" @click="closeModal"
            >Close</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckerBoard from "../components/boardComponents/CheckerBoard.vue";
import Chat from "../components/boardComponents/Chat.vue";
import api from "../api.js";

var modal = document.getElementsByClassName("modal-change-location");

export default {
  name: "GameView",
  components: {
    CheckerBoard,
    Chat,
  },
  // Guards used to give info to a player when he want to exit from a game lobby
  beforeRouteLeave(to, _from, next) {
    if (this.changeLocation) {
      this.$store.commit("setInGame", false);
      this.changeLocation = false;
      next();
    } else {
      if (this.$store.getters.is_in_game && this.changeLocation === false) {
        document.getElementById("exit-game-msg").innerHTML =
          "Are you sure to leave the game?";
      } else if (this.changeLocation === false) {
        document.getElementById("exit-game-msg").innerHTML =
          "The lobby will be deleted, confirm to exit";
      }
      modal[0].className = "modal modal-change-location modal-open";
      this.path = to.path;
    }
  },
  data() {
    return {
      changeLocation: false,
      path: null,
      lobbyId: null,
      opponent: null,
      buttonSound: this.$BUTTON_CLICK,
      socket: this.$socket,
    };
  },
  methods: {
    // Close a modal
    closeModal() {
      this.buttonSound.play();
      modal[0].className = "modal modal-change-location";
    },
    // Used to check when a player want exit when is in game
    exitGame() {
      this.buttonSound.play();
      if (this.lobbyId === null || this.lobbyId === undefined) {
        api.get_lobbies(this.socket, this.$store.getters.user.stars);
      }
      if (this.$store.getters.is_in_game && this.changeLocation === false) {
        api.leave_game(this.socket, this.lobbyId);
        document.getElementById("exit-game-msg").innerHTML =
          "Are you sure to leave the game?";
        this.changeLocation = true;
      } else if (this.changeLocation === false) {
        api.delete_lobby(this.socket, this.lobbyId);
        document.getElementById("exit-game-msg").innerHTML =
          "The lobby will be deleted, confirm to exit";
        this.changeLocation = true;
      }
      this.$router.push(this.path);
    },
  },
  sockets: {
    // Give lobby info
    /* c8 ignore start */
    lobbies(res) {
      if (this.lobbyId === null || this.lobbyId === undefined) {
        this.lobbyId = res.lobbyId;
      }
    },
    // Message sent when you left a game
    left_game(res) {
      console.log(res);
    },
    // Message sent when opponent left a game
    opponent_left() {
      this.changeLocation = true;
      this.path = "/";
      document.getElementById("exit-game-msg").innerHTML =
        "Your opponent left the game, you got a free win";
      modal[0].className = "modal modal-change-location modal-open";
    },
    // Message sent when the game is finished
    game_ended(msg) {
      this.changeLocation = true;
      this.path = "/";
      var gameEndModal = document.getElementsByClassName("modal")[0];
      document.getElementById("exit-game-msg").innerHTML = msg.message;
      gameEndModal.setAttribute(
        "class",
        "modal modal-change-location modal-open"
      );
    },
    // Message sent when the game is starting
    game_started(res) {
      console.log(res);
      this.$store.getters.user.mail === res[0].mail
        ? (this.opponent = res[1])
        : (this.opponent = res[0]);
      this.lobbyId = res[3];
      this.$store.commit("setInGame", true);
    },
    /* c8 ignore end */
  },
};
</script>

<style scoped>
.centralSpace {
  background-color: #343232;
}
.modal-box {
  background-color: #343232;
}
@media only screen and (max-width: 1700px) {
  .chat {
    margin-left: 2em;
  }
}
@media only screen and (max-width: 650px) {
  .centralSpace {
    flex-direction: column;
    padding-left: 1.3rem;
  }
  .chat {
    margin-top: 1rem;
    margin-left: 0;
  }
  .board {
    max-width: 30rem;
  }
}
</style>
