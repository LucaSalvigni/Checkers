<!-- Component of user match history -->

<template>
  <div class="grid">
    <div class="relative overflow-x-auto">
      <div
        class="preview flex items-center justify-center gap-2 overflow-x-hidden undefined"
        style="background-size: 5px 5px"
      >
        <div class="overflow-x-auto w-full">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Game</th>
                <th>Black</th>
                <th>White</th>
                <th>Winner</th>
              </tr>
            </thead>

            <tbody>
              <template v-for="(user, i) in currentPage" :key="i">
                <tr>
                  <th
                    :textContent="'#' + (history.indexOf(currentPage[i]) + 1)"
                  ></th>
                  <td>
                    <div class="flex items-center space-x-3">
                      <div>
                        <div class="font-bold">
                          {{ user.black }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="flex items-center space-x-3">
                      <div>
                        <div class="font-bold">
                          {{ user.white }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="flex items-center space-x-3">
                      <div>
                        <div class="font-bold">
                          {{ user.winner }}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="history.length > perPage" class="flex mt-3 justify-center">
      <button
        class="btn previous mr-5 btn-disabled"
        @click="previousPage($event)"
      >
        Previous
      </button>
      <button class="btn next" @click="nextPage($event)">Next</button>
    </div>
    <div v-else class="btn-group mt-4">
      <button
        class="btn previous mr-5 btn-disabled"
        @click="previousPage($event)"
      >
        Previous
      </button>
      <button class="btn next btn-disabled" @click="nextPage($event)">
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HistoryInfo",
  data() {
    return {
      history: [], // Contains all matches
      currentPage: [], // Contains the matches on the current page
      perPage: 7, // Maximum match per page
      page: 1, // Indicator of the page
      buttonSound: this.$BUTTON_CLICK,
    };
  },
  methods: {
    // Go ahead with matches
    nextPage(button) {
      this.buttonSound.play();
      this.currentPage = [];
      for (
        let i = this.perPage * this.page;
        i < (this.page + 1) * this.perPage;
        i++
      ) {
        if (this.history[i] === undefined) {
          break;
        }
        this.currentPage.push(this.history[i]);
      }
      this.page++;
      if (this.history.at(-1) === this.currentPage.at(-1)) {
        button.path[1].children[1].setAttribute("class", "btn btn-disabled");
      }
      if (button.path[1].children[0].className.includes("disabled")) {
        button.path[1].children[0].setAttribute("class", "btn mr-5");
      }
    },
    // Go back with matches
    previousPage(button) {
      this.buttonSound.play();
      this.currentPage = [];
      var fillTo = this.perPage * this.page - 1 - this.perPage;
      for (let i = fillTo - this.perPage + 1; i <= fillTo; i++) {
        if (this.history[i] === undefined) {
          break;
        }
        this.currentPage.push(this.history[i]);
      }
      this.page--;
      if (this.history[0] === this.currentPage[0]) {
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
    // Response sent by backend that contains all matches done by a specific user
    /* c8 ignore start */
    user_history(res) {
      if (res !== null) {
        if (!Object.prototype.hasOwnProperty.call(res, "error")) {
          this.history = res[0];
          for (let i = 0; i < this.perPage; i++) {
            if (this.history[i] === undefined) {
              break;
            }
            this.currentPage.push(this.history[i]);
          }
        }
      }
    },
    /* c8 ignore end */
  },
};
</script>

<style scoped>
button {
  color: white;
  background-color: #1f1e1e;
}
</style>
