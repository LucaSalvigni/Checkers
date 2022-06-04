<!-- Custom component that represent a link for the Sidebar -->
<template>
  <router-link
    :to="to"
    class="this.to self-center link rounded-lg flex"
    :class="{ active: isActive }"
    @click="buttonClick(buttonSound)"
  >
    <i class="icon" :class="icon" />
    <button class="btn btn-ghost"><slot /></button>
  </router-link>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  props: {
    to: { type: String, default: "" },
    icon: { type: String, default: "" },
    click: { type: String, default: "" },
    needslogin: { type: Boolean, default: false },
  },
  emits: ["needs-login"],
  setup(props) {
    const route = useRoute();
    const isActive = computed(() => route.path === props.to);
    return { isActive };
  },
  data() {
    return {
      buttonSound: this.$BUTTON_CLICK,
    };
  },
  methods: {
    buttonClick(sound) {
      sound.play();
      if (!this.$store.getters.token && this.needslogin) {
        this.$emit("needs-login");
      }
    },
  },
};
</script>

<style scoped>
button {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-style: italic;
  font-weight: 700;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.link {
  align-items: center;
  color: #cdcbcb;
  text-decoration: none;
  transition: 0.2s;
}
button:hover {
  background-color: transparent;
}
.link:hover {
  background-color: var(--sidebar-item-hover);
}
.link.active {
  background-color: var(--sidebar-item-active);
}
.link .icon {
  width: 25px;
  margin-right: 10px;
}

@media only screen and (max-width: 1200px) {
  .btn {
    visibility: hidden;
    width: 0;
  }
  .icon {
    width: 1.3rem;
    height: 1.3rem;
  }
}

@media only screen and (max-width: 785px) {
  .btn {
    visibility: visible;
    width: auto;
  }
  .login button,
  .profile button,
  .leaderboard button,
  .indicator button {
    display: none;
  }
  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
