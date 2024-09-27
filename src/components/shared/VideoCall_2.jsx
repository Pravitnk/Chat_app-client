import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Slide,
  Slider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { VideoCall as VideoCallIcon } from "@mui/icons-material";

import { getSocket } from "../../Socket";
import { tranformImage } from "../../libs/features";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import {
  resetVideoCallQueue,
  StartVideoCall,
  updateCallDialog,
} from "../../redux/thunks/videoCall";
import { setVideoCall } from "../../redux/reducers/misc";

import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VideoCall = ({ chats, chatId, open }) => {
  const [user_Id, setUserId] = useState(null);
  const [zegoEngine, setZegoEngine] = useState(undefined);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [retries, setRetries] = useState(3);

  const socket = getSocket();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const audioStreamRef = useRef(null);
  const videoStreamRef = useRef(null);
  const { call_queue, incoming, open_audio_dialog } = useSelector(
    (state) => state.videoCall
  );
  const call_details = call_queue.length > 0 ? call_queue[0] : null;
  console.log("call_details:", call_details);
  const { isVideoCall } = useSelector((state) => state.misc);
  const appID = 1316340950;
  const server = "wss://webliveroom1316340950-api.coolzcloud.com/ws";
  // const server = "f7614f156de7fa36e9636b15e866f549";

  const roomID = call_details?.roomID;
  console.log("roomId....:", roomID);
  const userID = call_details?.userID;
  console.log("userId....:", userID);
  const userName = call_details?.username;
  const audioStreamID = `audio_${call_details?.streamID}`;
  const videoStreamID = `video_${call_details?.streamID}`;

  // console.log("roomId....:", call_details?.roomId);

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
    dispatch(StartVideoCall({ id: user_Id }))
      .then(() => {
        dispatch(setVideoCall(true));
      })
      .catch((error) => {
        console.error("Failed to start video call:", error);
        dispatch(setVideoCall(false));
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

  // const initializeZegoEngine = async (tokenGenerated) => {
  //   if (retries <= 0) {
  //     console.error("Max retries reached. Initialization failed.");
  //     handleDisconnect();
  //     return;
  //   }
  //   const zg = new ZegoExpressEngine(appID, server);
  //   console.log(zg);
  //   zg.setLogConfig({
  //     logLevel: "error",
  //     remoteLogLevel: "disable",
  //   });
  //   setZegoEngine(zg);

  //   try {
  //     const result = await zg.checkSystemRequirements();
  //     const { webRTC, microphone, camera } = result;
  //     console.log("webRTC, microphone, camera", webRTC, microphone, camera);

  //     if (!webRTC || !microphone || !camera) {
  //       throw new Error("WebRTC or Microphone not supported");
  //     }
  //     zg.on("roomStreamUpdate", async (roomId, updateType, streamList) => {
  //       console.log("Stream update:", updateType, streamList);
  //       if (updateType == "ADD") {
  //         for (const stream of streamList) {
  //           const streamID = stream.streamID;
  //           const remoteStream = await zg.startPlayingStream(streamID, {
  //             audio: true,
  //             video: true,
  //           });
  //           const remoteView = zg.createRemoteStreamView(remoteStream);
  //           remoteView.play("remote-video", { enableAutoplayDialog: true });
  //         }
  //       } else if (updateType == "DELETE") {
  //         for (const stream of streamList) {
  //           const streamID = stream.streamID;
  //           zg.stopPlayingStream(streamID);
  //         }
  //       }
  //     });

  //     if (webRTC && microphone && camera) {
  //       await zg
  //         .loginRoom(
  //           roomId,
  //           tokenGenerated,
  //           { userID, userName },
  //           { userUpdate: true }
  //         )
  //         .then(async (result) => {
  //           console.log("login", result);

  //           const localAudioStream = await zg.createStream({
  //             camera: { audio: true, video: false },
  //           });

  //           const localVideoStream = await zg.createStream({
  //             camera: { audio: false, video: true },
  //           });
  //           console.log("audio streaming", localAudioStream);
  //           console.log("video streaming", localVideoStream);

  //           audioStreamRef.current = localAudioStream;
  //           videoStreamRef.current = localVideoStream;

  //           const localAudio = document.getElementById("local-audio");
  //           const localVideo = document.getElementById("local-video");

  //           localAudio.srcObject = localAudioStream;
  //           localVideo.srcObject = localVideoStream;

  //           localAudio.play().catch((error) => {
  //             console.error("Error playing local audio:", error);
  //           });
  //           localVideo.play().catch((error) => {
  //             console.error("Error playing local video:", error);
  //           });

  //           zg.startPublishingStream(audioStreamID, localAudioStream);
  //           zg.startPublishingStream(videoStreamID, localVideoStream);

  //           zg.on("publisherStateUpdate", (result) => {
  //             var state = result["state"];
  //             var streamID = result["streamID"];
  //             var errorCode = result["errorCode"];
  //             var extendedData = result["extendedData"];
  //             console.log("publisherStateUpdate:", result);
  //             // Stream playing status update callback

  //             if (state == "PUBLISHING") {
  //               console.log(
  //                 "Successfully published an audio and video stream:",
  //                 streamID
  //               );
  //             } else if (state == "NO_PUBLISH") {
  //               console.log("No audio and video stream published");
  //             } else if (state == "PUBLISH_REQUESTING") {
  //               console.log(
  //                 "Requesting to publish an audio and video stream:",
  //                 streamID
  //               );
  //             }
  //             console.log(
  //               "Error code:",
  //               errorCode,
  //               " Extra info:",
  //               extendedData
  //             );
  //           });

  //           zg.on("publishQualityUpdate", (streamID, stats) => {
  //             console.log("publishQualityUpdate:", streamID, stats);
  //           });
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });

  //       // Callback for updates on the current user's room connection status.
  //       zg.on("roomStateUpdate", (roomId, reason, errorCode, extendedData) => {
  //         console.log(
  //           "Room state update:",
  //           roomId,
  //           reason,
  //           errorCode,
  //           extendedData
  //         );
  //         if (reason === "CONNECTING") {
  //           setConnectionStatus("Connecting...");
  //           console.log("conneting");
  //         }
  //         if (reason === "LOGINED") {
  //           setConnectionStatus("LOGINED");
  //           console.log("LOGINED successfully");
  //         }
  //         if (reason === "DISCONNECTED") {
  //           setConnectionStatus("Disconnected");
  //           console.log("Disconneted successfully");
  //           handleDisconnect(zg); // Pass zg to handleDisconnect
  //         }
  //       });

  //       console.log("before roomUserUpdate");
  //       // zg.on("roomUserUpdate", async (roomId, updateType, userList) => {
  //       //   console.warn(
  //       //     `roomUserUpdate: room ${roomId}, user ${
  //       //       updateType === "ADD" ? "added" : "left"
  //       //     } `,
  //       //     JSON.stringify(userList)
  //       //   );
  //       //   if (updateType !== "ADD") {
  //       //     handleDisconnect(zg); // Pass zg to handleDisconnect
  //       //   } else {
  //       //     try {
  //       //       const audioRemoteStream = await zg.startPlayingStream(
  //       //         `audio_${userID}`
  //       //       );
  //       //       const videoRemoteStream = await zg.startPlayingStream(
  //       //         `video_${userID}`
  //       //       );
  //       //       console.log("audio remote stream", audioRemoteStream);
  //       //       console.log("video remote stream", videoRemoteStream);
  //       //       const remoteAudio = document.getElementById("remote-audio");
  //       //       const remoteVideo = document.getElementById("remote-video");
  //       //       remoteAudio.srcObject = audioRemoteStream;
  //       //       remoteVideo.srcObject = videoRemoteStream;

  //       //       remoteAudio.autoplay = true;
  //       //       remoteVideo.autoplay = true;

  //       //       remoteAudio.controls = false;
  //       //       remoteVideo.controls = false;

  //       //       remoteAudio.play().catch((error) => {
  //       //         console.error("Error playing remote audio:", error);
  //       //       });
  //       //       remoteVideo.play().catch((error) => {
  //       //         console.error("Error playing remote video:", error);
  //       //       });
  //       //     } catch (error) {
  //       //       console.error("Error playing remote streams:", error);
  //       //     }
  //       //   }
  //       // });

  //       zg.on("roomUserUpdate", async (roomId, updateType, userList) => {
  //         if (updateType === "ADD") {
  //           for (var i = 0; i < userList.length; i++) {
  //             console.log(userList[i]["userID"], "joins the room:", roomId);
  //           }
  //         } else if (updateType == "DELETE") {
  //           for (var i = 0; i < userList.length; i++) {
  //             console.log(userList[i]["userID"], "leaves the room:", roomId);
  //           }
  //         }
  //       });

  //       console.log("after roomUserUpdate");

  //       console.log("before roomStreamUpdate");
  //       // zg.on(
  //       //   "roomStreamUpdate",
  //       //   async (roomId, updateType, streamList, extendedData) => {
  //       //     console.log(
  //       //       `roomStreamUpdate: room ${roomId}, updateType ${updateType}`
  //       //     );
  //       //     if (updateType === "ADD") {
  //       //       console.log(
  //       //         "Adding stream:",
  //       //         roomId,
  //       //         updateType,
  //       //         streamList,
  //       //         extendedData
  //       //       );
  //       //       try {
  //       //         for (const stream of streamList) {
  //       //           console.log("Adding stream:", stream.streamID);
  //       //           const remoteStream = await zg.startPlayingStream(
  //       //             stream.streamID
  //       //           );
  //       //           const remoteAudio = document.getElementById("remote-audio");
  //       //           const remoteVideo = document.getElementById("remote-video");

  //       //           if (remoteAudio && remoteVideo) {
  //       //             console.log("Playing remote streams");

  //       //             remoteAudio.srcObject = remoteStream;
  //       //             remoteVideo.srcObject = remoteStream;

  //       //             remoteAudio.autoplay = true;
  //       //             remoteVideo.autoplay = true;

  //       //             remoteAudio.controls = false;
  //       //             remoteVideo.controls = false;

  //       //             remoteAudio.play().catch((error) => {
  //       //               console.error("Error playing remote audio:", error);
  //       //             });
  //       //             remoteVideo.play().catch((error) => {
  //       //               console.error("Error playing remote video:", error);
  //       //             });
  //       //           } else {
  //       //             console.error("Remote audio or video element not found");
  //       //           }
  //       //         }
  //       //       } catch (error) {
  //       //         console.error("Error playing remote streams:", error);
  //       //       }
  //       //     } else if (updateType === "DELETE") {
  //       //       console.log("Stream removed:", roomId, streamList);
  //       //       zg.stopPlayingStream(stream.streamID);
  //       //     }
  //       //   }
  //       // );

  //       console.log("after roomStreamUpdate");

  //       zg.on("playerStateUpdate", (result) => {
  //         // Callback for updates on stream playing status.
  //         console.log("playerStateUpdate", result);
  //       });

  //       zg.on("playQualityUpdate", (streamID, stats) => {
  //         // Callback for reporting stream playing quality.
  //         console.log("playQualityUpdate", streamID, stats);
  //       });
  //       console.log("end");
  //     }
  //   } catch (error) {
  //     console.error("Initialization error:", error);
  //     setRetries(retries - 1);
  //     initializeZegoEngine(tokenGenerated); // Retry initialization
  //   }
  // };

  const initializeZegoEngine = async (tokenGenerated) => {
    if (retries <= 0) {
      console.error("Max retries reached. Initialization failed.");
      handleDisconnect();
      return;
    }
    // Initialize ZegoExpressEngine
    const zg = new ZegoExpressEngine(appID, server);
    zg.setLogConfig({ logLevel: "error", remoteLogLevel: "disable" });
    setZegoEngine(zg);

    try {
      const result = await zg.checkSystemRequirements();
      console.log("browser", result);
      const { webRTC, microphone, camera } = result;
      console.log(
        `webRTC :${webRTC}, microphone :${microphone}, camera :${camera},`
      );

      if (!webRTC || !microphone || !camera) {
        throw new Error("WebRTC or Microphone not supported");
      }

      if (webRTC || !microphone || !camera) {
        await zg
          .loginRoom(
            roomID,
            tokenGenerated,
            { userID, userName },
            { userUpdate: true }
          )
          .then(async (loginResult) => {
            console.log("Login result:", loginResult);
            console.log("token", tokenGenerated);
            console.log("roomId", roomID);
            console.log("user", userID);

            const localAudioStream = await zg.createStream({
              camera: { audio: true, video: false },
            });
            const localVideoStream = await zg.createStream({
              camera: { audio: false, video: true },
            });

            audioStreamRef.current = localAudioStream;
            videoStreamRef.current = localVideoStream;

            const localAudio = document.getElementById("local-audio");
            const localVideo = document.getElementById("local-video");

            localAudio.srcObject = localAudioStream;
            localVideo.srcObject = localVideoStream;

            await localAudio.play();
            await localVideo.play();

            zg.startPublishingStream(audioStreamID, localAudioStream);
            zg.startPublishingStream(videoStreamID, localVideoStream);

            zg.on("publisherStateUpdate", (result) => {
              console.log("publisherStateUpdate:", result);
            });

            zg.on("publishQualityUpdate", (streamID, stats) => {
              console.log("publishQualityUpdate:", streamID, stats);
            });
          })
          .catch((error) => {
            console.log("publishing error..", error);
          });

        console.log("audioStreamID", audioStreamID);
        console.log("videoStreamID", videoStreamID);

        console.log("roomStateUpdate");
        zg.on("roomStateUpdate", (roomID, reason, errorCode, extendedData) => {
          console.log(
            "Room state update:",
            roomID,
            reason,
            errorCode,
            extendedData
          );
          if (reason === "CONNECTING") {
            console.log("connecting..");
          }
          if (reason === "CONNECTED") {
            console.log("connected successfully");
          }
          if (reason === "DISCONNECTED") {
            handleDisconnect(zg); // Pass zg to handleDisconnect
            console.log("disconnected");
          }
        });

        zg.on("roomStateChanged", (roomID, reason, errorCode, extendData) => {
          console.log(reason);
        });

        console.log("roomUserUpdate");
        zg.on("roomUserUpdate", async (roomID, updateType, userList) => {
          console.log("inside roomUserUpdate");
          console.log(
            `roomUserUpdate: room ${roomID}, user ${
              updateType === "ADD" ? "added" : "left"
            }`,
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

        console.log("roomStreamUpdate");
        // Attach event handlers before logging into the room

        zg.on(
          "roomStreamUpdate",
          async (roomID, updateType, streamList, extendedData) => {
            console.log("inside roomStreamUpdate", roomID);
            const remoteAudioStreamID = `audio_${userID}`;
            const remoteVideoStreamID = `video_${userID}`;
            if (updateType == "ADD") {
              console.log("room Stream added");
              const remoteAudioStream = await zg.startPlayingStream(
                remoteAudioStreamID
              );
              const remoteVideoStream = await zg.startPlayingStream(
                remoteVideoStreamID
              );

              const remoteAudio = document.getElementById("remote-audio");
              const remoteVideo = document.getElementById("remote-video");

              if (remoteAudio && remoteVideo) {
                remoteAudio.srcObject = remoteAudioStream;
                remoteVideo.srcObject = remoteVideoStream;
                await remoteAudio.play();
                await remoteVideo.play();
              }
            } else if (updateType == "DELETE") {
              // Handle stream deletion
              zg.stopPublishingStream(audioStreamID);
              zg.stopPublishingStream(videoStreamID);
              zg.destroyStream(audioStreamRef.current);
              zg.destroyStream(videoStreamRef.current);
              zg.logoutRoom(roomID);
            }
          }
        );

        zg.on("playerStateUpdate", (result) => {
          console.log("playerStateUpdate", result);
        });

        zg.on("playQualityUpdate", (streamID, stats) => {
          console.log("playQualityUpdate", streamID, stats);
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
      if (audioStreamRef.current && videoStreamRef.current) {
        socket?.off("video_call_accepted");
        socket?.off("video_call_denied");
        socket?.off("video_call_missed");
        zg.stopPublishingStream(audioStreamID);
        zg.stopPublishingStream(videoStreamID);
        zg.stopPlayingStream(remoteAudioStreamID);
        zg.stopPlayingStream(remoteVideoStreamID);
        zg.destroyStream(audioStreamRef.current);
        zg.destroyStream(videoStreamRef.current);
        zg.destroyEngine();
        zg = null;
        audioStreamRef.current = null;
        videoStreamRef.current = null;
        zg.logoutRoom(roomID);
      }
    }
    setConnectionStatus("Disconnected");
    setZegoEngine(null);
  };
  const endCall = () => {
    handleDisconnect(zegoEngine);
    dispatch(resetVideoCallQueue());
    dispatch(updateCallDialog({ state: false }));

    // dispatch(setAudioCall(false));
  };
  useEffect(() => {
    if (!call_details) return;
    console.log("start");
    console.log("Updated Call Details:", call_details);
    const { roomID } = call_details;
    console.log("roomId from call_details:", roomID);
    const timer = setTimeout(() => {
      socket.emit("video_call_not_picked", {
        to: call_details?.streamID,
        from: userID,
      });
    }, 60 * 1000);

    const handleMissedCall = () => {
      handleDisconnect();
    };

    const handleAcceptedCall = (data) => {
      console.log("call accepted:", data);

      clearTimeout(timer);
    };

    const handleDeniedCall = () => {
      console.log("call denied");
      endCall();
    };

    socket.on("video_call_missed", handleMissedCall);
    socket.on("video_call_accepted", handleAcceptedCall);

    if (!incoming) {
      socket.emit("start_video_call", {
        to: call_details?.streamID,
        from: userID,
        roomID,
      });
    }

    socket.on("video_call_denied", handleDeniedCall);

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
    console.log("end");
  }, [call_details]);

  return (
    <>
      <Tooltip title="Video Call">
        <IconButton
          onClick={startCall}
          sx={{ color: "white", fontSize: "1rem" }}
        >
          <VideoCallIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={endCall}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <Stack direction="row" spacing={15} p={2}>
            <Stack>
              <video
                style={{ height: 250, width: 250 }}
                id="remote-video"
                controls={false}
              />
              <audio id="remote-audio" controls={false} />
            </Stack>
            <Stack>
              <video
                style={{ height: 100, width: 150 }}
                id="local-video"
                controls={false}
              />
              <audio id="local-audio" controls={false} />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={endCall} variant="contained" color="error">
            End Call
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default VideoCall;
