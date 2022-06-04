<!-- This is leaderboard component -->

<template>
  <div class="grid">
    <div class="relative overflow-x-auto">
      <div
        class="preview flex flex-wrap items-center justify-center gap-2 overflow-x-hidden p-4 undefined"
        style="background-size: 5px 5px"
      >
        <div class="mb-10">
          <h1 class="font-bold text-3xl">Global leaderboard</h1>
        </div>
        <div class="overflow-x-auto w-full">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Stars</th>
                <th>Games</th>
                <th>Wins</th>
                <th>Defeats</th>
              </tr>
            </thead>
            <!-- body -->
            <tbody>
              <template v-for="(user, i) in currentPage" :key="i">
                <tr>
                  <th
                    :textContent="
                      '#' + (leaderboard.indexOf(currentPage[i]) + 1)
                    "
                  ></th>
                  <td>
                    <div class="flex items-center space-x-3">
                      <div class="avatar">
                        <div class="w-12 h-12 mask mask-squircle">
                          <img :src="user.avatar" alt="User's Avatar" />
                        </div>
                      </div>
                      <div>
                        <div class="font-bold">{{ user.username }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ user.stars }}</td>
                  <td>{{ user.losses + user.wins }}</td>
                  <td>{{ user.wins }}</td>
                  <td>{{ user.losses }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="leaderboard.length > perPage" class="flex mt-3 justify-center">
      <button
        class="btn mr-5 btn-disabled previous"
        @click="previousPage($event)"
      >
        Previous
      </button>
      <button class="btn next" @click="nextPage($event)">Next</button>
    </div>
    <div v-else class="btn-group mt-4">
      <button
        class="btn mr-5 btn-disabled previous"
        @click="previousPage($event)"
      >
        Previous
      </button>
      <button class="btn btn-disabled next" @click="nextPage($event)">
        Next
      </button>
    </div>
  </div>
</template>

<script>
import api from "../api.js";

export default {
  name: "LeaderBoard",
  data() {
    return {
      leaderboard: [], // All leaderboard infos
      currentPage: [], // Current page ingos
      perPage: 15, // Maximum infos per page
      page: 1, // Indicator of the current page
      buttonSound: this.$BUTTON_CLICK,
      socket: this.$socket,
    };
  },
  mounted() {
    // Request leaderboard to backend
    api.get_leaderboard(this.socket);
  },
  methods: {
    // Go ahead with leaderboard infos and update the current page
    nextPage(button) {
      this.buttonSound.play();
      this.currentPage = [];
      for (
        let i = this.perPage * this.page;
        i < (this.page + 1) * this.perPage;
        i++
      ) {
        if (this.leaderboard[i] === undefined) {
          break;
        }
        this.currentPage.push(this.leaderboard[i]);
      }
      this.page++;
      if (this.leaderboard.at(-1) === this.currentPage.at(-1)) {
        button.path[1].children[1].setAttribute("class", "btn btn-disabled");
      }
      if (button.path[1].children[0].className.includes("disabled")) {
        button.path[1].children[0].setAttribute("class", "btn mr-5");
      }
    },
    // Go back with leaderboard info and update the current page
    previousPage(button) {
      this.buttonSound.play();
      this.currentPage = [];
      var fillTo = this.perPage * this.page - 1 - this.perPage;
      for (let i = fillTo - this.perPage + 1; i <= fillTo; i++) {
        if (this.leaderboard[i] === undefined) {
          break;
        }
        this.currentPage.push(this.leaderboard[i]);
      }
      this.page--;
      if (this.leaderboard[0] === this.currentPage[0]) {
        button.path[1].children[0].setAttribute(
          "class",
          "btn mr-5 btn-disabled"
        );
      }
      if (button.path[1].children[1].className.includes("disabled")) {
        button.path[1].children[1].setAttribute("class", "btn");
      }
    },
  },
  sockets: {
    // Response from backend to give all leaderboard infos
    /* c8 ignore start */
    leaderboard(res) {
      this.leaderboard = res;
      for (let i = 0; i < this.perPage; i++) {
        if (this.leaderboard[i] === undefined) {
          break;
        }
        this.currentPage.push(this.leaderboard[i]);
      }
    },
    /* c8 ignore end */
  },
};
</script>

<style scoped>
button {
  color: white;
  background-color: #343232;
}

@media only screen and (max-width: 900px) {
  .main-div {
    padding-right: 1rem;
    padding-left: 1rem;
  }
}
</style>
