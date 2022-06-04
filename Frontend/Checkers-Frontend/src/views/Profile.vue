<!-- This is the Profile component -->

<template>
  <div class="profile flex flex-col items-center py-5">
    <div class="grid">
      <div class="overflow-x-auto">
        <div
          class="preview flex flex-wrap gap-2 overflow-x-hidden p-1 undefined"
          style="background-size: 5px 5px"
        >
          <div
            class="basic-info card lg:card-side flex flex-row w-full items-center justify-center"
          >
            <img
              :src="avatar"
              alt="User's Avatar"
              class="mask mask-square w-80 h-80 p-4 object-cover"
            />
            <div class="p-3">
              <div class="flex mt-2 ml-2">
                <h2
                  :innerText="username"
                  class="username font-semibold text-2xl card-title"
                ></h2>
              </div>
              <div class="flex flex-row ml-2 font-semibold text-xl">
                <p>Stars</p>
                <i class="fas fa-star ml-1 mt-1" />
                <p :innerText="stars" class="stars ml-3"></p>
              </div>
              <p
                :innerText="first_last_name"
                class="first_last text-xl text-left ml-2 mt-2"
              >
                FirstName LastName
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-info rounded-xl bordered mt-5 w-9/12">
      <div class="tabs tabs-boxed pl-5 justify-center">
        <a
          id="dataInfo"
          ref="dataInfo"
          class="tab tab-lg tab-active"
          @click="dataInfo()"
          >User Info</a
        >
        <a
          id="matchInfo"
          ref="matchInfo"
          class="tab tab-lg"
          @click="matchInfo()"
          >Match History</a
        >
      </div>
      <div id="content" class="card shadow-lg">
        <div id="tabDiv" class="card-body">
          <div v-if="tabName === 'User Info'">
            <h2
              id="tabName"
              :innerText="tabName"
              refs="tabName"
              class="card-title pb-5 justify-center"
            ></h2>
            <DataInfo class="info"></DataInfo>
          </div>
          <div v-else>
            <h2
              id="tabName"
              :innerText="tabName"
              refs="tabName"
              class="card-title pb-5 justify-center"
            ></h2>
            <MatchInfo class="info"></MatchInfo>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataInfo from "../components/profileComponents/DataInfo.vue";
import MatchInfo from "../components/profileComponents/MatchInfo.vue";
import api from "../api.js";
export default {
  name: "UserProfile",
  components: {
    DataInfo,
    MatchInfo,
  },
  data() {
    return {
      avatar: "http://daisyui.com/tailwind-css-component-profile-1@40w.png",
      first_last_name: "Name Surname",
      username: "Username",
      tabName: "User Info",
      stars: "Stars",
      mail: "Email",
      buttonSound: this.$BUTTON_CLICK,
      socket: this.$socket,
    };
  },
  mounted() {
    // Request user info to backend
    api.get_profile(this.socket);
  },
  methods: {
    // Show user info when data info tab is active
    dataInfo() {
      this.buttonClick(this.buttonSound);
      if (!this.$refs.dataInfo.getAttribute("class").includes("tab-active")) {
        this.tabName = "User Info";
        this.$refs.dataInfo.setAttribute("class", "tab tab-lg tab-active");
        this.$refs.matchInfo.setAttribute("class", "tab tab-lg");
        api.get_profile(this.socket);
      }
    },
    // Show match history info when match info tab is active
    matchInfo() {
      this.buttonClick(this.buttonSound);
      if (!this.$refs.matchInfo.getAttribute("class").includes("tab-active")) {
        this.tabName = "Match History";
        this.$refs.matchInfo.setAttribute("class", "tab tab-lg tab-active");
        this.$refs.dataInfo.setAttribute("class", "tab tab-lg");
        console.log(this.$store.getters.user);
        api.get_history(this.socket);
      }
    },
    buttonClick(sound) {
      sound.play();
    },
  },
  sockets: {
    // Response from backend that contains user's info
    /* c8 ignore start */
    updated_user(user) {
      this.avatar = user.avatar;
      this.first_last_name = user.firstName + " " + user.lastName;
      this.mail = user.mail;
      this.username = user.username;
      this.stars = user.stars;
      this.$forceUpdate();
    },
    user_profile(res) {
      this.avatar = res.avatar;
      this.first_last_name = res.firstName + " " + res.lastName;
      this.username = res.username;
      this.stars = res.stars;
      this.mail = res.mail;
    },
    /* c8 ignore end */
  },
};
</script>

<style scoped>
.basic-info,
.profile-info {
  background-color: #1f1e1e;
}
.tabs {
  background-color: #161512;
}
.tab {
  color: #a39d8f;
}
img {
  max-width: 14rem;
  max-height: 14rem;
}

@media only screen and (max-width: 850px) {
  img {
    width: 7rem;
    height: 7rem;
  }
  .profile {
    font-size: 15px;
  }
}

@media only screen and (max-width: 660px) {
  .profile-info {
    width: 90%;
  }
}
</style>
