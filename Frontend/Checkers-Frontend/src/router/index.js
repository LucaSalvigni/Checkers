import { createRouter, createWebHistory } from "vue-router";
import Error404 from "../views/ErrorView.vue";
import HomeView from "../views/Home.vue";
import LeaderBoard from "../views/LeaderBoard.vue";
import LogIn from "../views/LogIn.vue";
import Profile from "../views/Profile.vue";
import SignUp from "../views/SignUp.vue";
import Lobbies from "../views/Lobbies.vue";
import Game from "../views/Game.vue";

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
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/lobbies",
    name: "Lobbies",
    component: Lobbies,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/game",
    name: "Game",
    component: Game,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!sessionStorage.token) {
      next({
        path: "/login",
        query: { needLogin: true },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export { routes };

export default router;
