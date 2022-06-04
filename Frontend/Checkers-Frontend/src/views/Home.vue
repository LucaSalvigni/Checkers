<template>
  <div
    class="main-div flex flex-row justify-center centralSpace px-28 py-5 h-3/4"
  >
    <img
      src="../assets/checkers.png"
      alt="Main Logo"
      class="main-logo self-center"
    />

    <div class="card items-center w-64 flex flex-col rightMenu self-center">
      <h1 class="font-bold text-2xl my-5">Play Checkers</h1>
      <figure>
        <img
          src="../assets/logo.png"
          alt="menù-logo"
          class="self-center mask w-44 h-44 mt-2 p-2 mask-square"
        />
      </figure>

      <label
        id="btn-menu"
        for="create-lobby-modal"
        class="create-lobby btn text-sm"
        @click="buttonClick(buttonSound)"
        >Create a new lobby</label
      >
      <input id="create-lobby-modal" type="checkbox" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box flex flex-col items-center">
          <img
            alt="Modal Logo Image"
            class="w-40 h-28"
            src="../assets/msg_image.png"
          />
          <div class="form-control items-center">
            <label class="mt-3">
              <span class="font-bold text-lg">Give a name to your lobby</span>
            </label>
            <input
              type="text"
              placeholder="Name"
              class="text-base input-name input input-bordered mt-2 w-min"
            />
            <label class="font-bold text-lg mt-3">
              <span>Max stars for this lobby</span>
            </label>
            <input
              type="text"
              placeholder="Max Points"
              class="text-base input-star input input-bordered mt-2 w-min"
            />
          </div>
          <div class="flex flex-row modal-action">
            <label
              for="create-lobby-modal"
              class="accept btn"
              @click="startingMatch"
            >
              Create
            </label>
            <label
              for="create-lobby-modal"
              class="cancel-create btn"
              @click="buttonClick(buttonSound)"
              >Cancel</label
            >
          </div>
        </div>
      </div>

      <label
        id="btn-menu"
        for="join-lobby-modal"
        class="check-lobbies btn text-sm"
        @click="lobbyOpened()"
        >Join a lobby</label
      >

      <label
        id="btn-menu"
        for="friends-modal"
        class="invite-player btn mb-7 text-sm"
        @click="buttonClick(buttonSound)"
        >Invite a player</label
      >
      <input id="friends-modal" type="checkbox" class="modal-toggle" />
      <div class="modal modal-invite">
        <div class="flex flex-col modal-box items-center">
          <img
            alt="Modal Logo Image"
            class="w-40 h-28"
            src="../assets/msg_image.png"
          />
          <h3 class="font-bold text-lg">Insert mail of the player</h3>
          <div class="form-control items-center mt-2">
            <input
              type="text"
              placeholder="Mail"
              class="text-base opponent-mail input input-bordered w-min"
            />
          </div>
          <div class="flex flex-row modal-action">
            <label for="friends-modal" class="accept btn" @click="invitePlayer"
              >Send</label
            >
            <label
              for="friends-modal"
              class="cancel-invite btn"
              @click="buttonClick(buttonSound)"
              >Cancel</label
            >
          </div>
        </div>
      </div>
    </div>

    <div class="dropdown mt-10 px-5">
      <div
        tabindex="0"
        class="drop-div flex flex-nowrap flex-column btn h-24"
        @click="buttonClick(buttonSound)"
      >
        <figure>
          <img
            alt="Logo Image"
            src="../assets/logo.png"
            class="checkers-img self-center mask w-20 h-20 mask-square"
          />
        </figure>
        <h1 class="play-checkers font-bold text-2xl">Play Checkers</h1>
      </div>
      <ul
        tabindex="0"
        class="p-2 menu dropdown-content bg-base-100 rounded-box w-52"
      >
        <li class="mt-3">
          <label
            id="btn-`1`"
            for="create-lobby-modal"
            class="drop-create-lobby btn text-sm"
            @click="buttonClick(buttonSound)"
            >Create a new Lobby</label
          >
          <input id="create-lobby-modal" type="checkbox" class="modal-toggle" />
          <div class="modal">
            <div class="flex flex-col items-center modal-box">
              <img
                alt="Modal Logo Image"
                class="w-40 h-28"
                src="../assets/msg_image.png"
              />
              <div class="form-control items-center">
                <label class="mt-3">
                  <span class="font-bold text-lg"
                    >Give a name to your lobby</span
                  >
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  class="text-base input-name input input-bordered mt-2 w-min"
                />
                <label class="font-bold text-lg mt-3">
                  <span>Max stars for this lobby</span>
                </label>
                <input
                  type="text"
                  placeholder="Max Points"
                  class="text-base input-star input input-bordered mt-2 w-min"
                />
              </div>
              <div class="flex flex-row modal-action">
                <label
                  for="create-lobby-modal"
                  class="accept btn"
                  @click="startingMatch"
                >
                  Create
                </label>
                <label
                  for="create-lobby-modal"
                  class="drop-cancel-create btn"
                  @click="buttonClick(buttonSound)"
                  >Cancel</label
                >
              </div>
            </div>
          </div>
        </li>
        <li class="mt-3">
          <label
            id="btn-menu"
            for="join-lobby-modal"
            class="drop-check-lobbies btn text-sm"
            @click="lobbyOpened()"
            >Join a lobby</label
          >
        </li>
        <li class="mt-3">
          <label
            id="btn-menu"
            for="friends-modal"
            class="drop-invite-player btn mb-7 text-sm"
            @click="buttonClick(buttonSound)"
            >Invite a player</label
          >
          <input id="friends-modal" type="checkbox" class="modal-toggle" />
          <div class="modal modal-invite">
            <div class="flex flex-col modal-box items-center">
              <img
                alt="Modal Logo Image"
                class="w-40 h-28"
                src="../assets/msg_image.png"
              />
              <h3 class="font-bold text-lg">Insert mail of the player</h3>
              <div class="form-control items-center mt-2">
                <input
                  type="text"
                  placeholder="Mail"
                  class="text-base opponent-mail input input-bordered w-min"
                />
              </div>
              <div class="flex flex-row modal-action">
                <label
                  for="friends-modal"
                  class="accept btn"
                  @click="invitePlayer"
                  >Send</label
                >
                <label
                  for="friends-modal"
                  class="drop-cancel-invite btn"
                  @click="buttonClick(buttonSound)"
                  >Cancel</label
                >
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from "../api.js";

var lobbyName = document.getElementsByClassName("input-name");
var starTextBox = document.getElementsByClassName("input-star");
// var starTextBox2 = document.getElementsByClassName("input-star2");
var opponent = document.getElementsByClassName("opponent-mail");

export default {
  name: "HomeView",
  emits: ["needs-login"],
  data() {
    return {
      buttonSound: this.$BUTTON_CLICK,
      socket: this.$socket,
    };
  },
  methods: {
    startingMatch() {
      this.buttonClick(this.buttonSound);
      if (this.$store.getters.token !== "") {
        api.build_lobby(this.socket, lobbyName[0].value, starTextBox[0].value);
        this.$router.push("/game");
      } else {
        this.$emit("needs-login");
        this.$router.push("/login");
      }
    },
    lobbyOpened() {
      this.buttonClick(this.buttonSound);
      if (this.$store.getters.token !== "") {
        api.get_lobbies(this.socket, this.$store.getters.user.stars);
        this.$router.push("/lobbies");
      } else {
        this.$emit("needs-login");
        this.$router.push("/login");
      }
    },
    invitePlayer() {
      this.buttonClick(this.buttonSound);
      if (this.$store.getters.token !== "") {
        api.invite_opponent(this.socket, opponent[0].value);
      } else {
        this.$emit("needs-login");
        this.$router.push("/login");
      }
    },
    buttonClick(sound) {
      sound.play();
    },
  },
};
</script>

<style scoped>
.main-div {
  padding-left: 0;
}
.rightMenu {
  margin-left: auto;
  min-width: 250px;
  background-color: #1f1e1e;
}
.rightMenu #btn-menu:first-child {
  margin-top: 6.8em;
}
.rightMenu #btn-menu {
  margin-top: 4em;
  width: 200px;
}
.modal-box {
  background-color: #343232;
}
.dropdown {
  display: none;
}
.main-logo {
  height: 80%;
  margin-left: auto;
}
@media only screen and (max-width: 1200px) {
  .menu {
    width: 95%;
  }
  .main-div {
    flex-direction: column;
  }
  .rightMenu {
    visibility: hidden;
    width: 0;
    height: 0;
  }
  .dropdown {
    display: inline-block;
  }
  .main-logo {
    padding: 0;
    margin-top: 6rem;
    width: 25rem;
    height: 25rem;
    margin-left: unset;
  }
  .checkers-img {
    min-width: 5rem;
    min-height: 5rem;
  }
}

@media only screen and (max-width: 785px) {
  .main-div {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

@media only screen and (max-width: 500px) {
  .menu {
    width: 92%;
  }
}

@media only screen and (max-width: 300px) {
  .main-logo {
    max-width: 15rem;
    max-height: 15rem;
  }
  .main-div {
    padding-left: 0rem;
    padding-right: 0rem;
  }
}
</style>
