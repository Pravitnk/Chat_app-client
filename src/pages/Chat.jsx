import { React, lazy, useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { greyColor } from "../constants/color";
import {
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponent";
import FileMenu from "../components/dialog/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvent } from "../hooks/Hooks";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEFT,
  NEW_MESSAGES,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";
import Picker from "emoji-picker-react";
import { getSocket } from "../Socket";
// import { encryptMessage, getPublicKey } from "../libs/features";

const ChatHeader = lazy(() => import("../components/layout/ChatHeader"));

const Chat = ({ chatId, user, chats, onlineUsers }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchore, setFileMenuAnchore] = useState(null);

  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeOut = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk?.data?.message
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIsTyping(true);
    }

    if (typingTimeOut.current) clearTimeout(typingTimeOut.current);

    typingTimeOut.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIsTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchore(e.currentTarget);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // emmiting message to the server
    socket.emit(NEW_MESSAGES, { chatId, members, message });

    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });

    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessage("");
      setMessages([]);
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEFT, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "asdsdssdscdasf",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandlers = {
    [ALERT]: alertListener,
    [NEW_MESSAGES]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvent(socket, eventHandlers);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  //emoji management

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const onEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    setMessage((prevMessage) => prevMessage + emoji);
  };

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <ChatHeader
        chatId={chatId}
        onlineUsers={onlineUsers}
        chats={chats}
        user={user}
      />
      <Stack
        style={{
          bgcolor: "white",
        }}
        ref={containerRef}
        boxSizing={"border-box"}
        borderRadius={"0 0 1rem 1rem"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={"rgba(0, 0, 0,0.2)"}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {/*messages to be display*/}

        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />
      </Stack>

      <form
        style={{
          height: "10%",
        }}
        onSubmit={sendMessage}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "0.8rem",
              rotate: "30deg",
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          <IconButton
            sx={{
              position: "absolute",
              left: "2.5rem",
            }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)} //handling emoji picker
          >
            <EmojiEmotionsIcon />
          </IconButton>

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              style={{ position: "absolute", bottom: "100%", left: "4rem" }}
            >
              <Picker theme="dark" onEmojiClick={onEmojiClick} />
            </div>
          )}

          <InputBox
            placeholder="Type your Message"
            value={message}
            onChange={messageOnChange}
            sx={{
              bgcolor: "#e7e0e0;",
              marginLeft: "0rem",
            }}
          />

          <IconButton
            type="submit"
            sx={{
              rotate: "-5deg",
              bgcolor: "#610cff",
              color: "white",
              marginLeft: "0.7rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "rgb(22, 124, 240)",
                padding: "0.6rem",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorEl={fileMenuAnchore} chatId={chatId} />
    </>
  );
};

export default AppLayout()(Chat);
