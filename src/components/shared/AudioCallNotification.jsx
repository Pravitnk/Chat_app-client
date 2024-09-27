import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCallDialog,
  resetAudioCallQueue,
  closeNotificationDialog,
} from "../../redux/thunks/audioCall";
import { getSocket } from "../../Socket";
import { setAudioCall } from "../../redux/reducers/misc";
import { tranformImage } from "../../libs/features";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AudioCallNotification = ({ chats, chatId, open }) => {
  const { call_queue, incoming } = useSelector((state) => state.audioCall);
  console.log("incoming Notify...", incoming);

  const call_details = call_queue.length > 0 ? call_queue[0] : null;
  console.log("call_details audio", call_details);
  console.log("audio roomId", call_details?.roomID);
  const to = call_details.userID;
  const from = call_details.streamID;
  const streamID = call_details.userID;
  const roomID = call_details.roomID;
  const dispatch = useDispatch();
  const socket = getSocket();

  // const ringtoneRef = useRef(null);
  const audioRef = useRef(null);

  // useEffect(() => {
  //   const loadAudio = async () => {
  //     const audio = new Audio((await import("./ring.mp3")).default);
  //     audioRef.current = audio;

  //     if (open) {
  //       audio
  //         .play()
  //         .catch((error) => console.error("Error playing audio:", error));
  //     }

  //     return audio;
  //   };

  //   let audio;
  //   loadAudio().then((loadedAudio) => {
  //     audio = loadedAudio;
  //   });

  //   return () => {
  //     if (audio) {
  //       audio.pause();
  //       audio.currentTime = 0;
  //     }
  //   };
  // }, [open]);

  const handleClose = () => {
    dispatch(closeNotificationDialog());
    dispatch(updateCallDialog({ state: false }));
  };

  const handleAccept = () => {
    socket.emit("audio_call_accepted", { from, to, streamID, roomID });
    dispatch(updateCallDialog({ state: true }));
    console.log(
      `${call_details?.roomID} ${call_details?.userID} ${call_details?.streamID}`
    );
  };

  const handleDeny = () => {
    socket.emit("audio_call_denied", { ...call_details });
    dispatch(resetAudioCallQueue());
    handleClose();
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleDeny}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent>
        {chats?.map((data) =>
          chatId === data._id ? (
            <Typography
              variant="h6"
              component="h2"
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              key={data._id}
            >
              Incoming Voice_Call from {data.name}...
            </Typography>
          ) : null
        )}
        <Stack
          direction="row"
          spacing={24}
          p={2}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Stack>
            {chats?.map((data) =>
              chatId === data._id ? (
                <Avatar
                  sx={{ height: 100, width: 100 }}
                  key={data._id}
                  src={
                    Array.isArray(data.avatar) && data.avatar.length > 0
                      ? tranformImage(data.avatar[0])
                      : ""
                  }
                />
              ) : null
            )}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-evenly",
        }}
      >
        <Button onClick={handleAccept} variant="contained" color="success">
          Accept
        </Button>
        <Button onClick={handleDeny} variant="contained" color="error">
          Deny
        </Button>
      </DialogActions>
      {/* <audio src="./ring.mp3" loop /> */}
    </Dialog>
  );
};

export default AudioCallNotification;
