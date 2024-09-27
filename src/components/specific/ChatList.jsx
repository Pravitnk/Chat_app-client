import { Stack } from "@mui/material";
import React from "react";
import ChatItem from "../shared/ChatItem";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <Stack
      overflow={"auto"}
      width={w}
      direction={"column"}
      style={{
        height: "110vh",
        background: "black",
        // backdropFilter: "blur(10px)",
        // WebkitBackdropFilter: "blur(10px)",
        borderLeft: "2px solid #610cff",
      }}
    >
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;

        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        const isOnline = members?.some((member) =>
          onlineUsers.includes(member)
        );
        return (
          <ChatItem
            index={index}
            newMessageAlert={newMessageAlert}
            name={name}
            isOnline={isOnline}
            avatar={avatar}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
