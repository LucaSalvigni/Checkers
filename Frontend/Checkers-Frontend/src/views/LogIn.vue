<!-- This is the Login component -->

<template>
  <div class="flex flex-col justify-center">
    <div class="pt-20 font-bold text-3xl">
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
            <label class="btn login-btn text-base font-semibold">Sign in</label>
            <div class="login-fail modal">
              <div class="modal-box">
                <img
                  alt="Modal Logo Image"
                  class="w-40 h-28"
                  src="../assets/msg_image.png"
                />
                <p class="msg text-base font-semibold">Ciao</p>
                <div class="modal-action">
                  <label class="btn text-base">Accept</label>
                </div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <label class="label">
            <span class="label-text">If you are not already sign</span>
          </label>
          <router-link to="/signup">
            <button class="font-bold text-lg btn-link mb-3">Sign up</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LogIn",
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
</style>
