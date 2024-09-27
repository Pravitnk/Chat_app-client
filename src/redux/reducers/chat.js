import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../libs/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const initialState = {
  notificationsCount: 0,
  newMessagesAlert: getOrSaveFromStorage({
    key: NEW_MESSAGE_ALERT,
    get: true,
  }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
};

const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotificationCount: (state) => {
      state.notificationsCount += 1;
    },
    resetNotificationCount: (state) => {
      state.notificationsCount = 0;
    },

    setNewMessageAlert: (state, action) => {
      const chatId = action.payload.chatId;
      const index = state.newMessagesAlert.findIndex(
        (item) => item.chatId === chatId
      );

      if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId,
          count: 1,
        });
      }
    },

    removeNewMessagesAlert: (state, action) => {
      state.newMessagesAlert = state.newMessagesAlert.filter(
        (item) => item.chatId !== action.payload
      );
    },
  },
});

export default ChatSlice;
export const {
  incrementNotificationCount,
  resetNotificationCount,
  setNewMessageAlert,
  removeNewMessagesAlert,
} = ChatSlice.actions;
