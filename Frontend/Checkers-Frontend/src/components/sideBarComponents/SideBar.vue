<!-- Custom Sidebar component -->
<template>
  <div>
    <div class="sidebar flex flex-col">
      <router-link to="/">
        <img
          src="../../assets/logo.png"
          class="mask w-36 h-36 my-5 ml-5 mask-squircle"
        />
      </router-link>

      <SideBarLink class="w-44 home mb-3 pl-0.5" to="/" icon="fas fa-home"
        >Home</SideBarLink
      >
      <SideBarLink
        class="w-44 profile mb-3 pl-0.5"
        to="/profile"
        icon="fas fa-user-cog"
        needslogin
        @needs-login="$emit('needs-login')"
        >Profile</SideBarLink
      >
      <SideBarLink
        class="leaderboard w-44 mb-3 pl-0.5"
        to="/leaderboard"
        icon="fas fa-chart-bar"
        needslogin
        @needs-login="$emit('needs-login')"
        >Leaderboard</SideBarLink
      >

      <div class="mx-3 mt-40 indicator">
        <div
          v-if="invites.length > 0"
          class="indicator-item indicator-middle badge badge-secondary"
        ></div>
        <div v-else></div>
        <div v-if="invites.length > 0" class="dropdown">
          <SideBarLink class="notifications w-44 p-0.5 mt-1" icon="fas fa-bell"
            >Notifications</SideBarLink
          >
          <ul
            tabindex="0"
            class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
          >
            <template v-for="(invite, i) in invites" :key="i">
              <li class="block">
                <a @click="checkInvite(invite, i)">Invite by {{ invite }}</a>
              </li>
            </template>
          </ul>
        </div>
        <div v-else class="dropdown">
          <SideBarLink class="notifications w-44 p-0.5" icon="fas fa-bell"
            >Notifications</SideBarLink
          >
          <ul
            tabindex="0"
            class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a>There are not notifications at the moment</a>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="!token">
        <SideBarLink
          class="mx-3 w-44 login mt-96 p-0.5"
          to="/login"
          icon="fas fa-user-lock"
          >Sign in</SideBarLink
        >
      </div>
      <div v-else>
        <SideBarLink
          class="mx-3 w-44 login mt-96 p-0.5"
          to=""
          icon="fas fa-user-lock"
          @click="$emit('logout')"
          >Logout</SideBarLink
        >
      </div>
    </div>
  </div>
</template>

<script>
import SideBarLink from "./SideBarLink.vue";
import { useStore } from "vuex";

export default {
  name: "SideBar",
  components: {
    SideBarLink,
  },
  props: {
    invites: { type: Array, default: [] },
  },
  emits: ["check-invite", "needs-login", "logout"],
  data() {
    return {
      buttonSound: this.$BUTTON_CLICK,
    };
  },
  computed: {
    token() {
      let store = useStore();
      let token = store.getters.token;
      return token;
    },
  },
  methods: {
    // Check invites sent by another players
    checkInvite(invite, i) {
      this.buttonSound.play();
      this.$emit("check-invite", invite, i);
    },
  },
};
</script>

<style>
:root {
  --sidebar-bg-color: #1f1e1e;
  --sidebar-item-hover: #151414;
  --sidebar-item-active: #151414;
}
</style>

<style scoped>
.sidebar {
  color: white;
  background-color: var(--sidebar-bg-color);
  transition: 0.3s ease;
}
.dropdown-content {
  background-color: #666666;
}
.barMenu {
  visibility: hidden;
  width: 0;
  height: 0;
}

@media only screen and (max-height: 1200px) {
  .login {
    margin-top: 10rem;
  }
  .indicator {
    margin-top: 5rem;
  }
}

@media only screen and (max-width: 1200px) {
  img {
    max-width: 4rem;
    max-height: 4rem;
    height: 4rem;
    width: 4rem;
    margin: 0.5rem;
  }
  .home,
  .profile,
  .leaderboard,
  .login {
    width: 3rem;
    padding-left: 0.8rem;
    padding-right: 0.1rem;
  }
  .notifications {
    width: 3rem;
    padding-left: 1rem;
  }
  .home,
  .profile,
  .leaderboard {
    margin: 0;
    margin-top: 0.5rem;
  }
}

@media only screen and (max-width: 785px) {
  .sidebar {
    flex-direction: row;
    justify-content: space-evenly;
  }
  .barMenu {
    visibility: visible;
    width: 3rem;
    height: 3rem;
    padding-left: 0.72rem;
  }
  .login {
    margin-top: 1.8rem;
  }
  .home {
    display: none;
  }
  .notifications,
  .indicator {
    margin-top: 0.95rem;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
