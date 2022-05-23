import vue from "@vitejs/plugin-vue";

export default {
  /* plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            tag.startsWith("router-") || tag.startsWith("beautiful-chat"),
        },
      },
    }),
  ], */
  plugins: [vue()],
};
