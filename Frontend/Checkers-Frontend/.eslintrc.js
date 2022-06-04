module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/base",
    "plugin:vue/vue3-essential",
    "plugin:vue/vue3-strongly-recommended",
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/require-valid-default-prop": "off",
    "vue/no-empty-component-block": "error",
    /**"vue/html-comment-content-newline": ["error",
        {
          "singleline": "always" | "never" | "ignore",
          "multiline": "always" | "never" | "ignore",
        },
        {
          "exceptions": []
        }
      ],
      "vue/html-comment-content-spacing": ["error",
        "always" | "never",
        {
          "exceptions": []
        }
      ],
      "vue/html-comment-indent": ["error", type],**/
  },
};
