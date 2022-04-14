<!-- This is the Profile component -->

<template>
  <div class="profile flex flex-col justify-center items-center py-5">
    <div class="basic-info card lg:card-side flex flex-row w-9/12">
      <img
        :src="avatar"
        alt="User's Avatar"
        class="mask mask-square w-60 h-60 p-5"
      />
      <div class="p-1">
        <div class="flex mt-2.5 ml-2">
          <h2
            :innerText="username"
            class="font-semibold text-2xl card-title"
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

    <div class="profile-info rounded-xl bordered mt-5 w-9/12">
      <div class="tabs tabs-boxed pl-5 justify-center">
        <a id="dataInfo" class="tab tab-lg tab-active" @click="dataInfo"
          >User Info</a
        >
        <a id="matchInfo" class="tab tab-lg" @click="matchInfo"
          >Match History</a
        >
      </div>
      <div id="content" class="card shadow-lg">
        <div id="tabDiv" class="card-body">
          <div v-if="tabName === 'User Info'">
            <h2 class="card-title">{{ tabName }}</h2>
            <DataInfo class="info"></DataInfo>
          </div>
          <div v-else>
            <h2 class="card-title">{{ tabName }}</h2>
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
import { getCurrentInstance } from "vue";

var appInstance = null;

export default {
  name: "UserProfile",
  components: {
    DataInfo,
    MatchInfo,
  },
  setup() {
    appInstance = getCurrentInstance().appContext.config.globalProperties;
  },
  data() {
    return {
      avatar: "http://daisyui.com/tailwind-css-component-profile-1@40w.png",
      first_last_name: "Name Surname",
      username: "Username",
      tabName: "User Info",
      stars: "Stars",
    };
  },
  methods: {
    // Show user info when data info tab is active
    dataInfo() {
      const elem = document.getElementById("dataInfo");
      this.buttonClick();
      if (!elem.getAttribute("class").includes("tab-active")) {
        this.tabName = "User Info";
        elem.setAttribute("class", "tab tab-lg tab-active");
        document
          .getElementById("matchInfo")
          .setAttribute("class", "tab tab-lg");
        document.getElementsByClassName("card-title")[1].innerHTML =
          this.tabName;
      }
    },
    // Show match history info when match info tab is active
    matchInfo() {
      const elem = document.getElementById("matchInfo");
      this.buttonClick();
      if (!elem.getAttribute("class").includes("tab-active")) {
        this.tabName = "Match History";
        elem.setAttribute("class", "tab tab-lg tab-active");
        document.getElementById("dataInfo").setAttribute("class", "tab tab-lg");
        document.getElementsByClassName("card-title")[1].innerHTML =
          this.tabName;
      }
    },
    buttonClick() {
      appInstance.$BUTTON_CLICK.play();
    },
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
    width: 9rem;
    height: 9rem;
  }
}

@media only screen and (max-width: 700px) {
}
</style>