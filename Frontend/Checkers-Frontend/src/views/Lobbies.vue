<!-- This is the Lobbies component -->
<template>
  <div class="lobbies overflow-x-auto py-8 px-5">
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
</template>

<script>
import api from "../../api.js";

export default {
  name: "OpenLobbies",
  data() {
    return {
      lobbies: [], //all open lobbies
    };
  },
  methods: {
    // Join a specific lobby
    joinLobby(id) {
      this.$BUTTON_CLICK.play();
      if (this.lobbies.length > 0) {
        api.join_lobby(this.$socket, id);
      }
    },
  },
  sockets: {
    // Response from backend that give all open lobbies that player can join
    lobbies(res) {
      this.lobbies = res;
    },
  },
};
</script>
