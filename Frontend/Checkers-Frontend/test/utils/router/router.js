import { createRouter, createWebHistory } from "vue-router";
import Error404 from "../../../src/views/ErrorView.vue";
import Game from "../../../src/views/Game.vue";
import HomeView from "../../../src/views/Home.vue";
import LeaderBoard from "../../../src/views/LeaderBoard.vue";
import Lobbies from "../../../src/views/Lobbies.vue";
import LogIn from "../../../src/views/LogIn.vue";
import Profile from "../../../src/views/Profile.vue";
import SignUp from "../../../src/views/SignUp.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/404",
    name: "error404",
    component: Error404,
  },
  {
    path: "/login",
    name: "LogIn",
    component: LogIn,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/leaderboard",
    name: "LeaderBoard",
    component: LeaderBoard,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/lobbies",
    name: "Lobbies",
    component: Lobbies,
  },
  {
    path: "/game",
    name: "Game",
    component: Game,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { routes };

export default router;