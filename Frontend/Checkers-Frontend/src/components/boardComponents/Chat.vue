<!-- This is the Chat component -->

<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :on-message-was-sent="sendMessage"
      :message-list="messageList"
      :new-messages-count="newMessagesCount"
      :is-open="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :show-edition="true"
      :show-deletion="true"
      :deletion-confirmation="true"
      :show-typing-indicator="showTypingIndicator"
      :show-launcher="true"
      :colors="colors"
      :always-scroll-to-bottom="alwaysScrollToBottom"
      :disable-user-list-toggle="false"
      :message-styling="messageStyling"
      @edit="editMessage"
    />
  </div>
</template>

<script>
import api from "../../api.js";

export default {
  name: "App",
  props: {
    opponent: { type: Object, default: () => {} },
    lobbyId: { type: String, default: "" },
  },
  data() {
    return {
      participants: [
        {
          id: "",
          name: "",
          imageUrl: "",
        },
      ], // The list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      messageList: [], // The list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: true, // To determine whether the chat window should be open or closed
      showTypingIndicator: "", // When set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: "#1F1E1E",
          text: "#ffffff",
        },
        launcher: {
          bg: "#1F1E1E",
          text: "#ffffff",
        },
        messageList: {
          bg: "#ffffff",
        },
        sentMessage: {
          bg: "#306844",
          text: "#ffffff",
        },
        receivedMessage: {
          bg: "#343232",
          text: "#ffffff",
        },
        userInput: {
          bg: "#343232",
          text: "#ffffff",
        },
      }, // Specifies the color scheme for the component
      alwaysScrollToBottom: false,
      messageStyling: true,
      socket: this.$socket,
    };
  },
  methods: {
    // Called when a player send a message
    sendMessage(message) {
      if (message.data.text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1;
        api.game_msg(this.socket, this.lobbyId, message.data.text);
        this.onMessageWasSent(message);
      }
    },
    // Add the new message to the message list of the chat
    onMessageWasSent(message) {
      this.messageList = [...this.messageList, message];
    },
    // Called when the user clicks on the fab button to open the chat
    openChat() {
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    // Called when the user clicks on the botton to close the chat
    closeChat() {
      this.isChatOpen = false;
    },
    // Edit the new message
    editMessage(message) {
      const m = this.messageList.find((m) => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    },
  },
  sockets: {
    /* c8 ignore start */
    // When there is a message from backend, add it to the chat if is not mine
    game_msg(msg) {
      if (this.participants[0].id === "") {
        this.participants[0].id = this.opponent.mail;
        this.participants[0].name = this.opponent.username;
        this.participants[0].imageUrl = this.opponent.avatar;
      }
      var text = this.participants[0].name.toUpperCase() + ": " + msg.message;
      if (msg.sender !== this.$store.getters.user.mail) {
        this.onMessageWasSent({
          type: "text",
          author: this.participants[0].mail,
          data: { text },
        });
      }
    },
    /* c8 ignore end */
  },
};
</script>

<style>
.sc-header--title {
  display: none;
}
.sc-header--close-button {
  display: none;
}
.sc-message--avatar {
  padding: 1rem;
}

@media (max-width: 450px) {
  div.sc-chat-window.opened {
    height: 80%;
    max-height: 100%;
    bottom: 90px;
    background: none;
  }
}
</style>
