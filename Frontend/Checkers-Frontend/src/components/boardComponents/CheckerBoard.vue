<!-- This is the Checkerboard component -->

<template>
  <div class="content flex flex-col w-5/12">
    <appPlayer1 :player="player2" />
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
              :my-moves="myMoves"
              :moves="moves"
              @hover-cell="checkMoves"
              @release="release"
              @select-cell="selectCell"
            />
          </template>
        </div>
      </div>
    </div>
    <appPlayer0 class="self-start" :player="player1" />
  </div>
</template>

<script>
import Cell from "./Cell.vue";
import Player from "./Player.vue";
import api from "../../api.js";

export default {
  components: {
    appCell: Cell,
    appPlayer1: Player,
    appPlayer0: Player,
  },
  // Create the initial board to be filled when the game start
  data() {
    return {
      board: this.createGrid(this.$BOARD_SIZE), // The board of the game
      lobbyId: null, // The lobbyId
      playerTurn: null, // Used to check if is my turn
      moves: [], // All moves
      myMoves: [], // All my moves
      possibleMoves: [], // All my possibleMoves
      player1: [], // Info of player1
      player2: [], // Info of player2
      clickedCell: null, // The id of the first clicked cell
      counterClick: 0, // N cells clicked
      movePiece: this.$BUTTON_CLICK,
    };
  },
  computed: {
    // Give the size of the board
    getSize() {
      return "0 0 " + 100 / this.$BOARD_SIZE + "%";
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
    // Color the possible moves of a specific cell
    checkMoves(cell) {
      if (
        this.clickedCell === null &&
        this.playerTurn === this.$store.getters.user.mail &&
        document.getElementById("" + cell).style.backgroundColor ===
          "rgb(51, 51, 51)"
      ) {
        this.colorCellsHoverOrLeave("red", cell);
      } else if (
        this.clickedCell !== null &&
        this.playerTurn === this.$store.getters.user.mail &&
        document.getElementById("" + cell).style.backgroundColor ===
          "rgb(209, 213, 219)"
      ) {
        this.colorCellsHoverOrLeave("red", cell);
      }
    },
    // Change the background color of a cell's possible moves when mouse leave it
    release(cell) {
      var releaseCell = document.getElementById("" + cell);
      if (
        releaseCell.style.backgroundColor !== "rgb(51, 51, 51)" &&
        releaseCell.style.backgroundColor !== "rgb(209, 213, 219)" &&
        this.playerTurn === this.$store.getters.user.mail
      ) {
        releaseCell.style.backgroundColor = "black";
      }
      this.colorCellsHoverOrLeave("black", cell);
    },
    // Used to move a cell in a possible position and send it to the backend
    selectCell(cell) {
      if (this.playerTurn === this.$store.getters.user.mail) {
        if (cell === this.clickedCell) {
          this.movePiece.play();
          this.clickedCell = null;
          this.counterClick = 0;
          document.getElementById("" + cell).style.backgroundColor =
            "rgb(51, 51, 51)";
        } else if (
          this.counterClick === 0 &&
          document.getElementById("" + cell).style.backgroundColor ===
            "rgb(51, 51, 51)"
        ) {
          this.movePiece.play();
          this.clickedCell = cell;
          this.counterClick++;
          document.getElementById("" + cell).style.backgroundColor =
            "rgb(209, 213, 219)";
        } else {
          for (let i = 0; i < this.possibleMoves.length; i++) {
            if (
              this.possibleMoves[i].from === "K" + this.clickedCell &&
              this.possibleMoves[i].to === cell
            ) {
              this.movePiece.play();
              api.move_piece(
                this.$socket,
                this.lobbyId,
                "K" + this.clickedCell,
                cell
              );
              document.getElementById(
                "" + this.clickedCell
              ).style.backgroundColor = "black";
              this.clickedCell = null;
              this.counterClick = 0;
              return;
            } else if (
              this.possibleMoves[i].from === this.clickedCell &&
              this.possibleMoves[i].to === "K" + cell
            ) {
              this.movePiece.play();
              api.move_piece(
                this.$socket,
                this.lobbyId,
                this.clickedCell,
                "K" + cell
              );
              document.getElementById(
                "" + this.clickedCell
              ).style.backgroundColor = "black";
              this.clickedCell = null;
              this.counterClick = 0;
              return;
            } else if (
              this.possibleMoves[i].from === this.clickedCell &&
              this.possibleMoves[i].to === cell
            ) {
              this.movePiece.play();
              api.move_piece(
                this.$socket,
                this.lobbyId,
                this.clickedCell,
                cell
              );
              document.getElementById(
                "" + this.clickedCell
              ).style.backgroundColor = "black";
              this.clickedCell = null;
              this.counterClick = 0;
              return;
            }
          }
          if (this.clickedCell !== null) {
            this.movePiece.play();
            document.getElementById(
              "" + this.clickedCell
            ).style.backgroundColor = "rgb(51, 51, 51)";
          }
          this.clickedCell = null;
          this.counterClick = 0;
        }
      }
    },
    // Check al the possible eat
    checkPossibleEat() {
      var possibleEat = [];
      for (const [key, value] of Object.entries(this.myMoves)) {
        if (key && value.length !== 0) {
          for (let i = 0; i < value.length; i++) {
            if (value[i].piecesTaken !== undefined) {
              possibleEat.push(value[i]);
            }
          }
        }
      }
      return possibleEat;
    },
    // Color all cells but checking first all possible eat
    colorCells() {
      for (const [key] of Object.entries(this.myMoves)) {
        if (key.toString().includes("K")) {
          document.getElementById("" + key.substring(1)).style.backgroundColor =
            "black";
        } else {
          document.getElementById("" + key).style.backgroundColor = "black";
        }
      }
      if (this.playerTurn === this.$store.getters.user.mail) {
        var possibleEat = this.checkPossibleEat();
        if (possibleEat.length > 0) {
          for (let i = 0; i < possibleEat.length; i++) {
            if (("" + possibleEat[i].from).includes("K")) {
              document.getElementById(
                "" + possibleEat[i].from.substring(1)
              ).style.backgroundColor = "#333333";
            } else {
              document.getElementById(
                "" + possibleEat[i].from
              ).style.backgroundColor = "#333333";
            }
          }
          return;
        }
        for (const [key, value] of Object.entries(this.myMoves)) {
          if (key && value.length !== 0) {
            for (let i = 0; i < value.length; i++) {
              document.getElementById(
                "" + value[i].from
              ).style.backgroundColor = "#333333";
            }
          }
        }
      }
    },
    // Give the correct color the a cell when mouse hover it or leave it
    colorCellsHoverOrLeave(color, cell) {
      for (let i = 0; i < this.possibleMoves.length; i++) {
        if (this.possibleMoves[i].from === cell) {
          document.getElementById(
            "" + this.possibleMoves[i].to
          ).style.backgroundColor = color;
        } else if (("" + this.possibleMoves[i].from).includes("K")) {
          if (("" + this.possibleMoves[i].from).substring(1) === this.cell) {
            if (("" + this.possibleMoves[i].to).includes("K")) {
              document.getElementById(
                ("" + this.possibleMoves[i].to).substring(1)
              ).style.backgroundColor = color;
            } else {
              document.getElementById(
                "" + this.possibleMoves[i].to
              ).style.backgroundColor = color;
            }
          }
        }
      }
    },
    // Update possible moves of a speficic player
    updatePossibleMoves() {
      this.possibleMoves = [];
      for (const [key, value] of Object.entries(this.myMoves)) {
        if (key && value.length !== 0) {
          for (let i = 0; i < value.length; i++) {
            this.possibleMoves.push(value[i]);
          }
        }
      }
    },
  },
  sockets: {
    /* c8 ignore start */
    // Message sented by the backend that allow to initialize all parameters to start a game
    game_started(res) {
      console.log(res);
      this.player1 = res[0];
      this.player2 = res[1];
      if (this.player1.username === this.$store.getters.user.username) {
        this.playerTurn = this.$store.getters.user.mail;
        this.myMoves = res[2].board[1];
      } else {
        this.myMoves = res[2].board[2];
      }
      this.moves = { ...res[2].board[1], ...res[2].board[2] };
      this.updatePossibleMoves();
      this.lobbyId = res[3];
      this.colorCells();
    },
    // After a move this message allow the client to update all the board
    update_board(res) {
      var cells = Array.from(
        document.getElementsByClassName("grid")[0].children
      ).filter((el) => el.id !== "0");
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].children.length > 0) {
          cells[i].children[0].remove();
        }
        var piece = document.createElement("img");
        piece.className = "ease-out duration-300";
        if ("K" + cells[i].id in res[2]) {
          piece.src = this.$RED_KING_PIECE;
          cells[i].appendChild(piece);
        } else if (cells[i].id in res[2]) {
          piece.src = this.$RED_PIECE;
          cells[i].appendChild(piece);
        } else if ("K" + cells[i].id in res[1]) {
          piece.src = this.$WHITE_KING_PIECE;
          cells[i].appendChild(piece);
        } else if (cells[i].id in res[1]) {
          piece.src = this.$WHITE_PIECE;
          cells[i].appendChild(piece);
        }
      }
      if (this.player1.username === this.$store.getters.user.username) {
        this.myMoves = res[1];
      } else {
        this.myMoves = res[2];
      }
      this.updatePossibleMoves();
    },
    // Allow to change the turn
    turn_change(res) {
      this.playerTurn = res.next_player;
      this.colorCells();
    },
    /* c8 ignore end */
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
  max-width: 60em;
  min-width: 450px;
}

@media only screen and (max-width: 850px) {
  .grid {
    min-width: 350px;
  }
  .content {
    width: 100% !important;
  }
}

@media only screen and (max-width: 660px) {
  .grid {
    min-width: 250px;
  }
}
</style>
