<!-- This file represent the Cell component -->
<template>
  <div
    :id="cell"
    :class="getClasses"
    class="cell"
    :style="{ flex: size }"
    @click="selectCell"
    @mouseover="hoverCell"
    @mouseleave="leaveCell"
  >
    <template v-if="cell in moves">
      <div v-if="cell <= 20">
        <img
          class="ease-in-out duration-300"
          src="../../assets/pieces/Red_Piece.png"
          alt="Red Piece Image"
        />
      </div>
      <div v-else-if="cell >= 31">
        <img
          class="ease-in-out duration-300"
          src="../../assets/pieces/White_Piece.png"
          alt="White Piece Image"
        />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "CellComponent",
  props: {
    cell: { type: Number, default: 0 },
    size: { type: String, default: "" },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    moves: { type: Object, default: () => {} },
    myMoves: { type: Object, default: () => {} },
  },
  emits: ["select-cell", "hover-cell", "release"],
  computed: {
    // Give the specific class to the cell
    getClasses() {
      const classes = [];
      if ((this.x + this.y) % 2) {
        classes.push(this.$COLOR_BOTTOM);
      } else {
        classes.push(this.$COLOR_TOP);
      }
      return classes;
    },
  },
  methods: {
    // When a cell is clicked, send an emit to the parent
    selectCell() {
      if (this.cell > 0) {
        this.$emit("select-cell", this.cell);
      }
    },
    // When mouse is hover cell, emit it to the parent if the cell contains a piece
    hoverCell() {
      if (
        ("K" + this.cell in this.myMoves &&
          this.myMoves["K" + this.cell].length > 0) ||
        (this.cell in this.myMoves && this.myMoves[this.cell].length > 0)
      ) {
        this.$emit("hover-cell", this.cell);
      }
    },
    // When mouse live a cell, emit it to the parent
    leaveCell() {
      if (this.cell !== 0) {
        this.$emit("release", this.cell);
      }
    },
  },
};
</script>

<style scoped>
.cell {
  display: flex;
  justify-content: center;
  align-items: stretch;
}
.cell:before {
  content: "";
  display: table;
  padding-top: 100%;
}
.cell.color-top {
  background-color: #583e23;
}
.cell.color-bottom {
  background-color: black;
}
</style>
