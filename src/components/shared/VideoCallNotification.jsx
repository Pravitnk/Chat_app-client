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
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getSocket } from "../../Socket";
import {
  CloseVideoNotificationDialog,
  ResetVideoCallQueue,
  UpdateVideoCallDialog,
} from "../../redux/thunks/videoCall";
import { tranformImage } from "../../libs/features";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CallNotification = ({ open, chats, chatId }) => {
  const dispatch = useDispatch();
  const { call_queue, incoming } = useSelector((state) => state.videoCall);

  const call_details = call_queue.length > 0 ? call_queue[0] : null;

  console.log("call_details outside: ", call_details);

  console.log("userID", call_details.userID);
  console.log("to", call_details.streamID);
  const to = call_details.userID;
  const from = call_details.streamID;
  const streamID = call_details.userID;
  const roomID = call_details.roomID;
  console.log("noti0fy roomID:", roomID);

  const socket = getSocket();

  const handleClose = () => {
    dispatch(CloseVideoNotificationDialog());
    dispatch(UpdateVideoCallDialog({ state: false }));
  };

  const handleAccept = () => {
    socket.emit("video_call_accepted", { from, to, streamID, roomID });
    dispatch(UpdateVideoCallDialog({ state: true }));
    console.log(
      `call accepted from: ${from} to: ${to} with roomId: ${roomID} and streamID: ${streamID}`
    );
    console.log("call_details: ", call_details);
  };

  const handleDeny = () => {
    //
    socket.emit("video_call_denied", { from, to });
    dispatch(ResetVideoCallQueue());
    handleClose();
  };

  return (
    <>
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
                Incoming VideoCall from {data.name}...
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
      </Dialog>
    </>
  );
};

export default CallNotification;
