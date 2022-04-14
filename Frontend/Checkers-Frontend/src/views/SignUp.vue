<!-- This is the Signup component -->

<template>
  <div class="flex flex-col justify-center">
    <div class="pt-20">
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
              class="first_name input input-bordered w-13"
            />
          </div>

          <div class="block">
            <label class="label">
              <span class="font-semibold label-text mt-5">Last name</span>
            </label>
            <input
              type="text"
              placeholder="Insert last name"
              class="last_name input input-bordered w-13"
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
              class="confirm_password input input-bordered w-13"
            />
          </div>

          <div class="object-center space-x-2 mb-3 mt-10">
            <label class="signup-btn text-base font-semibold btn"
              >Sign up</label
            >
            <div class="signup-modal modal modal-close">
              <div class="modal-box">
                <img
                  alt="Modal Logo Image"
                  class="w-40 h-28"
                  src="../assets/msg_image.png"
                />
                <p class="text-base font-semibold msg">Ciao</p>
                <div class="modal-action">
                  <label class="btn">Accept</label>
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
export default {
  name: "SignUp",
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
</style>
