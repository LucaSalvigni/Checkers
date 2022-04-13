<!-- This file represent the Cell component -->
<template>
  <div :id="cell" :class="getClasses" class="cell" :style="{ flex: size }">
    <template v-if="cell !== 0">
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
import { getCurrentInstance } from "vue";

var appInstance = null;

export default {
  name: "CellComponent",
  props: {
    cell: { type: Number, default: 0 },
    size: { type: String, default: "" },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  setup() {
    appInstance = getCurrentInstance();
  },
  computed: {
    // Give the specific class to the cell
    getClasses() {
      const classes = [];
      if ((this.x + this.y) % 2) {
        classes.push(
          appInstance.appContext.config.globalProperties.$COLOR_BOTTOM
        );
      } else {
        classes.push(appInstance.appContext.config.globalProperties.$COLOR_TOP);
      }
      return classes;
    },
    // Style the cell into the grid
    style() {
      return {
        width: "50px",
        height: "50px",
        display: "inline-block",
        border: "solid black 1px",
        marginRight: "0px",
        marginTop: "-3px",
      };
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
