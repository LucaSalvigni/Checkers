import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueSocketIO from "vue-3-socket.io";
import SocketIO from "socket.io-client";
import store from "./store";
import Chat from "vue3-beautiful-chat";
import api from "./api";
import "./index.css";
import "@fortawesome/fontawesome-free/js/all";

const communicationServiceAddress = process.env.VUE_APP_COMMUNICATION_SERVICE;
const connection = SocketIO(communicationServiceAddress);
const token_time = 86400000;

export const app = createApp(App);
app.config.productionTip = false;
app.config.globalProperties.$BOARD_SIZE = 10;
app.config.globalProperties.$COLOR_TOP = "color-top";
app.config.globalProperties.$COLOR_BOTTOM = "color-bottom";
app.config.globalProperties.$BUTTON_CLICK = new Audio(
  require("./assets/sounds/button-click.wav")
);
app.config.globalProperties.$MOVE_PIECE = new Audio(
  require("./assets/sounds/piece-move.wav")
);
app.config.globalProperties.$NOTIFICATION = new Audio(
  require("./assets/sounds/notification.mp3")
);
app.config.globalProperties.$RED_PIECE = require("./assets/pieces/Red_Piece.png");
app.config.globalProperties.$WHITE_PIECE = require("./assets/pieces/White_Piece.png");
app.config.globalProperties.$RED_KING_PIECE = require("./assets/pieces/KRed_Piece.png");
app.config.globalProperties.$WHITE_KING_PIECE = require("./assets/pieces/KWhite_Piece.png");

app
  .use(
    new VueSocketIO({
      connection: connection,
      vuex: store,
    })
  )
  .use(Chat)
  .use(store)
  .use(router);

async function load_old_token() {
  if (store.getters.token) {
    console.log("there was a token!");
    api.refresh_token(connection, store.getters.token);
  } else {
    console.log("no token, sry");
  }
  token_timeout(token_time);
  app.mount("#app");
}

async function token_timeout(time) {
  setTimeout(async function () {
    console.log("refreshing token");
    api.refresh_token(connection, store.getters.token);
    token_timeout(time);
  }, time);
}

load_old_token();
