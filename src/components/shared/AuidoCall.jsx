import React, { useRef, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Call as VoiceCallIcon } from "@mui/icons-material";
import { tranformImage } from "../../libs/features";
import { getSocket } from "../../Socket";
import axios from "axios";
import {
  resetAudioCallQueue,
  startAudioCall,
  updateCallDialog,
} from "../../redux/thunks/audioCall";
import { setAudioCall } from "../../redux/reducers/misc";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { TypingLoader } from "../layout/Loaders";

const CallDialog = ({ chats, chatId, user, open }) => {
  const [user_Id, setUserId] = useState(null);
  const [zegoEngine, setZegoEngine] = useState(undefined);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [retries, setRetries] = useState(3);

  const socket = getSocket();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const audioStreamRef = useRef(null);
  const { call_queue, incoming, open_audio_dialog } = useSelector(
    (state) => state.audioCall
  );
  const call_details = call_queue.length > 0 ? call_queue[0] : null;
  const { isAudioCall } = useSelector((state) => state.misc);
  const appID = 1316340950;
  const server = "wss://webliveroom1316340950-api.coolzcloud.com/ws";

  const roomID = call_details?.roomID;
  const userID = call_details?.userID;
  const userName = call_details?.username;
  const streamID = call_details?.streamID;

  const getUserIdFromChats = (chats, chatId) => {
    const selectedChat = chats.find((chat) => chat._id === chatId);
    if (
      selectedChat &&
      !selectedChat.groupChat &&
      selectedChat.members.length > 0
    ) {
      return selectedChat.members[0];
    }
    return null;
  };

  useEffect(() => {
    if (chatId && chats.length > 0) {
      const newUserId = getUserIdFromChats(chats, chatId);
      setUserId(newUserId);
    }
  }, [chatId, chats]);

  const startCall = () => {
    if (!user_Id) {
      console.error("No Receiver's ID");
      return;
    }
    dispatch(startAudioCall({ id: user_Id }))
      .then(() => {
        dispatch(setAudioCall(true));
      })
      .catch((error) => {
        console.error("Failed to start audio call:", error);
        dispatch(setAudioCall(false));
      });
  };

  const fetchToken = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/chat/generate-zego-token`,
        {
          userId: userID,
          roomID: roomID,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.token;
    } catch (error) {
      console.error("Error fetching token:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      throw error;
    }
  };

  const initializeZegoEngine = async (tokenGenerated) => {
    if (retries <= 0) {
      console.error("Max retries reached. Initialization failed.");
      handleDisconnect();
      return;
    }
    const zg = new ZegoExpressEngine(appID, server);
    zg.setLogConfig({
      logLevel: "error",
      remoteLogLevel: "disable",
    });
    setZegoEngine(zg);

    try {
      const result = await zg.checkSystemRequirements();
      const { webRTC, microphone } = result;
      console.log(`webRTC: ${webRTC} and microphone: ${microphone}`);

      if (!webRTC || !microphone) {
        throw new Error("WebRTC or Microphone not supported");
      }

      if (webRTC && microphone) {
        await zg
          .loginRoom(
            roomID,
            tokenGenerated,
            { userID, userName },
            { userUpdate: true }
          )
          .then(async (result) => {
            console.log("login:", result);

            const localStream = await zg.createStream({
              camera: { audio: true, video: false },
            });
            audioStreamRef.current = localStream;
            console.log("local stream :", localStream);

            const localAudio = document.getElementById("local-audio");
            localAudio.srcObject = localStream;
            await localAudio.play();

            zg.startPublishingStream(streamID, localStream);

            zg.on("publisherStateUpdate", (result) => {
              console.log("publisherStateUpdate:", result);
            });

            zg.on("publishQualityUpdate", (streamID, stats) => {
              console.log("publishQualityUpdate:", streamID, stats);
            });
          })
          .catch((error) => {
            console.error(error);
          });

        zg.on("roomStateUpdate", (roomID, state, errorCode, extendedData) => {
          console.log(
            "Room state update:",
            roomID,
            state,
            errorCode,
            extendedData
          );
          if (state === "CONNECTING") {
            console.log("conneting");
            setConnectionStatus("Connecting...");
          } else if (state === "CONNECTED") {
            console.log("conneted successfully");
            setConnectionStatus("Connected");
          } else if (state === "DISCONNECTED") {
            setConnectionStatus("Disconnected");
            handleDisconnect(zg); // Pass zg to handleDisconnect
          }
        });

        zg.on("roomUserUpdate", async (roomID, updateType, userList) => {
          console.log("roomUserUpdate", roomID);
          console.warn(
            `roomUserUpdate: room ${roomID}, user ${
              updateType === "ADD" ? "added" : "left"
            } `,
            JSON.stringify(userList)
          );

          if (updateType == "ADD") {
            userList.forEach((user) => {
              console.log(`${user.userID} joins the room: ${roomID}`);
            });
          } else if (updateType == "DELETE") {
            userList.forEach((user) => {
              console.log(`${user.userID} leaves the room: ${roomID}`);
            });
          }
        });

        zg.on(
          "roomStreamUpdate",
          async (roomID, updateType, streamList, extendedData) => {
            console.log(
              `roomStreamUpdate: room ${roomID}, updateType ${updateType}`
            );
            if (updateType === "ADD") {
              console.log(
                "Adding stream:",
                roomID,
                updateType,
                streamList,
                extendedData
              );
              console.log("Adding stream:", userID);
              const remoteStream = await zg.startPlayingStream(userID);
              const remoteAudio = document.getElementById("remote-audio");
              remoteAudio.srcObject = remoteStream;
              remoteAudio.play();
            } else if (updateType === "DELETE") {
              console.log("Stream removed:", roomID, streamList);
              zg.stopPublishingStream(streamID);
              zg.destroyStream(audioStreamRef.current);
              audioStreamRef.current = null;
              zg.logoutRoom(roomID);
            }
          }
        );

        zg.on("playerStateUpdate", (result) => {
          console.log("playerStateUpdate:", result);
        });

        zg.on("playQualityUpdate", (streamID, stats) => {
          console.log("playQualityUpdate:", streamID, stats);
        });
      }
    } catch (error) {
      console.error("Initialization error:", error);
      setRetries(retries - 1);
      initializeZegoEngine(tokenGenerated); // Retry initialization
    }
  };

  const handleDisconnect = (zg) => {
    if (zg) {
      socket.on("audio_call_missed");
      socket.on("audio_call_accepted");
      socket.on("audio_call_denied");
      if (audioStreamRef.current) {
        zg.stopPublishingStream(streamID);
        zg.destroyStream(audioStreamRef.current);
        audioStreamRef.current = null;
      }
      zg.logoutRoom(roomID);
    }
    setConnectionStatus("Disconnected");
    setZegoEngine(null);
  };

  useEffect(() => {
    if (!call_details) return;

    const timer = setTimeout(() => {
      socket.emit("audio_call_not_picked", { to: streamID, from: userID });
    }, 30 * 1000);

    const handleMissedCall = () => {
      handleDisconnect();
    };

    const handleAcceptedCall = () => {
      clearTimeout(timer);
    };

    const handleDeniedCall = () => {
      console.log("call denied");
      endCall();
    };

    socket.on("audio_call_missed", handleMissedCall);
    socket.on("audio_call_accepted", handleAcceptedCall);
    socket.on("audio_call_denied", handleDeniedCall);

    if (!incoming) {
      socket.emit("start_audio_call", { to: streamID, from: userID, roomID });
    }

    if (call_details) {
      fetchToken()
        .then((token) => {
          initializeZegoEngine(token);
        })
        .catch((error) => {
          console.error("Error initializing ZegoEngine:", error);
          handleDisconnect(zegoEngine); // Pass zegoEngine to handleDisconnect
        });
    }
  }, [call_details]);

  const endCall = () => {
    handleDisconnect(zegoEngine);
    dispatch(resetAudioCallQueue());
    dispatch(updateCallDialog({ state: false }));

    // dispatch(setAudioCall(false));
  };

  return (
    <>
      <Tooltip title="Voice Call">
        <IconButton
          onClick={startCall}
          sx={{ color: "white", fontSize: "1rem" }}
        >
          <VoiceCallIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={endCall}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <Stack direction="row" spacing={10} p={2}>
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
                    {data.name}
                  </Typography>
                ) : null
              )}

              <audio id="remote-audio" controls={false} />
            </Stack>

            <Stack direction={"row"} alignItems={"center"} sx={{ gap: "5px" }}>
              {<TypingLoader />}
            </Stack>

            <Stack>
              <Avatar
                sx={{ height: 100, width: 100 }}
                src={user?.avatar?.url}
              />
              <Typography
                variant="h6"
                component="h2"
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                {user?.name}
              </Typography>
              <audio id="local-audio" controls={false} />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            color="error"
            variant="contained"
            size="large"
            onClick={endCall}
          >
            End
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CallDialog;
