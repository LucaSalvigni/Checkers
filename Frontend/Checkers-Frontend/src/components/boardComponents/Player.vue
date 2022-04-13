<!-- This is a graphic component to represent a player in a game -->

<template>
  <div class="player">
    <div class="card lg:card-side flex flex-row pt-3">
      <img
        src="../../assets/logo.png"
        alt="User's Avatar"
        class="profileImg mask mask-square p-0.5"
      />
      <div class="flex-col">
        <p class="card-title ml-1">Username</p>
        <div class="flex flex-row">
          <i class="fas fa-star" />
          <p class="text-left font-semibold text-base ml-1">Stars</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayerComponent",
};
</script>

<style scoped>
.player {
  height: 5em;
  width: 12em;
}

.profileImg {
  max-height: 4em;
  max-width: 4em;
}
</style>
