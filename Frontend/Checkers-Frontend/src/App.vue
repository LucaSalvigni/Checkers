<template>
  <div id="app">
    <div id="main" class="flex flex-row min-h-screen min-w-screen">
      <SideBar class="sidebar h-screen" />
      <div class="middle w-screen min-w-fit h-screen">
        <router-view />
      </div>
    </div>

    <div class="modal modal-invites">
      <div class="flex flex-col items-center modal-box">
        <img
          class="w-40 h-28"
          src="./assets/msg_image.png"
          alt="logo-notification"
        />
        <p class="text-base font-semibold invites-msg"></p>
        <div class="modal-action">
          <label class="btn">Accept</label>
          <label class="btn">Refuse</label>
        </div>
      </div>
    </div>

    <div class="modal modal-notification">
      <div class="flex flex-col items-center modal-box">
        <img
          class="w-40 h-28"
          src="./assets/msg_image.png"
          alt="logo-notification"
        />
        <p class="text-base font-semibold notification-msg"></p>
        <div class="modal-action">
          <label class="btn">Accept</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "./components/sideBarComponents/SideBar.vue";
export default {
  name: "App",
  components: {
    SideBar,
  },
};
</script>

<style>
#app {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-style: italic;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
  text-align: center;
  color: #a39d8f;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  background: transparent;
}
#main,
.middle {
  background-color: #343232;
}
#main {
  overflow: hidden;
}
.middle {
  overflow-y: scroll;
  overflow-x: hidden;
}
@media only screen and (max-width: 785px) {
  #main {
    flex-direction: column;
    max-height: 100vh;
  }
  .sidebar {
    max-height: 5.5rem;
    height: 5rem;
    min-width: 100%;
    width: max-content;
  }
  .middle {
    min-height: min-content;
    overflow-y: auto;
    overflow-x: auto;
  }
}
</style>

<style scoped>
.modal-box {
  background-color: #343232;
}
</style>
