<!-- This is the Lobbies component -->
<template>
  <div class="grid">
    <div class="relative overflow-x-auto">
      <div
        class="preview flex flex-wrap items-center justify-center gap-2 overflow-x-hidden p-4 undefined"
        style="background-size: 5px 5px"
      >
        <div class="overflow-x-auto w-full">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Lobby Owner</th>
                <th>Lobby Name</th>
                <th>Max Stars</th>
                <th>Join</th>
              </tr>
            </thead>
            <tbody v-for="(lobby, index) in lobbies" :key="index">
              <tr>
                <td :textContent="lobby.host"></td>
                <td :textContent="lobby.name"></td>
                <td :textContent="lobby.max_stars"></td>
                <td>
                  <router-link
                    class="join-lobby btn"
                    to="/game"
                    @click="joinLobby(lobby.lobbyId)"
                    >Join Lobby</router-link
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api.js";

export default {
  name: "OpenLobbies",
  data() {
    return {
      lobbies: [], //all open lobbies
      buttonSound: this.$BUTTON_CLICK,
      socket: this.$socket,
    };
  },
  methods: {
    // Join a specific lobby
    joinLobby(id) {
      this.buttonSound.play();
      if (this.lobbies.length > 0) {
        api.join_lobby(this.socket, id);
      }
    },
  },
  sockets: {
    // Response from backend that give all open lobbies that player can join
    /* c8 ignore start */
    lobbies(res) {
      this.lobbies = res;
    },
    /* c8 ignore end */
  },
};
</script>
