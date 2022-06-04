// This is the store that contains user's info
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  state: {
    user: {
      username: "",
      mail: "",
      stars: 0,
      wins: 0,
      losses: 0,
      first_name: "",
      last_name: "",
      avatar: "",
    },
    token: "",
    in_game: false,
    authenticated: false,
  },
  plugins: [createPersistedState()],
  getters: {
    is_authenticated: (state) => state.authenticated,
    is_in_game: (state) => state.in_game,
    token: (state) => state.token,
    user: (state) => state.user,
  },
  mutations: {
    setToken(state, token) {
      if (token !== "null") {
        state.authenticated = true;
        state.token = token;
        // axios.defaults.headers.common['Authorization'] = "bearer " + token;
      }
    },
    unsetToken(state) {
      state.authenticated = false;
      state.user = {
        username: "",
        mail: "",
        stars: 0,
        nationality: "",
        wins: 0,
        first_name: "",
        last_name: "",
        losses: 0,
        avatar: "",
      };
      state.token = "";
      //axios.defaults.headers.common['Authorization'] = ""
    },
    setUser(state, user) {
      state.user = user;
    },
    setInGame(state, value) {
      state.in_game = value;
    },
  },
});

export default store;
