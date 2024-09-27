import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getSocket } from "../../Socket";
import { server } from "../../constants/config";

const initialState = {
  open_video_dialog: false,
  open_video_notification_dialog: false,
  call_queue: [], // can have max 1 call at any point of time
  incoming: false,
};

// Async Thunks

const StartVideoCall = createAsyncThunk(
  "videoCall/StartVideoCall",
  async (requestData, { getState, dispatch }) => {
    try {
      console.log("Starting video call with requestData:", requestData.id);

      dispatch(resetVideoCallQueue());
      console.log("resetAudioCallQueue:", resetVideoCallQueue());

      const { token } = getState().auth;
      if (!requestData.id) {
        throw new Error("id is undefined");
      }
      if (!token) {
        throw new Error("Token is undefined");
      }
      const apiUrl = `${server}/api/v1/chat/start-video-call`;
      const requestDataToSend = {
        id: requestData.id,
        // Add other necessary fields from requestData
      };
      console.log("Requesting API:", apiUrl);
      console.log("Request data:", requestDataToSend);

      const { data } = await axios.post(apiUrl, requestDataToSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        transformRequest: [(data) => JSON.stringify(data)],
      });

      console.log("Response data video call:", data);
      dispatch(
        slice.actions.pushToVideoCallQueue({
          call: data.data,
          incoming: false,
        })
      );
    } catch (error) {
      console.error("Error starting video call:", error);
      throw error; // Rethrow the error to propagate it
    }
  }
);

const PushToVideoCallQueue = createAsyncThunk(
  "videoCall/PushToVideoCallQueue",
  async (call, { dispatch }) => {
    dispatch(pushToVideoCallQueue({ call, incoming: true }));
  }
);

const ResetVideoCallQueue = createAsyncThunk(
  "videoCall/ResetVideoCallQueue",
  async (_, { dispatch }) => {
    dispatch(resetVideoCallQueue());
  }
);

const CloseVideoNotificationDialog = createAsyncThunk(
  "videoCall/CloseVideoNotificationDialog",
  async (_, { dispatch }) => {
    dispatch(closeNotificationDialog());
  }
);

const UpdateVideoCallDialog = createAsyncThunk(
  "videoCall/UpdateVideoCallDialog",
  async ({ state }, { dispatch }) => {
    dispatch(updateCallDialog({ state }));
  }
);

const slice = createSlice({
  name: "videoCall",
  initialState,
  reducers: {
    pushToVideoCallQueue(state, action) {
      if (state.call_queue.length === 0) {
        state.call_queue.push(action.payload.call);
        if (action.payload.incoming) {
          state.open_video_notification_dialog = true; // this will open up the call dialog
          state.incoming = true;
        } else {
          state.open_video_dialog = true;
          state.incoming = false;
        }
      } else {
        const socket = getSocket();
        socket.emit("user_is_busy_video_call", { ...action.payload });
      }
    },
    resetVideoCallQueue(state) {
      state.call_queue = [];
      state.open_video_notification_dialog = false;
      state.incoming = false;
    },
    closeNotificationDialog(state) {
      state.open_video_notification_dialog = false;
    },
    updateCallDialog(state, action) {
      state.open_video_dialog = action.payload.state;
      state.open_video_notification_dialog = false;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  pushToVideoCallQueue,
  resetVideoCallQueue,
  closeNotificationDialog,
  updateCallDialog,
} = slice.actions;

export {
  StartVideoCall,
  PushToVideoCallQueue,
  ResetVideoCallQueue,
  CloseVideoNotificationDialog,
  UpdateVideoCallDialog,
};
