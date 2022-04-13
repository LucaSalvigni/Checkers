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
      :value="first_name"
      class="text-sm first_name input input-bordered w-screen"
    />

    <label class="label mt-3">
      <span class="font-semibold label-text">LastName</span>
    </label>
    <input
      type="text"
      placeholder="Last Name"
      :value="last_name"
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
        ref="file-input"
        type="file"
        accept="image/png, image/gif, image/jpeg"
        @input="uploadImage"
      />
    </div>

    <div class="object-center space-x-2 mt-10">
      <label class="btn font-semibold text-base">Save</label>
    </div>

    <div class="update-modal modal modal-close">
      <div class="modal-box">
        <div class="flex flex-col items-center">
          <img
            class="w-40 h-28"
            src="../../assets/logo.png"
            alt="Modal Logo Image"
          />
          <p class="font-semibold text-base msg">Ciao</p>
        </div>
        <div class="modal-action justify-center">
          <label class="btn">Accept</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserInfo",
  data() {
    return {
      first_name: "Name",
      last_name: "LastName",
      mail: "info@site.com",
      username: "Username",
    };
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
