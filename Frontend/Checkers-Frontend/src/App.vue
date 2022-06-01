<template>
  <div id="app">
    <div id="main" class="flex flex-row h-screen w-screen">
      <SideBar
        class="sidebar h-screen"
        :invites="invites"
        @check-invite="checkInvite"
        @needs-login="loginNotification"
        @logout="logout"
      />
      <div class="middle w-screen min-w-fit h-screen min-h-fit">
        <router-view @needs-login="loginNotification" />
      </div>
    </div>

    <div class="modal modal-invites">
      <div class="flex flex-col items-center modal-box">
        <img
          class="w-40 h-28"
          src="./assets/msg_image.png"
          alt="logo-notification"
        />
        <p class="text-base font-semibold invites-msg"></p>
        <div class="modal-action">
          <label class="btn accept" @click="accept">Accept</label>
          <label class="btn decline" @click="decline">Refuse</label>
        </div>
      </div>
    </div>

    <div class="modal modal-notification">
      <div class="flex flex-col items-center modal-box">
        <img
          class="w-40 h-28"
          src="./assets/msg_image.png"
          alt="logo-notification"
        />
        <p class="text-base font-semibold notification-msg"></p>
        <div class="modal-action">
          <label class="btn close" @click="close('modal-notification')">
            Accept
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "./components/sideBarComponents/SideBar.vue";
import api from "./api.js";

var message = document.getElementsByClassName("invites-msg");
var modal = document.getElementsByClassName("modal-invites");
var modalNotification = document.getElementsByClassName("modal-notification");
var messageNotification = document.getElementsByClassName("notification-msg");

export default {
  name: "App",
  components: {
    SideBar,
  },
  data() {
    return {
      opponent_mail: null, //opponent mail
      invites: [], // all invites to this player
      inviteId: null, // inviteId
      invitation_expired: false, // use to check when an invitation has expired
      buttonSound: this.$BUTTON_CLICK,
      socket: this.$socket,
    };
  },
  methods: {
    // Used to accept an invite from another player
    accept() {
      this.buttonSound.play();
      if (!this.$store.getters.is_in_game) {
        api.accept_invite(this.socket, this.opponent_mail);
        this.invites.splice(this.inviteId, 1);
        var component = this;
        setTimeout(function () {
          if (!component.invitation_expired) {
            console.log("Invito buono");
            component.$router.push("/game");
          } else {
            console.log("Invito scaduto");
            component.invitation_expired = false;
          }
        }, 500);
      }
      modal[0].className = "modal modal-invites";
    },
    // Used to refuse an invite from another player
    decline() {
      this.buttonSound.play();
      api.decline_invite(this.socket, this.opponent_mail);
      this.invites.splice(this.inviteId, 1);
      modal[0].className = "modal modal-invites";
    },
    // Used to open an invite
    checkInvite(invite, i) {
      this.opponent_mail = invite;
      this.inviteId = i;
      if (!this.$store.getters.is_in_game) {
        message[0].innerHTML = invite + " challenged you!";
      } else {
        message[0].innerHTML = "Can't start a game if you're already in one!";
      }
      modal[0].className = "modal modal-invites modal-open";
    },
    // Close modal
    close(el) {
      this.buttonSound.play();
      document.getElementsByClassName(el)[0].className =
        `modal ` + el.toString();
    },
    // Show modal
    loginNotification() {
      messageNotification[0].innerHTML = "You need to login first!";
      modalNotification[0].className = "modal modal-notification modal-open";
    },
    logout() {
      if (this.$store.getters.token) {
        api.logout(this.socket, this.$store.getters.user.mail);
      } else {
        messageNotification[0].innerHTML = "You are not logged in!";
        modalNotification[0].className = "modal modal-notification modal-open";
      }
    },
  },
  sockets: {
    // Response from backend that confirm user authentication
    /* c8 ignore start */
    token_ok(res) {
      this.$store.commit("setToken", res.checkToken);
      this.$store.commit("setUser", res.user);
      console.log("got a fresh new token for ya");
    },
    // Response from backend that denies user authentication
    token_error() {
      console.log("something wrong with tokens boy");
      this.$store.commit("unsetToken");
      this.$router.push("/404");
      messageNotification[0].innerHTML =
        "You need to sign in before do something";
      modalNotification[0].className = "modal modal-notification modal-open";
    },
    // Response that don't allow user do to something wrong
    permit_error(error) {
      console.log(error);
      messageNotification[0].innerHTML = "You don't have the permissions";
      modalNotification[0].className = "modal modal-notification modal-open";
    },
    // Response from backend when there are server side problems
    server_error(error) {
      console.log(error);
      messageNotification[0].innerHTML =
        "There is some server-side problem, please try again soon ";
      modalNotification[0].className = "modal modal-notification modal-open";
    },
    // Response from backend when a player try to do something without authentication
    client_error(error) {
      console.log(error);
      messageNotification[0].innerHTML =
        "Your token expired, please log-in again";
      modalNotification[0].className = "modal modal-notification modal-open";
    },
    // Response from backend that give to user cancellation of a lobby
    lobby_deleted(msg) {
      console.log(msg);
    },
    // Notification from backend when a player receive an invite
    lobby_invitation(msg) {
      console.log(msg);
      this.$NOTIFICATION.play();
      for (let i = 0; i < this.invites.length; i++) {
        if (this.invites[i] === msg) {
          this.invites[i] = msg;
          return;
        }
      }
      this.invites.push(msg);
    },
    // Notification from backend when a player accept invite
    invite_accepted() {
      var component = this;
      if (!this.$store.getters.is_in_game) {
        component.$router.push("/game");
      }
    },
    // Notification from backend when a player refuse invite
    invitation_declined(msg) {
      console.log(msg);
      messageNotification[0].innerHTML = msg.message;
      modalNotification[0].className = "modal modal-notification modal-open";
    },
    // Notification from backend when an invite has expired
    invitation_expired(msg) {
      this.invitation_expired = true;
      console.log(msg);
      messageNotification[0].innerHTML = msg.message;
      modalNotification[0].className = "modal modal-notification modal-open";
    },
    // Notification from backend when an invite is no longer usable
    invitation_timeout(res) {
      console.log(res);
      if (res === this.$store.getters.user.mail) {
        messageNotification[0].innerHTML = "Your invitation has expired";
      } else {
        messageNotification[0].innerHTML =
          "The invite by " + res + " has expired";
      }
      modalNotification[0].className = "modal modal-notification modal-open";
      if (this.invites.includes(res)) {
        this.invites = this.invites.filter((el) => el !== res);
      }
    },
    // Notification error from backend when a player try to invite a player that is not online or doesn't exist.
    invite_error(msg) {
      messageNotification[0].innerHTML = msg.message;
      modalNotification[0].className = "modal modal-notification modal-open";
    },
    // Response for logout method
    logout_ok() {
      this.$store.commit("unsetToken");
      this.$router.push("/");
    },
    logout_error(msg) {
      messageNotification[0].innerHTML = msg.message;
      modalNotification[0].className = "modal modal-notification modal-open";
    },
    /* c8 ignore end */
  },
};
</script>

<style>
#app {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-style: italic;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
  text-align: center;
  color: #a39d8f;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  background: transparent;
}
#main,
.middle {
  background-color: #343232;
}
#main {
  overflow: hidden;
}
.middle {
  overflow-y: scroll;
  overflow-x: scroll;
}
@media only screen and (max-width: 785px) {
  #main {
    flex-direction: column;
    max-height: 100vh;
  }
  .sidebar {
    max-height: 5.5rem;
    height: 5rem;
    min-width: 100%;
    width: max-content;
  }
  .middle {
    min-height: min-content;
    overflow-y: auto;
    overflow-x: auto;
  }
}
</style>

<style scoped>
.modal-box {
  background-color: #343232;
}
</style>
