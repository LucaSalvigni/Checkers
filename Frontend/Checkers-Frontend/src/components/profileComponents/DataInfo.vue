<!-- Component to show user's info -->

<template>
  <div class="form-control items-center">
    <label class="label">
      <span class="font-semibold label-text">Username</span>
    </label>
    <input
      type="text"
      placeholder="Username"
      :value="username"
      class="text-sm username input input-bordered w-screen"
    />

    <label class="label mt-3">
      <span class="font-semibold label-text">FirstName</span>
    </label>
    <input
      type="text"
      placeholder="First Name"
      :value="firstName"
      class="text-sm first_name input input-bordered w-screen"
    />

    <label class="label mt-3">
      <span class="font-semibold label-text">LastName</span>
    </label>
    <input
      type="text"
      placeholder="Last Name"
      :value="lastName"
      class="text-sm last_name input input-bordered w-screen"
    />

    <label class="label mt-3">
      <span class="font-semibold label-text">Email</span>
    </label>
    <input
      type="text"
      placeholder="info@site.com"
      :value="mail"
      class="text-sm mail input input-bordered w-screen"
    />

    <label class="label mt-3">
      <span class="font-semibold label-text">Change Avatar</span>
    </label>
    <div>
      <label for="load-image">
        <img
          src="https://icons.iconarchive.com/icons/dtafalonso/android-lollipop/128/Downloads-icon.png"
          alt="Upload Image"
        />
      </label>
      <input
        id="load-image"
        ref="fileInput"
        type="file"
        accept="image/png, image/gif, image/jpeg"
        @input="uploadImage"
      />
    </div>

    <div class="object-center space-x-2 mt-10">
      <label
        class="btn save font-semibold text-base"
        @click.prevent="save_profile"
        >Save</label
      >
    </div>

    <div class="update-modal modal modal-close">
      <div class="modal-box">
        <div class="flex flex-col items-center">
          <img
            class="w-40 h-28"
            src="../../assets/msg_image.png"
            alt="Modal Logo Image"
          />
          <p class="font-semibold text-base msg">Ciao</p>
        </div>
        <div class="modal-action justify-center">
          <label class="btn close" @click="close">Accept</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../api.js";

var update_modal = document.getElementsByClassName("update-modal");
var msg = document.getElementsByClassName("msg");
var avatar = "";

export default {
  name: "UserInfo",
  data() {
    return {
      firstName: "Name",
      lastName: "LastName",
      mail: "info@site.com",
      username: "Username",
      buttonSound: this.$BUTTON_CLICK,
      user: this.$store.getters.user,
    };
  },
  methods: {
    // Save the user's change and send it to the backend
    save_profile() {
      this.buttonSound.play();
      const user = {
        username: document.getElementsByClassName("username")[0].value,
        firstName: document.getElementsByClassName("first_name")[0].value,
        lastName: document.getElementsByClassName("last_name")[0].value,
        mail: document.getElementsByClassName("mail")[0].value,
        avatar: avatar,
      };
      var mailformat =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (this.user.mail.match(mailformat)) {
        api.update_profile(this.$socket, user, this.$store.getters.token);
      } else {
        msg[0].textContent =
          "Insert a valid email and/or check that the passwords are the same";
        update_modal[0].setAttribute("class", "update-modal modal modal-open");
      }
      //TODO UPDATE STATE.USER AND SEND UPDATE TO BACKEND
      //api.update_profile(this.$socket, user, localStorage.token)
    },
    // Close modal
    close() {
      this.buttonSound.play();
      update_modal[0].setAttribute("class", "update-modal modal");
      //this.$router.go("/profile");
      //this.$forceUpdate();
    },
    // Allow user to upload a profile image
    uploadImage() {
      let input = this.$refs.fileInput;
      let file = input.files;
      if (file && file[0]) {
        var image = new Image();
        let reader = new FileReader();
        image.onload = function () {
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          //ctx.drawImage(image, 0, 0, canvas.width,canvas.height);
          var hRatio = canvas.width / image.width;
          var vRatio = canvas.height / image.height;
          var ratio = Math.min(hRatio, vRatio);
          var centerShift_x = (canvas.width - image.width * ratio) / 2;
          var centerShift_y = (canvas.height - image.height * ratio) / 2;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            centerShift_x,
            centerShift_y,
            image.width * ratio,
            image.height * ratio
          );
          var dataurl = canvas.toDataURL(image.type);
          avatar = dataurl;
        };
        reader.onload = (e) => {
          image.src = e.target.result;
        };
        reader.readAsDataURL(file[0]);
      }
    },
  },
  sockets: {
    /* c8 ignore start */
    // Sent by backend to give user an update succesfull or if there is an error
    updated_user(user) {
      msg[0].textContent = "Update successful";
      update_modal[0].setAttribute("class", "update-modal modal modal-open");
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.mail = user.mail;
      this.username = user.username;
      this.$store.commit("setUser", user);
    },
    // Response by backend when user request info
    user_profile(res) {
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      this.mail = res.mail;
      this.username = res.username;
    },
    /* c8 ignore end */
  },
};
</script>

<style scoped>
.modal-box {
  background-color: #343232;
}
span {
  color: #cdcbcb;
}
input {
  max-width: 20rem;
  background-color: #343232;
}
.select {
  background-color: #343232;
}
#load-image {
  display: none;
}
@media only screen and (max-width: 900px) {
  input {
    max-width: 13rem;
  }
}
</style>
