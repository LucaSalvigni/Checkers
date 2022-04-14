<template>
  <div
    class="main-div flex flex-row items-center justify-center centralSpace px-28 py-5"
  >
    <img
      src="../assets/checkers.png"
      alt="Main Logo"
      class="main-logo self-center mask min-w-fit min-h-fit w-7/12 h-7/12 mask-square"
    />

    <div
      class="card items-center w-64 flex flex-col rightMenu self-center ml-10"
    >
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
        class="btn text-sm"
        @click="buttonClick"
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
            <label for="create-lobby-modal" class="accept btn"> Create </label>
            <label for="create-lobby-modal" class="btn" @click="buttonClick"
              >Cancel</label
            >
          </div>
        </div>
      </div>

      <label
        id="btn-menu"
        for="join-lobby-modal"
        class="btn text-sm"
        @click="lobbyOpened"
        >Join a lobby</label
      >

      <label
        id="btn-menu"
        for="friends-modal"
        class="btn mb-7 text-sm"
        @click="buttonClick"
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
            <label for="friends-modal" class="accept btn">Send</label>
            <label for="friends-modal" class="btn" @click="buttonClick"
              >Cancel</label
            >
          </div>
        </div>
      </div>
    </div>

    <div class="dropdown mt-10">
      <div tabindex="0" class="flex flex-nowrap flex-column btn h-24">
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
            id="btn-menu"
            for="create-lobby-modal"
            class="btn text-sm"
            @click="buttonClick"
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
                <label for="create-lobby-modal" class="accept btn">
                  Create
                </label>
                <label for="create-lobby-modal" class="btn" @click="buttonClick"
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
            class="btn text-sm"
            @click="lobbyOpened"
            >Join a lobby</label
          >
        </li>
        <li class="mt-3">
          <label
            id="btn-menu"
            for="friends-modal"
            class="btn mb-7 text-sm"
            @click="buttonClick"
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
                <label for="friends-modal" class="accept btn">Send</label>
                <label for="friends-modal" class="btn" @click="buttonClick"
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
import { getCurrentInstance } from "vue";

var appInstance = null;

export default {
  name: "HomeView",
  setup() {
    appInstance = getCurrentInstance().appContext.config.globalProperties;
  },
  methods: {
    lobbyOpened() {
      this.$router.push("/lobbies");
    },
    buttonClick() {
      appInstance.$BUTTON_CLICK.play();
    },
  },
};
</script>

<style scoped>
.main-logo {
  min-width: 35rem;
  min-height: 35rem;
}
.rightMenu {
  min-width: 250px;
  background-color: #1f1e1e;
}
.rightMenu #btn-menu:first-child {
  margin-top: 6.8em;
}
.rightMenu #btn-menu {
  margin-top: 4em;
  width: 200px;
  margin-left: 1.5em;
  margin-right: 1.5em;
}
.modal-box {
  background-color: #343232;
}
.dropdown {
  visibility: hidden;
}

@media only screen and (max-width: 1200px) {
  .main-div {
    flex-direction: column;
  }
  .rightMenu {
    visibility: hidden;
    width: 0;
    height: 0;
  }
  .dropdown {
    visibility: visible;
  }
  .main-logo {
    padding: 0;
    margin-top: 5rem;
  }
  .play-checkers {
    margin-left: 0.8rem;
  }
  .checkers-img {
    min-width: 5rem;
    min-height: 5rem;
  }
}

@media only screen and (max-width: 785px) {
  .main-logo {
    min-width: 27rem;
    min-height: 27rem;
  }
}
</style>
