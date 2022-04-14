<!-- This is the Checkerboard component -->

<template>
  <div class="content flex flex-col flex-grow max-w-screen-lg">
    <appPlayer1 />
    <div class="wrapper">
      <div class="subwrapper">
        <div class="grid">
          <template v-for="(row, y) in board">
            <appCell
              v-for="(cell, x) in row"
              :key="x + '-' + y"
              :x="x"
              :y="y"
              :cell="cell"
              :size="getSize"
            />
          </template>
        </div>
      </div>
    </div>
    <appPlayer0 class="self-start" />
  </div>
</template>

<script>
import Cell from "./Cell.vue";
import Player from "./Player.vue";
import { getCurrentInstance } from "vue";

var appInstance = null;

export default {
  components: {
    appCell: Cell,
    appPlayer1: Player,
    appPlayer0: Player,
  },
  setup() {
    appInstance = getCurrentInstance().appContext.config.globalProperties;
  },
  // Create the initial board to be filled when the game start
  data() {
    return {
      board: this.createGrid(appInstance.$BOARD_SIZE), // The board of the game
    };
  },
  computed: {
    // Give the size of the board
    getSize() {
      return "0 0 " + 100 / appInstance.$BOARD_SIZE + "%";
    },
  },
  methods: {
    createGrid(size) {
      let grid = [];
      var cell = 1;
      for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
          if ((i + 1) % 2 == 0) {
            if ((j + 1) % 2 != 0) {
              row[j] = cell;
              cell++;
            } else {
              row[j] = 0;
            }
          } else {
            if ((j + 1) % 2 == 0) {
              row[j] = cell;
              cell++;
            } else {
              row[j] = 0;
            }
          }
        }
        grid.push(row);
      }
      return grid;
    },
  },
};
</script>

<style scoped>
.content .wrapper {
  display: flex;
  width: 100%;
  height: calc(100% - 60px);
  align-items: center;
}

.content .wrapper .subwrapper {
  display: flex;
  width: 100%;
}

.content .wrapper .subwrapper .grid {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  border: 2px solid black;
}

.grid {
  max-width: 65em;
  min-width: 450px;
}

@media only screen and (max-width: 500px) {
  .grid {
    min-width: 425px;
  }
}
</style>
