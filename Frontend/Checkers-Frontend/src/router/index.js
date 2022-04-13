import { createRouter, createWebHistory } from "vue-router";
import Error404 from "../views/ErrorView.vue";
import HomeView from "../views/Home.vue";
import LeaderBoard from "../views/LeaderBoard";
import LogIn from "../views/LogIn";
import Profile from "../views/Profile";
import SignUp from "../views/SignUp";
import Lobbies from "../views/Lobbies";
import Game from "../views/Game";

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
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
