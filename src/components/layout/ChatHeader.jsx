import { Avatar, Backdrop, Stack, Typography } from "@mui/material";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tranformImage } from "../../libs/features";
import PropTypes from "prop-types";
import { getSocket } from "../../Socket";
import {
  closeNotificationDialog,
  handleIncomingCall,
  resetAudioCallQueue,
  updateCallDialog,
} from "../../redux/thunks/audioCall";
import { PushToVideoCallQueue } from "../../redux/thunks/videoCall";

const VideoCall = lazy(() => import("../shared/VideoCall_2"));
const AudioCall = lazy(() => import("../shared/AuidoCall"));
const AudioCallNotification = lazy(() =>
  import("../shared/AudioCallNotification")
);
const VideoCallNotification = lazy(() =>
  import("../shared/VideoCallNotification")
);

const ChatHeader = ({ chatId, chats = [], onlineUsers, user }) => {
  const { open_video_notification_dialog, open_video_dialog } = useSelector(
    (state) => state.videoCall
  );

  const {
    open_audio_notification_dialog,
    open_audio_dialog,
    incoming,
    call_queue,
  } = useSelector((state) => state.audioCall);
  const call_details = call_queue.length > 0 ? call_queue[0] : null;
  const dispatch = useDispatch();
  const socket = getSocket();

  useEffect(() => {
    console.log("Listening for audio_call_notification...");

    // Listen for incoming call events from the server
    socket.on("audio_call_notification", (data) => {
      console.log("Incoming audio call notification", data);
      dispatch(handleIncomingCall(data));
    });

    // socket.on("on_another_audio_call", () => {
    //   dispatch(resetAudioCallQueue());
    // });

    console.log("Incoming:", incoming); // Check if incoming state updates correctly

    return () => {
      socket.off("audio_call_notification");

      // socket.off("on_another_audio_call");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    console.log("Listening for audio_call_notification...");

    // Listen for incoming call events from the server
    socket.on("video_call_notification", (data) => {
      console.log("Incoming video call notification", data);
      dispatch(PushToVideoCallQueue(data));
    });

    console.log("Incoming:", incoming); // Check if incoming state updates correctly

    return () => {
      socket.off("video_call_notification");
    };
  }, [dispatch, socket]);

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{
        height: "10vh",
        padding: "0 1rem",
        bgcolor: "#2b2b2b",
        color: "white",
      }}
    >
      {chats?.map((data) =>
        chatId === data._id ? (
          <Avatar
            sx={{ height: "9vh", width: "9vh" }}
            key={data._id}
            // src={data?.avatar}

            src={
              Array.isArray(data.avatar) && data.avatar.length > 0
                ? tranformImage(data.avatar[0])
                : ""
            }
          />
        ) : null
      )}
      <Stack>
        {chats.map((data) =>
          chatId === data._id ? (
            <React.Fragment key={data._id}>
              <Typography variant="h6">{data.name}</Typography>
              {!data.groupChat &&
              data.members?.some((member) => onlineUsers.includes(member)) ? (
                <Typography variant="body2" sx={{ color: "#15ff0d" }}>
                  online
                </Typography>
              ) : (
                <Typography variant="body2"></Typography>
              )}
            </React.Fragment>
          ) : null
        )}
      </Stack>
      <Stack direction={"row"} spacing={"0rem"}>
        <Suspense fallback={<Backdrop open />}>
          <VideoCall chats={chats} chatId={chatId} open={open_video_dialog} />
        </Suspense>

        <Suspense fallback={<Backdrop open />}>
          <AudioCall
            chats={chats}
            chatId={chatId}
            user={user}
            open={open_audio_dialog}
          />
        </Suspense>

        <Suspense fallback={<Backdrop open />}>
          {open_audio_notification_dialog && (
            <AudioCallNotification
              chats={chats}
              chatId={chatId}
              open={open_audio_notification_dialog}
            />
          )}
        </Suspense>

        <Suspense fallback={<Backdrop open />}>
          {open_video_notification_dialog && (
            <VideoCallNotification
              chats={chats}
              chatId={chatId}
              open={open_video_notification_dialog}
            />
          )}
        </Suspense>
      </Stack>
    </Stack>
  );
};

ChatHeader.propTypes = {
  chatId: PropTypes.string.isRequired,
  chats: PropTypes.arrayOf(PropTypes.object).isRequired,
  onlineUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ChatHeader;
