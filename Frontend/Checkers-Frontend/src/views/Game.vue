<!-- This is the Game component with Chat and Checkerboard-->

<template>
  <div class="centralSpace flex flex-row justify-center px-20 py-10">
    <CheckerBoard class="board flex flex-col" />
    <Chat class="chat mt-28" />

    <div class="modal modal-change-location">
      <div class="flex flex-col items-center modal-box">
        <img alt="Modal Logo" class="w-40 h-28" src="../assets/msg_image.png" />
        <p id="exit-game-msg" class="text-base font-semibold"></p>
        <div class="modal-action">
          <label for="my-modal-2" class="btn" @click="exitGame">Accept</label>
          <label for="my-modal-2" class="btn" @click="closeModal">Close</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckerBoard from "../components/boardComponents/CheckerBoard.vue";
import Chat from "../components/boardComponents/Chat.vue";

export default {
  name: "GameView",
  components: {
    CheckerBoard,
    Chat,
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
