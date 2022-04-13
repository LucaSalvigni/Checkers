import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Chat from "vue3-beautiful-chat";
import "./index.css";
import "@fortawesome/fontawesome-free/js/all";

export const app = createApp(App);
app.config.productionTip = false;
app.config.globalProperties.$BOARD_SIZE = 10;
app.config.globalProperties.$COLOR_TOP = "color-top";
app.config.globalProperties.$COLOR_BOTTOM = "color-bottom";

app.use(Chat).use(store).use(router).mount("#app");
