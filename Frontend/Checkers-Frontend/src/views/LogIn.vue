<!-- This is the Login component -->

<template>
  <div class="main-div flex flex-col justify-center">
    <div class="pt-8 font-bold text-3xl">
      <h1>Sign in into Checkers</h1>
    </div>
    <div class="card">
      <div class="card-body items-center">
        <div class="form-control rounded-lg items-center">
          <div class="block">
            <label class="label">
              <span class="font-semibold label-text mt-2">E-mail</span>
            </label>
            <input
              type="text"
              placeholder="Insert e-mail"
              class="font-base mail input input-bordered w-13"
            />
          </div>

          <div class="block">
            <label class="label">
              <span class="font-semibold label-text mt-2">Password</span>
            </label>
            <input
              type="password"
              placeholder="Insert password"
              class="font-base password input input-bordered w-13"
            />
          </div>

          <div class="object-center space-x-2 mt-10">
            <label
              class="btn login-btn text-base font-semibold"
              @click.prevent="login"
              >Sign in</label
            >
            <div class="login-fail modal">
              <div class="flex flex-col items-center modal-box">
                <img
                  alt="Modal Logo Image"
                  class="w-40 h-28"
                  src="../assets/msg_image.png"
                />
                <p class="msg text-base font-semibold">Ciao</p>
                <div class="modal-action">
                  <label class="btn text-base" @click="close">Accept</label>
                </div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <label class="label">
            <span class="label-text">If you are not already sign</span>
          </label>
          <router-link to="/signup">
            <button
              class="font-bold text-lg btn-link mb-3"
              @click="buttonClick(buttonSound)"
            >
              Sign up
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api";

var mail = document.getElementsByClassName("mail");
var password = document.getElementsByClassName("password");
var loginFail = document.getElementsByClassName("login-fail");
var msg = document.getElementsByClassName("msg");

export default {
  name: "LogIn",
  data() {
    return {
      buttonSound: this.$BUTTON_CLICK,
      socket: this.$socket,
    };
  },
  methods: {
    login() {
      this.buttonClick(this.buttonSound);
      if (mail[0].value === "" && password[0].value === "") {
        msg[0].textContent = "Insert a valid email and/or password";
        loginFail[0].setAttribute("class", "login-fail modal modal-open");
      } else {
        api.login(this.socket, mail[0].value, password[0].value);
        mail[0].value = "";
        password[0].value = "";
      }
    },
    // Close modal
    close() {
      this.buttonClick(this.buttonSound);
      loginFail[0].setAttribute("class", "login-fail modal");
      mail[0].value = "";
      password[0].value = "";
    },
    buttonClick(sound) {
      sound.play();
    },
  },
  sockets: {
    // Response from backend that confirm the authentication
    /* c8 ignore start */
    login_ok(res) {
      //EXAMPLE ON HOW TO USE STORE
      this.$store.commit("setToken", res.token);
      this.$store.commit("setUser", res.user);
      this.$router.push("/");
    },
    // Response from backend that give a message error to the user
    login_error(err) {
      msg[0].textContent = err.message.message;
      loginFail[0].setAttribute("class", "login-fail modal modal-open");
    },
    /* c8 ignore end */
  },
};
</script>

<style scoped>
span {
  color: #cdcbcb;
}
input {
  max-width: 400px;
  background-color: #343232;
}
.card-body {
  background-color: #343232;
}
.form-control {
  max-width: 35em;
  width: 25em;
  background-color: #1f1e1e;
}
.divider {
  padding-left: 2em;
  padding-right: 2em;
}
.divider:after,
.divider:before {
  background-color: #343232;
}
.modal-box {
  background-color: #343232;
}

@media only screen and (max-width: 900px) {
  .main-div {
    width: 100vw;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
  }
}
</style>
