<!-- This is the Signup component -->

<template>
  <div class="main-div flex flex-col justify-center">
    <div class="pt-8">
      <h1 class="font-bold text-3xl">Sign up into Checkers</h1>
    </div>
    <div class="card">
      <div class="card-body items-center justify-center">
        <div class="form-control rounded-lg items-center">
          <div class="block">
            <label class="label">
              <span class="font-semibold label-text mt-5">Username</span>
            </label>
            <input
              type="text"
              placeholder="Create your username"
              class="username input input-bordered w-13"
            />
          </div>

          <div class="block">
            <label class="label">
              <span class="font-semibold label-text mt-5">Name</span>
            </label>
            <input
              type="text"
              placeholder="Insert name"
              class="firstName input input-bordered w-13"
            />
          </div>

          <div class="block">
            <label class="label">
              <span class="font-semibold label-text mt-5">Last name</span>
            </label>
            <input
              type="text"
              placeholder="Insert last name"
              class="lastName input input-bordered w-13"
            />
          </div>

          <div class="block">
            <label class="label">
              <span class="font-semibold label-text mt-5"
                >Insert your mail</span
              >
            </label>
            <input
              type="email"
              placeholder="Insert your mail"
              class="mail input input-bordered w-13"
            />
          </div>

          <div class="block">
            <label class="label">
              <span class="font-semibold label-text mt-5">Password</span>
            </label>
            <input
              type="password"
              placeholder="Insert password"
              class="password input input-bordered w-13"
            />
          </div>

          <div class="block">
            <label class="font-semibold label">
              <span class="label-text mt-5">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confim password"
              class="confirmPassword input input-bordered w-13"
            />
          </div>

          <div class="object-center space-x-2 mb-3 mt-10">
            <label
              class="signup-btn text-base font-semibold btn"
              @click="signup"
              >Sign up</label
            >
            <div class="signup-modal modal modal-close">
              <div class="flex flex-col items-center modal-box">
                <img
                  alt="Modal Logo Image"
                  class="w-40 h-28"
                  src="../assets/msg_image.png"
                />
                <p class="text-base font-semibold msg">Ciao</p>
                <div class="modal-action">
                  <label class="btn" @click="close">Accept</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api.js";

var signupModal = document.getElementsByClassName("signup-modal");
var msg = document.getElementsByClassName("msg");

export default {
  name: "SignUp",
  data() {
    return {
      successfull: false,
      buttonSound: this.$BUTTON_CLICK,
      socket: this.$socket,
    };
  },
  methods: {
    // Send a request of signup to the backend
    signup() {
      this.buttonSound.play();
      var mailformat =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      var username = document.getElementsByClassName("username")[0];
      var firstName = document.getElementsByClassName("firstName")[0];
      var lastName = document.getElementsByClassName("lastName")[0];
      var mail = document.getElementsByClassName("mail")[0];
      var pw = document.getElementsByClassName("password")[0];
      var confirmPw = document.getElementsByClassName("confirmPassword")[0];
      if (mail.value.match(mailformat) && pw.value === confirmPw.value) {
        api.signup(
          this.socket,
          mail.value,
          pw.value,
          username.value,
          firstName.value,
          lastName.value
        );
        username.value = "";
        firstName.value = "";
        lastName.value = "";
        mail.value = "";
        pw.value = "";
        confirmPw.value = "";
      } else {
        msg[0].textContent =
          "Insert a valid email and/or check that the passwords are the same";
        signupModal[0].setAttribute("class", "signup-modal modal modal-open");
      }
    },
    // Close modal and redirect to login if the user signup correctly
    close() {
      this.buttonSound.play();
      signupModal[0].setAttribute("class", "signup-modal modal modal-close");
      if (this.successfull) {
        this.$router.push("/login");
      }
    },
  },
  sockets: {
    // Success response from backend to the user when he try to signup
    /* c8 ignore start */
    signup_success(res) {
      this.successfull = true;
      msg[0].textContent = res.message;
      signupModal[0].setAttribute("class", "signup-modal modal modal-open");
    },
    // Error response from backend to the user when he try to signup
    signup_error(res) {
      msg[0].textContent = "";
      if (res.message.length === undefined) {
        msg[0].textContent = res.message.message;
      } else {
        msg[0].textContent = "Password rules: ";
        res.message.forEach((elem) => {
          msg[0].textContent += elem.message + "\n";
        });
      }
      signupModal[0].setAttribute("class", "signup-modal modal modal-open");
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
  width: 15em;
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
